import { forwardRef, Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BalanceModule } from './../balance';
import { AddressModule } from './../address';
import { HistoryModule } from './../history';
import { TreasuryModule } from './../treasury';
import { ConfigModule } from './../config';

@Module({
  imports: [
    BalanceModule,
    forwardRef(() => AddressModule),
    HistoryModule,
    ConfigModule,
    TreasuryModule,
  ],
  exports: [SyncService],
  providers: [SyncService],
})
export class SyncModule {}
