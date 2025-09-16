import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ConfigModule } from '@nestjs/config';
import { FileResolver } from './file.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FileController],
  exports: [FileService, FileResolver],
  providers: [FileService, FileResolver],
})
export class FileModule {}
