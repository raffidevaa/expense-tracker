import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Login, Register } from './auth.dto';
import { hash, compare } from 'bcrypt';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersRepo: UsersRepository,
  ) {}

  // REGISTER
  async register(dto: Register) {
    const exists = await this.usersRepo.findByEmail(dto.email);
    if (exists) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.usersRepo.createUser({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  // LOGIN
  async login(dto: Login) {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id };

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
