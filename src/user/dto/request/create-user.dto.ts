import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '유저 이메일' })
  @IsEmail()
  email: string;
}
