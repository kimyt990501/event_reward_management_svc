import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from './reward.schema';
import { Model } from 'mongoose';

@Injectable()
export class RewardsService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<Reward>) {}

  async create(data: any) {
    const existing = await this.rewardModel.findOne({ eventId: data.eventId });

    if (existing) {
      throw new BadRequestException('해당 이벤트에는 이미 보상이 등록되어 있습니다.');
    }

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

  async deleteById(rewardId: string) {
    const result = await this.rewardModel.deleteOne({ _id: rewardId });
  
    if (result.deletedCount === 0) {
      throw new NotFoundException('보상이 존재하지 않거나 이미 삭제되었습니다.');
    }
  
    return {
      message: '보상이 삭제되었습니다.',
    };
  }

  async deleteByEventId(eventId: string) {
    const result = await this.rewardModel.deleteMany({ eventId });
  
    return {
      message: `${result.deletedCount}개의 보상이 함께 삭제되었습니다.`,
    };
  }
}