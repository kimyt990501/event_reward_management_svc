import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly httpService: HttpService,) {}

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

  async checkCondition(userId: string, condition: string): Promise<null | boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) return false;

    if (condition.startsWith('invite_')) {
      const required = parseInt(condition.split('_')[1]);
      return user.invite_cnt >= required;
    }

    // 아직 처리하지 않는 조건일 경우 null 반환
    return null;
  }
}