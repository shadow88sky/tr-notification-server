import { forwardRef, Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BalanceModule } from './../balance';
import { AddressModule } from './../address';
import { HistoryModule } from './../history';
import { ConfigModule } from './../config';

@Module({
  imports: [
    BalanceModule,
    forwardRef(() => AddressModule),
    HistoryModule,
    ConfigModule,
  ],
  exports: [SyncService],
  providers: [SyncService],
})
export class SyncModule {}
