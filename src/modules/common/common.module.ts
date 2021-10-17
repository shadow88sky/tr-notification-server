import { Global, Module } from '@nestjs/common';
import { ExistsValidator } from './validator/exists.validator';
import { UniqueValidator } from './validator/unique.validator';
import { LoggerService } from './service/logger.service';

@Global()
@Module({
  providers: [UniqueValidator, ExistsValidator, LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
