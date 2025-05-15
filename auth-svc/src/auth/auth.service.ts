import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      await this.updateLoginDaysCount(user._id.toString(), user.lastLoginAt);

      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async updateLoginDaysCount(userId: string, lastLoginAt: Date | undefined) {
    const user = await this.usersService.findById(userId);
    if (!user) return;

    const now = new Date();

    // 날짜 비교 (하루에 한 번만 카운트 증가)
    if (!lastLoginAt || !this.isSameDay(new Date(lastLoginAt), now)) {
      // 연속 로그인 체크 (1일 차이 인정)
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      if (lastLoginAt && this.isSameDay(new Date(lastLoginAt), yesterday)) {
        user.loginDaysCount = (user.loginDaysCount || 0) + 1;
      } else {
        user.loginDaysCount = 1;
      }

      user.lastLoginAt = now;
      await user.save();
    }
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
}