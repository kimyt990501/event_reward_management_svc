import { Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  async findById(userId: string) {
    const authUrl = process.env.AUTH_SVC_URL || 'http://auth-svc:3100';
    try {
      const response = await this.httpService
        .get(`${authUrl}/users/${userId}`)
        .toPromise();
      return response.data;
    } catch {
      return null;
    }
  }
}