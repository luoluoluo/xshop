/**
 * JWT Token 生成脚本
 *
 * 使用方法:
 * 1. 使用 npm 脚本: npm run token [key] [expiresIn]
 * 2. 直接运行: npx ts-node --require tsconfig-paths/register src/scripts/token.ts [key] [expiresIn]
 *
 * 参数:
 * - key: 用户标识符 (必需)
 * - expiresIn: 过期时间，单位秒 (可选，默认7天)
 *
 * 环境变量:
 * - JWT_SECRET: JWT 密钥 (必需)
 *
 * 示例:
 * JWT_SECRET=your-secret npm run token user123
 * JWT_SECRET=your-secret npm run token user123 3600
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CommonJwtService } from '../modules/_common/jwt/jtw.servive';

async function generateToken() {
  // 创建配置模块
  const configModule = ConfigModule.forRoot({
    isGlobal: true,
  });

  // 创建一个最小的应用模块来使用 CommonJwtService
  const { Module } = await import('@nestjs/common');

  @Module({
    imports: [configModule],
    providers: [CommonJwtService],
  })
  class TokenModule {}

  // 创建应用实例
  const app = await NestFactory.createApplicationContext(TokenModule);

  // 获取 CommonJwtService 实例
  const jwtService = app.get(CommonJwtService);

  // 从命令行参数获取 key，如果没有提供则使用默认值
  const key = process.argv[2] || 'default-key';
  const expiresIn = process.argv[3] ? parseInt(process.argv[3]) : undefined;

  try {
    // 生成 token
    const token = jwtService.sign(key, expiresIn);

    console.log('Generated Token:');
    console.log(token);
    console.log('\nToken Details:');
    console.log(`Key: ${key}`);
    console.log(`Expires In: ${expiresIn || 'default (7 days)'} seconds`);

    // 验证生成的 token
    const payload = jwtService.verify(token);
    console.log('\nToken Payload:');
    console.log(JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error('Error generating token:', error);
  } finally {
    // 关闭应用
    await app.close();
  }
}

// 运行脚本
generateToken().catch(console.error);
