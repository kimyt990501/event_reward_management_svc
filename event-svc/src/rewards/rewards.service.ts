import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from './reward.schema';
import { Model } from 'mongoose';

@Injectable()
export class RewardsService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<Reward>) {}

  async create(data: any) {
    await this.rewardModel.create(data);

    return {
      message: '보상이 등록되었습니다.',
    };
  }

  findByEvent(eventId: string) {
    return this.rewardModel.find({ eventId });
  }
  
  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }

  async findById(id: string): Promise<Reward> {
    return this.rewardModel.findById(id).exec();
  }
}