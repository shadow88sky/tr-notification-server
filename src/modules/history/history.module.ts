import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';
import { HistoryService } from './history.service';
import { AddressModule } from './../address';

@Module({
  imports: [TypeOrmModule.forFeature([History]), forwardRef(() => AddressModule)],
  exports: [HistoryService],
  providers: [HistoryService],
})
export class HistoryModule {}
