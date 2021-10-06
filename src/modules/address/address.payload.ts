import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ChainEnum } from '../../constants';

export class CreateAddressPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ChainEnum, { each: true })
  chain_id: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  category: string;
}
