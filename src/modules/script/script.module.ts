import { Module } from '@nestjs/common';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';
import { TreasuryModule } from '../treasury';
import { AddressModule } from '../address';

@Module({
  imports: [TreasuryModule,AddressModule],
  controllers: [ScriptController],
  providers: [ScriptService],
})
export class ScriptModule {}
