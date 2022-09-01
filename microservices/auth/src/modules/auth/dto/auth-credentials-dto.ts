import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    name: 'email',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    name: 'password',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
