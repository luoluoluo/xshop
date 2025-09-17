import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { StoreModule } from './modules/store/store.module';
import { TaskAppModule } from './modules/_common/task/task-app.module';
import { CreatorModule } from './modules/creator/creator.module';
// import { createLogger } from './core/logger.config';

const getServers = () => {
  return [
    {
      module: AdminModule,
      port: process.env.ADMIN_PORT || 4000,
      name: 'admin',
    },
    {
      module: StoreModule,
      port: process.env.STORE_PORT || 4001,
      name: 'store',
    },
    {
      module: CreatorModule,
      port: process.env.CREATOR_PORT || 4002,
      name: 'creator',
    },
  ];
};

async function bootstrap() {
  // const logger = createLogger();

  // Start task service independently
  const taskApp = await NestFactory.create(TaskAppModule, {
    // logger,
  });
  await taskApp.init();
  console.log('Task service initialized');

  // start store service
  const servers = getServers();
  await Promise.all(
    servers.map(async (server) => {
      const app = await NestFactory.create(server.module, {
        cors: {
          origin: '*',
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          preflightContinue: false,
          optionsSuccessStatus: 204,
          credentials: true,
        },
        rawBody: true,
        // logger,
      });
      await app.listen(server.port, () => {
        console.log(`${server.name} server is running on port ${server.port}`);
      });
    }),
  );
}
bootstrap();
