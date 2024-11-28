import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseUserDTO {
  @ApiProperty({ description: '유저 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '유저 이메일' })
  @Expose()
  email: string;

  constructor(userResponse: { name: string; email: string }) {
    Object.assign(this, userResponse);
  }
}
