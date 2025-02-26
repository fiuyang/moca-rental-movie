import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../common/util/crypto.util';
import { AuthResponse, SignInDto } from './dto/sign-in.dto';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenService } from '../common/service/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpDto): Promise<void> {
    await this.userService.create(dto);
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(dto.email);
    if (!(await comparePassword(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.userService.clearRefreshToken(userId);
  }

  async refreshTokens(userId: string, token: string): Promise<AuthResponse> {
    const user = await this.userService.findById(userId);
    if (!user?.refreshToken) {
      throw new UnauthorizedException('User not found or not logged in');
    }

    const isMatch = await comparePassword(token, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Email or Password is wrong');
    return user;
  }
}
