import { forwardRef, Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BitQueryService } from './bitquery/bitquery.service';
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
  exports: [SyncService, BitQueryService],
  providers: [SyncService, BitQueryService],
})
export class SyncModule {}
