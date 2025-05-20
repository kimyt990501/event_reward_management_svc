import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const EVENT_SVC_URL = process.env.EVENT_SVC_URL;

@Injectable()
export class RewardsService {
  constructor(private readonly http: HttpService) {}

  async create(req, body) {
    return this.call('post', '', req, body);
  }

  async findAll(req) {
    return this.call('get', '', req);
  }

  async remove(req, rewardId: string) {
    return this.call('delete', `/${rewardId}`, req);
  }

  async findByEvent(req, eventId: string) {
    return this.call('get', `/event/${eventId}`, req);
  }

  private async call(method: string, path: string, req, data?: any) {
    try {
      const { data: result } = await firstValueFrom(
        this.http.request({
          method,
          url: `${EVENT_SVC_URL}/rewards${path}`,
          headers: { Authorization: req.headers.authorization },
          ...(data && { data }),
        }),
      );
      return result;
    } catch (err) {
      const res = err.response?.data || { message: 'Internal server error' };
      throw new HttpException(res, err.response?.status || 500);
    }
  }
}
