import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const EVENT_SVC_URL = process.env.EVENT_SVC_URL;

@Injectable()
export class EventsService {
  constructor(private readonly http: HttpService) {}

  async create(req, body) {
    return this.call('post', '', req, body);
  }

  async findAll(req) {
    return this.call('get', '/summary', req);
  }

  async findOne(req, id: string) {
    return this.call('get', `/detail/${id}`, req);
  }

  async remove(req, id: string) {
    return this.call('delete', `/${id}`, req);
  }

  private async call(method: string, path: string, req, data?: any) {
    try {
      const { data: result } = await firstValueFrom(
        this.http.request({
          method,
          url: `${EVENT_SVC_URL}/events${path}`,
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