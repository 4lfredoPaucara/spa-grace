import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import jwtConfig from '../../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const userWithPassword = await this.usersService.findByIdWithPassword(user.id);

    if (!userWithPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, userWithPassword.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      ...dto,
      rol: undefined,
    });

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async refreshToken(refreshTokenStr: string) {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenStr },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (new Date() > storedToken.expires_at) {
      await this.refreshTokenRepository.remove(storedToken);
      throw new UnauthorizedException('Refresh token expirado');
    }

    await this.refreshTokenRepository.remove(storedToken);

    try {
      const payload = this.jwtService.verify(refreshTokenStr, {
        secret: this.jwtConf.refreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async logout(userId: number) {
    await this.refreshTokenRepository.delete({ id_usuario: userId });
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      rol: user.rol,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenStr = this.jwtService.sign(payload, {
      secret: this.jwtConf.refreshSecret,
      expiresIn: this.jwtConf.refreshExpiresIn as any,
    });

    const refreshToken = this.refreshTokenRepository.create({
      id_usuario: user.id,
      token: refreshTokenStr,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.refreshTokenRepository.save(refreshToken);

    return { accessToken, refreshToken: refreshTokenStr };
  }

  private sanitizeUser(user: User) {
    const { password, deleted_at, ...sanitized } = user as any;
    return sanitized;
  }
}
