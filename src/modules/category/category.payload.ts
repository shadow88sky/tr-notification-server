import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name: string;
}
