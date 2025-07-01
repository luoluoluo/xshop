import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { getJwtExpiresIn } from '@/core/auth.config';
import { getJwtOptions } from '@/core/auth.config';
import { Logger } from '@nestjs/common';

export class FileAuthPayload {
  sub: string;
  iat: number;
}

@Injectable()
export class FileService {
  private uploadDir: string;
  private jwtService: JwtService;
  constructor(private readonly configService: ConfigService) {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR');
    this.uploadDir = uploadDir || path.join(process.cwd(), 'files');
    this.jwtService = new JwtService(getJwtOptions(configService));
  }

  // 检验token
  verify(token: string) {
    return this.jwtService.verify<FileAuthPayload>(token);
  }

  // 生成唯一的文件名
  getUniqueFilename(filename: string) {
    const dirname = path.dirname(filename);
    const basename = path.basename(filename);
    const randomString = Math.random().toString(36).substring(2, 15);
    return path.join(
      dirname,
      dayjs().format('YYYYMMDD'),
      `${randomString}-${basename}`,
    );
  }

  sign(key: string) {
    const iat = Math.floor(Date.now() / 1000);
    const expiresIn = getJwtExpiresIn();
    const payload = { sub: key, iat };
    return this.jwtService.sign(payload, { expiresIn });
  }
  getFilePath(filename: string) {
    return path.join(this.uploadDir, filename);
  }

  async deleteFile(filename: string) {
    const filePath = this.getFilePath(filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
  /**
   * 检查文件是否为图片
   */
  isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  /**
   * 根据文件扩展名获取Content-Type
   */
  getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * 裁剪/调整图片尺寸
   */
  async resizeImage(
    filePath: string,
    width?: number,
    height?: number,
  ): Promise<Buffer> {
    if (!this.isImageFile(filePath)) {
      throw new Error('文件不是图片格式');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error('文件不存在');
    }

    const image = sharp(filePath);

    if (width || height) {
      return await image
        .resize(width, height, {
          fit: 'cover',
          position: 'center',
        })
        .toBuffer();
    }

    return await image.toBuffer();
  }

  /**
   * 生成缓存文件路径
   */
  private getCacheFilePath(
    originalPath: string,
    width?: number,
    height?: number,
  ): string {
    if (!width && !height) {
      return originalPath;
    }

    const ext = path.extname(originalPath);
    const nameWithoutExt = originalPath.replace(ext, '');
    const sizeStr = `${width || 'auto'}x${height || 'auto'}`;
    const cacheDir = path.join(this.uploadDir, '.cache');
    const relativePath = path.relative(this.uploadDir, nameWithoutExt);

    return path.join(cacheDir, `${relativePath}_${sizeStr}${ext}`);
  }

  /**
   * 获取裁剪图片（带缓存）
   */
  async getResizedImage(
    filePath: string,
    width?: number,
    height?: number,
  ): Promise<Buffer> {
    if (!this.isImageFile(filePath)) {
      throw new Error('文件不是图片格式');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error('文件不存在');
    }

    // 如果没有尺寸参数，直接返回原图
    if (!width && !height) {
      return await fs.promises.readFile(filePath);
    }

    // 生成缓存文件路径
    const cacheFilePath = this.getCacheFilePath(filePath, width, height);

    // 检查缓存是否存在且比原文件新
    if (await this.isCacheValid(filePath, cacheFilePath)) {
      return await fs.promises.readFile(cacheFilePath);
    }

    // 缓存不存在或已过期，重新生成
    const resizedBuffer = await this.resizeImage(filePath, width, height);

    // 保存到缓存
    await this.saveCacheFile(cacheFilePath, resizedBuffer);

    return resizedBuffer;
  }

  /**
   * 检查缓存是否有效
   */
  private async isCacheValid(
    originalPath: string,
    cachePath: string,
  ): Promise<boolean> {
    if (!fs.existsSync(cachePath)) {
      return false;
    }

    try {
      const originalStats = await fs.promises.stat(originalPath);
      const cacheStats = await fs.promises.stat(cachePath);

      // 如果缓存文件比原文件新，则缓存有效
      return cacheStats.mtime >= originalStats.mtime;
    } catch (error) {
      return false;
    }
  }

  /**
   * 保存缓存文件
   */
  private async saveCacheFile(
    cachePath: string,
    buffer: Buffer,
  ): Promise<void> {
    try {
      // 确保缓存目录存在
      const cacheDir = path.dirname(cachePath);
      if (!fs.existsSync(cacheDir)) {
        await fs.promises.mkdir(cacheDir, { recursive: true });
      }

      // 写入缓存文件
      await fs.promises.writeFile(cachePath, buffer);
    } catch (error) {
      console.error('保存缓存文件失败:', error);
      // 缓存失败不应该影响主要功能
    }
  }

  /**
   * 清理过期缓存
   */
  async clearExpiredCache(maxAgeHours: number = 24 * 7): Promise<void> {
    const cacheDir = path.join(path.dirname(this.uploadDir), '.cache');
    if (!fs.existsSync(cacheDir)) {
      return;
    }

    const maxAge = maxAgeHours * 60 * 60 * 1000; // 转换为毫秒
    const now = Date.now();

    try {
      await this.clearCacheRecursive(cacheDir, maxAge, now);
    } catch (error) {
      console.error('清理缓存失败:', error);
    }
  }

  /**
   * 递归清理缓存目录
   */
  private async clearCacheRecursive(
    dir: string,
    maxAge: number,
    now: number,
  ): Promise<void> {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await this.clearCacheRecursive(fullPath, maxAge, now);

        // 检查目录是否为空，如果为空则删除
        const remainingFiles = await fs.promises.readdir(fullPath);
        if (remainingFiles.length === 0) {
          await fs.promises.rmdir(fullPath);
        }
      } else {
        const stats = await fs.promises.stat(fullPath);
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.promises.unlink(fullPath);
        }
      }
    }
  }

  async saveFile({ filename, buffer }: { filename: string; buffer: Buffer }) {
    const filePath = this.getFilePath(filename);
    // 确保文件目录存在
    const fileDir = path.dirname(filePath);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    // 写入文件
    await fs.promises.writeFile(filePath, buffer);
    return filename;
  }
}
