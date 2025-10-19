import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AdminModule } from './modules/admin/admin.module';
import { StoreModule } from './modules/store/store.module';
import { TaskAppModule } from './modules/_common/task/task-app.module';
import { CreatorModule } from './modules/creator/creator.module';
// import { createLogger } from './core/logger.config';

async function bootstrap() {
  // const logger = createLogger();

  // 创建主 Express 应用
  const server = express();

  // 配置 CORS
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Start task service independently
  const taskApp = await NestFactory.create(TaskAppModule, {
    // logger,
  });
  await taskApp.init();
  console.log('Task service initialized');

  // 创建三个独立的 NestJS 应用
  const adminApp = await NestFactory.create(AdminModule, new ExpressAdapter(), {
    rawBody: true,
    // logger,
  });

  const storeApp = await NestFactory.create(StoreModule, new ExpressAdapter(), {
    rawBody: true,
    // logger,
  });

  const creatorApp = await NestFactory.create(
    CreatorModule,
    new ExpressAdapter(),
    {
      rawBody: true,
      // logger,
    },
  );

  // 初始化应用
  await adminApp.init();
  await storeApp.init();
  await creatorApp.init();

  // 将三个应用挂载到主服务器的不同路径
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  server.use('/admin', adminApp.getHttpAdapter().getInstance());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  server.use('/store', storeApp.getHttpAdapter().getInstance());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  server.use('/creator', creatorApp.getHttpAdapter().getInstance());

  // 启动统一端口
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Admin GraphQL: http://localhost:${port}/admin`);
    console.log(`Store GraphQL: http://localhost:${port}/store`);
    console.log(`Creator GraphQL: http://localhost:${port}/creator`);
  });
}

void bootstrap();
