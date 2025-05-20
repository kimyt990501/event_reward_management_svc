import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const EVENT_SVC_URL = process.env.EVENT_SVC_URL;

@Injectable()
export class RequestsService {
  constructor(private readonly http: HttpService) {}

  async requestReward(req, eventId: string) {
    return this.call('post', `/${eventId}`, req);
  }

  async getRequests(req, query) {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${EVENT_SVC_URL}/requests`, {
          headers: { Authorization: req.headers.authorization },
          params: query,
        }),
      );
      return data;
    } catch (err) {
      const res = err.response?.data || { message: 'Internal server error' };
      throw new HttpException(res, err.response?.status || 500);
    }
  }

  async approve(req, id: string) {
    return this.call('patch', `/approve/${id}`, req);
  }

  async reject(req, id: string) {
    return this.call('patch', `/reject/${id}`, req);
  }

  async myRequests(req) {
    return this.call('get', '/my', req);
  }

  private async call(method: string, path: string, req, data?: any) {
    try {
      const { data: result } = await firstValueFrom(
        this.http.request({
          method,
          url: `${EVENT_SVC_URL}/requests${path}`,
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