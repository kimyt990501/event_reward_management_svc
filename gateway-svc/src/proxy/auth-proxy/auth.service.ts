import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const AUTH_SVC_URL = process.env.AUTH_SVC_URL;

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpService) {}

  async login(body: any) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(`${AUTH_SVC_URL}/auth/login`, body),
      );
      return data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  async register(body: any) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(`${AUTH_SVC_URL}/auth/register`, body),
      );
      return data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  private handleError(err: any) {
    const status = err.response?.status || 500;
    const res = err.response?.data || { message: 'Internal server error' };
    throw new HttpException(
      {
        message: res.message || 'Internal server error',
        error: res.error || 'Internal Server Error',
      },
      status,
    );
  }
}