import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  ValidationSchema,
} from 'class-validator';

export class NotificationPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  treasury_id: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  treasury: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  chain_id: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  contract_ticker_symbol: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  before: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  newest: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  ratio: string;
}

export class CreateNotificationPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NotificationPayload)
  @IsArray()
  content: NotificationPayload[];
}
