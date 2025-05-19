import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { RewardsService } from 'src/rewards/rewards.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly httpService: HttpService,
    private readonly rewardsService: RewardsService) {}

  async create(data: any) {
    await this.eventModel.create(data);

    return {
      message: '이벤트가 등록되었습니다.',
    };
  }

  findAll() {
    return this.eventModel.find();
  }

  findById(id: string) {
    return this.eventModel.findById(id);
  }

  async deleteById(eventId: string) {
    const eventResult = await this.eventModel.deleteOne({ _id: eventId });
  
    if (eventResult.deletedCount === 0) {
      throw new NotFoundException('이벤트가 존재하지 않거나 이미 삭제되었습니다.');
    }

    await this.rewardsService.deleteByEventId(eventId);
  
    return {
      message: `이벤트와 연결된 보상이 함께 삭제되었습니다.`,
    };
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

    // 친구 초대 이벤트 조건 확인
    if (condition.startsWith('invite_')) {
      const required = parseInt(condition.split('_')[1]);
      return user.inviteCnt >= required;
    }

    // 연속 로그인 이벤트 조건 확인
    if (condition.startsWith('login_')) {
      const required = parseInt(condition.split('_')[1]);
      return user.loginDaysCount >= required;
    }

    // 아직 처리하지 않는 조건일 경우 null 반환
    return null;
  }
}