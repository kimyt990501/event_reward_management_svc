import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const AUTH_SVC_URL = process.env.AUTH_SVC_URL;

@Controller('api')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post('/login')
  async login(@Body() body) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${AUTH_SVC_URL}/auth/login`, body),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };
      throw new HttpException({
        message: errorResponse.message,
        error: errorResponse.error,
      }, status);
    }
  }

  @Post('/register')
  async register(@Body() body) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${AUTH_SVC_URL}/auth/register`, body),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };
      throw new HttpException({
        message: errorResponse.message,
        error: errorResponse.error,
      }, status);
    }
  }
}