import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

dotenv.config();

const config: DataSourceOptions = {
  type: 'mysql',
  url: process.env.DATABASE_URL,
  logging: process.env.DB_LOGGING?.toLowerCase() === 'true',
  bigNumberStrings: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
  migrationsTableName: 'migration',
  synchronize: process.env.DB_SYNCHORNIZE?.toLowerCase() === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: ['src/**/**.subscriber.js'],
};

export default new DataSource(config);
