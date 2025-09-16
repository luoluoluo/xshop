import { DataSource } from 'typeorm';
import { adminSeed } from './admin.seed';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

const logger = new Logger('Seeds');

export const runSeeds = async (dataSource: DataSource) => {
  try {
    console.log('開始執行資料庫種子...');
    await adminSeed(dataSource);
    console.log('資料庫種子執行完成！');
  } catch (error) {
    logger.error(`种子数据生成失败`, {
      error,
    });
    throw error;
  }
};

// 如果直接运行此文件
if (require.main === module) {
  const dataSource = new DataSource({
    type: 'mysql',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  dataSource
    .initialize()
    .then(async () => {
      await runSeeds(dataSource);
      await dataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      logger.error(`数据库连接失败`, {
        error,
      });
      console.error('Error during Data Source initialization:', error);
      process.exit(1);
    });
}
