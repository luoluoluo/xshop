import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonJwtService } from './jtw.servive';

@Module({
  imports: [ConfigModule],
  providers: [CommonJwtService],
  exports: [CommonJwtService],
})
export class CommonJwtModule {}
