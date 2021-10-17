import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginatePayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  page: number = 1;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  limit: number = 10;
}
