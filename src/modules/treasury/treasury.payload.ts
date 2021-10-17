import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTreasuryPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name: string;
}
