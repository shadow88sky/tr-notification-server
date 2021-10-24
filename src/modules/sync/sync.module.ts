import { forwardRef, Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BullModule } from '@nestjs/bull';
import { BitQueryService } from './bitquery/bitquery.service';
import { BalanceModule } from './../balance';
import { AddressModule } from './../address';
import { HistoryModule } from './../history';
import { TreasuryModule } from './../treasury';
import { ConfigModule } from './../config';
import { DebankConsumer } from './consumer/debank.consumer';

@Module({
  imports: [
    BalanceModule,
    forwardRef(() => AddressModule),
    HistoryModule,
    ConfigModule,
    TreasuryModule,
    BullModule.registerQueue({
      name: 'sync',
    }),
  ],
  exports: [SyncService, BitQueryService],
  providers: [SyncService, BitQueryService, DebankConsumer],
})
export class SyncModule {}
