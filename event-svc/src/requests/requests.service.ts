import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from './request.schema';
import { Model } from 'mongoose';
import { Event } from '../events/event.schema';
import { EventsService } from '../events/events.service';
import { Reward } from '../rewards/reward.schema';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<Request>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    private readonly eventsService: EventsService,
  ) {}

  async requestReward(user_email: string, userId: string, eventId: string) {
    const event = await this.eventModel.findById(eventId);
    const event_title = event.title
    if (!event || !event.active) {
      throw new BadRequestException('존재하지 않거나 비활성 이벤트입니다.');
    }

    const alreadyRequested = await this.requestModel.findOne({ user_email, event_title });
    if (alreadyRequested) {
      throw new BadRequestException('이미 보상 요청이 등록되어 있습니다.');
    }

    let status: 'PENDING' | 'SUCCESS' | 'FAIL' = 'PENDING';
    let approvedAt: Date | undefined;

    const conditionResult = await this.eventsService.checkCondition(userId, event.condition);
    if (conditionResult === true) {
      status = 'SUCCESS';
      approvedAt = new Date();
    } else if (conditionResult === false) {
      status = 'FAIL';
    }

    await this.requestModel.create({
      user_email,
      event_title: event.title,
      status,
      requestedAt: new Date(),
      approvedAt,
    });

    return {
      message:
        status === 'SUCCESS'
          ? '보상 지급이 완료되었습니다.'
          : status === 'FAIL'
          ? '보상 지급 조건 미달입니다.'
          : '보상 요청이 등록되었습니다.',
      status,
    };
  }

  findByUser(user_email: string) {
    return this.requestModel.find({ user_email });
  }

  findAll() {
    return this.requestModel.find();
  }

  async findById(id: string) {
    return this.requestModel.findById(id);
  }
}