import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
  chain_id: number;
}
