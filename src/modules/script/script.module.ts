import { Module } from '@nestjs/common';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';
import { CategoryModule } from '../category';
import { AddressModule } from '../address';

@Module({
  imports: [CategoryModule,AddressModule],
  controllers: [ScriptController],
  providers: [ScriptService],
})
export class ScriptModule {}
