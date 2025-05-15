import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from './request.schema';
import { Model } from 'mongoose';

@Injectable()
export class RequestsService {
  constructor(@InjectModel(Request.name) private requestModel: Model<Request>) {}

  async requestReward(userId: string, eventId: string) {
    const exists = await this.requestModel.findOne({ userId, eventId });
    if (exists) throw new BadRequestException('이미 요청한 이벤트입니다.');

    return this.requestModel.create({
      userId,
      eventId,
      status: 'SUCCESS',
      requestedAt: new Date(),
    });
  }

  findByUser(userId: string) {
    return this.requestModel.find({ userId });
  }

  findAll() {
    return this.requestModel.find();
  }
}