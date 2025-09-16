import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
  Query,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { FileAuthPayload, FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('token') token: string,
  ) {
    if (!file) {
      throw new HttpException('沒有上傳檔案', HttpStatus.BAD_REQUEST);
    }

    if (!token) {
      throw new HttpException('未提供認證 token', HttpStatus.UNAUTHORIZED);
    }

    let payload: FileAuthPayload;

    try {
      // 验证token
      payload = this.fileService.verify(token);
      if (!payload || !payload.sub) {
        throw new HttpException('無效的 token', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.error('token 驗證失敗:', error);
      throw new HttpException('token 驗證失敗', HttpStatus.UNAUTHORIZED);
    }
    // token验证通过，继续保存文件
    await this.fileService.save({
      filename: payload.sub,
      buffer: file.buffer,
    });
  }
  @Get('*params')
  async download(
    @Param('params') params: string[],
    @Res() res: Response,
    @Query('w') width?: string,
    @Query('h') height?: string,
  ) {
    try {
      const filePath = this.fileService.getPath(params.join('/'));

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
      }

      // 如果有宽度或高度参数且文件是图片，进行裁剪
      if ((width || height) && this.fileService.isImage(params.join('/'))) {
        const widthNum = width ? parseInt(width, 10) : undefined;
        const heightNum = height ? parseInt(height, 10) : undefined;

        // 验证参数有效性
        if ((width && isNaN(widthNum!)) || (height && isNaN(heightNum!))) {
          throw new HttpException(
            '无效的宽度或高度参数',
            HttpStatus.BAD_REQUEST,
          );
        }

        // 获取调整后的图片数据
        const resizedImageBuffer = await this.fileService.getResizedImage(
          filePath,
          widthNum || undefined,
          heightNum || undefined,
        );

        // 设置响应头
        res.set({
          'Content-Type': this.fileService.getContentType(params.join('/')),
          'Content-Length': resizedImageBuffer.length.toString(),
        });

        // 发送调整后的图片
        res.send(resizedImageBuffer);
      } else {
        // 直接下载原文件
        res.download(filePath);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('下载文件失败:', error);
      throw new HttpException('下载文件失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('cache')
  async clearCache(@Query('maxAgeHours') maxAgeHours?: string) {
    try {
      const maxAge = maxAgeHours ? parseInt(maxAgeHours, 10) : 24 * 7; // 默认7天
      if (maxAgeHours && isNaN(maxAge)) {
        throw new HttpException('无效的时间参数', HttpStatus.BAD_REQUEST);
      }

      await this.fileService.clearExpiredCache(maxAge);
      return { message: '缓存清理完成', maxAgeHours: maxAge };
    } catch (error) {
      console.error('清理缓存失败:', error);
      throw new HttpException('清理缓存失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('admin/test')
  adminTest() {
    return {
      message: 'File module is working',
      timestamp: new Date().toISOString(),
    };
  }
}
