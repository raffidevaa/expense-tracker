import { MinLength, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
