import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { SyncModule } from './../sync';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), forwardRef(() => SyncModule)],
  controllers: [AddressController],
  exports: [AddressService],
  providers: [AddressService],
})
export class AddressModule {}
