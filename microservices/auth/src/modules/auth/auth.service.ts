import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './dto/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(authCredentials: AuthCredentialsDto) {
    const user = await this.userService.getUserByEmail(authCredentials.email);

    if (!user) return null;

    const passwordOk = await bcrypt.compare(
      authCredentials.password,
      user.password,
    );

    if (!passwordOk) return null;

    return user;
  }

  async login(authCredentials: AuthCredentialsDto) {
    const user = await this.validateUser(authCredentials);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
