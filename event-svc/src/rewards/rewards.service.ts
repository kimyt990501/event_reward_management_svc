import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from './reward.schema';
import { Model } from 'mongoose';

@Injectable()
export class RewardsService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<Reward>) {}

  create(data: any) {
    return this.rewardModel.create(data);
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