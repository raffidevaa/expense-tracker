import { MinLength, IsString, IsEmail } from 'class-validator';

export class Register {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class Login {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
