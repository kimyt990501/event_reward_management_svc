import { Test, TestingModule } from '@nestjs/testing';
import { RewardsService } from './rewards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward } from './reward.schema';
import { Query } from 'mongoose';

const mockRewardModel = () => ({
  create: jest.fn(),
  find: jest.fn().mockReturnValue({
    exec: jest.fn(),
  } as unknown as Query<any, any>),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn(),
  } as unknown as Query<any, any>),
});

describe('RewardsService', () => {
  let service: RewardsService;
  let model: Model<Reward>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: getModelToken(Reward.name),
          useFactory: mockRewardModel,
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    model = module.get<Model<Reward>>(getModelToken(Reward.name));
  });

  it('should create a reward', async () => {
    /**
     * 보상 생성(create) 메서드 테스트
     * - 주어진 DTO로 보상이 생성되고 반환되는지 확인
     * - 모델의 create 메서드가 올바른 인자로 호출되었는지 검증
     */
    const rewardDto = {
      name: 'Gold Coin',
      type: 'item',
      quantity: 10,
      eventId: 'event1',
    };

    (model.create as jest.Mock).mockResolvedValue(rewardDto);

    const result = await service.create(rewardDto);
    expect(result).toEqual(rewardDto);
    expect(model.create).toHaveBeenCalledWith(rewardDto);
  });

  it('should find all rewards', async () => {
    /**
     * 모든 보상 조회(findAll) 메서드 테스트
     * - 모델의 find 메서드가 호출되고, exec()를 통해 보상 목록을 정상 반환하는지 확인
     */
    const rewards = [{ name: 'Reward1' }, { name: 'Reward2' }];

    (model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(rewards),
    });

    const result = await service.findAll();
    expect(result).toEqual(rewards);
    });

    it('should find reward by id', async () => {
     /**
     * 특정 ID의 보상 조회(findById) 메서드 테스트
     * - 모델의 findById가 호출되고 exec() 통해 해당 보상을 반환하는지 확인
     */
    const reward = { _id: 'id', name: 'Reward' };

    (model.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(reward),
    });

    const result = await service.findById('id');
    expect(result).toEqual(reward);
    });
});