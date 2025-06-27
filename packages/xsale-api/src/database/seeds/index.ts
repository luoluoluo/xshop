import { DataSource } from 'typeorm';
import { adminSeed } from './admin.seed';
import * as dotenv from 'dotenv';
dotenv.config();

export const runSeeds = async (dataSource: DataSource) => {
  try {
    console.log('開始執行資料庫種子...');
    await adminSeed(dataSource);
    console.log('資料庫種子執行完成！');
  } catch (error) {
    console.error('資料庫種子執行失敗：', error);
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
      console.error('種子腳本執行失敗：', error);
      process.exit(1);
    });
}
