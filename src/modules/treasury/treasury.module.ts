import { Module } from '@nestjs/common';
import { TreasuryService } from './treasury.service';
import { TreasuryController } from './treasury.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasury } from './treasury.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Treasury])],
  providers: [TreasuryService],
  exports: [TreasuryService],
  controllers: [TreasuryController],
})
export class TreasuryModule {}
