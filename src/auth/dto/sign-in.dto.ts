import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ required: true, example: 'rental@moca.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: 'password' })
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class AuthResponse {
  @ApiProperty({
    required: false,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MTM0ZWQ5NS0yMzdmLTRjNTYtOTgwYi02MjFjZTExZjYxOGIiLCJlbWFpbCI6InJlbnRhbEBtb2NhLmNvbSIsImlhdCI6MTc0MDQ4NjUwNywiZXhwIjoxNzQwNDg4MzA3fQ.hN3Jr4T4dHyLpZwoxOwtkXsD21B_Vvz8sRIyHMjQVqM',
  })
  access_token: string;

  @ApiProperty({
    required: false,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MTM0ZWQ5NS0yMzdmLTRjNTYtOTgwYi02MjFjZTExZjYxOGIiLCJpYXQiOjE3NDA0ODY1MDcsImV4cCI6MTc0MTA5MTMwN30.oMHPE6u5gyU6ozMy6VazE3YlatFORo53Gtq-eO8cgqg',
  })
  refresh_token: string;
}
