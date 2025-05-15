import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>, private readonly httpService: HttpService,) {}

  create(data: any) {
    return this.eventModel.create(data);
  }

  findAll() {
    return this.eventModel.find();
  }

  findById(id: string) {
    return this.eventModel.findById(id);
  }

  async findAllSummary() {
    return this.eventModel.find({}, { 
      _id: 1, 
      title: 1, 
      active: 1, 
      startAt: 1, 
      endAt: 1 
    }).exec();
  }

  async findDetailById(id: string) {
    const event = await this.eventModel.findById(id, {
      _id: 1,
      title: 1,
      description: 1,
      condition: 1,
      active: 1,
      startAt: 1,
      endAt: 1,
    }).exec();

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    return event;
  }

  private async getUserById(userId: string): Promise<any> {
    const authSvcUrl = process.env.AUTH_SVC_URL || 'http://auth-svc:3100';

    try {
      const response = await this.httpService
        .get(`${authSvcUrl}/users/${userId}`)
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to fetch user info', HttpStatus.BAD_GATEWAY);
    }
  }

  async checkCondition(userId: string, condition: string): Promise<boolean> {
    // 간단히 login_X_days 조건만 처리
    if (condition.startsWith('login_')) {
      const requiredDays = parseInt(condition.split('_')[1]);
      const user = await this.getUserById(userId); // auth-svc HTTP API 호출 또는 DB 직접 접근

      if (!user) return false;
      return user.loginDaysCount >= requiredDays;
    }

    // 다른 조건들은 필요에 따라 구현
    return false;
  }
}