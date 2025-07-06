import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { CmsModule } from './modules/cms/cms.module';
import { WebModule } from './modules/web/web.module';
import { PmsModule } from './modules/pms/pms.module';
import { TaskAppModule } from './modules/_common/task/task-app.module';
import { CrmModule } from './modules/crm/crm.module';
// import { createLogger } from './core/logger.config';

const getServers = () => {
  return [
    {
      module: CmsModule,
      port: process.env.CMS_PORT || 3000,
      name: 'cms',
    },
    {
      module: WebModule,
      port: process.env.WEB_PORT || 3001,
      name: 'web',
    },
    {
      module: PmsModule,
      port: process.env.PMS_PORT || 3002,
      name: 'pms',
    },
    {
      module: CrmModule,
      port: process.env.CRM_PORT || 3003,
      name: 'crm',
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

  // start web service
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
        // logger,
      });
      await app.listen(server.port, () => {
        console.log(`${server.name} server is running on port ${server.port}`);
      });
    }),
  );
}
bootstrap();
