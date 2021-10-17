import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Balance])],
  exports: [BalanceService],
  providers: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
