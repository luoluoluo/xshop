import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createTypeOrmConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '../entities/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
  };
};
