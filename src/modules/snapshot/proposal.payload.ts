import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ProposalFields {
  id: string;
  title: string;
  body: string;
  choices: string;
  start: string;
  end: string;
  snapshot: string;
  state: string;
  author: string;
  created: string;
  plugins: string;
  network: string;
}

export class WebhookPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  event: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  space: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  expire: string;
}
