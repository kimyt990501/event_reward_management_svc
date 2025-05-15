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

  async requestReward(userId: string, eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event || !event.active) throw new BadRequestException('존재하지 않거나 비활성 이벤트입니다.');

    const conditionMet = await this.eventsService.checkCondition(userId, event.condition);
    if (!conditionMet) {
      throw new BadRequestException('이벤트 조건을 만족하지 못했습니다.');
    }

    const alreadyRequested = await this.requestModel.findOne({ userId, eventId });
    if (alreadyRequested) throw new BadRequestException('이미 보상을 요청했습니다.');

    const request = await this.requestModel.create({
      userId,
      eventId,
      status: 'SUCCESS',
      requestedAt: new Date(),
    });

    await this.giveReward(userId, eventId);

    return request;
  }

  findByUser(userId: string) {
    return this.requestModel.find({ userId });
  }

  findAll() {
    return this.requestModel.find();
  }

  async giveReward(userId: string, eventId: string): Promise<void> {
    // 1. 이벤트에 연결된 보상 조회
    const rewards = await this.rewardModel.find({ eventId });
    if (!rewards || rewards.length === 0) {
      throw new NotFoundException('해당 이벤트의 보상을 찾을 수 없습니다.');
    }

    // 2. 보상 지급 로직 (예: 포인트 적립, 아이템 지급)
    for (const reward of rewards) {
      switch (reward.type) {
        case 'point':
          // TODO: 유저 포인트 적립 로직 호출 (예: userService.addPoints(userId, reward.quantity))
          console.log(`포인트 지급: 유저 ${userId}에게 ${reward.quantity}점 지급`);
          break;

        case 'item':
          // TODO: 유저 인벤토리에 아이템 추가 (예: userService.addItem(userId, reward.name, reward.quantity))
          console.log(`아이템 지급: 유저 ${userId}에게 ${reward.name} 아이템 ${reward.quantity}개 지급`);
          break;

        case 'coupon':
          // TODO: 쿠폰 발급 로직 (예: couponService.issueCoupon(userId, reward.name))
          console.log(`쿠폰 지급: 유저 ${userId}에게 ${reward.name} 쿠폰 지급`);
          break;

        default:
          console.warn(`알 수 없는 보상 타입: ${reward.type}`);
          break;
      }
    }

    // 3. (선택사항) 보상 지급 완료 로그, 알림 등 추가
  }
}