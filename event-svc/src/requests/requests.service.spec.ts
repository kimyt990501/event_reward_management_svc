import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { EventsService } from '../events/events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './request.schema';
import { Event } from '../events/event.schema';
import { Reward } from '../rewards/reward.schema';

const mockRequestModel = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
});

const mockEventModel = () => ({
  findById: jest.fn(),
});

const mockEventsService = {
  checkCondition: jest.fn(),
};

const mockRewardModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
});

describe('RequestsService', () => {
  let service: RequestsService;
  let requestModel: Model<Request>;
  let eventModel: Model<Event>;
  let eventsService: EventsService;

  beforeEach(async () => {
    // 테스트 모듈 설정 및 의존성 주입, Mock 객체 연결
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
        {
          provide: getModelToken(Request.name),
          useFactory: mockRequestModel,
        },
        {
          provide: getModelToken(Event.name),
          useFactory: mockEventModel,
        },
        {
          provide: getModelToken(Reward.name),
          useFactory: mockRewardModel,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    requestModel = module.get<Model<Request>>(getModelToken(Request.name));
    eventModel = module.get<Model<Event>>(getModelToken(Event.name));
    eventsService = module.get<EventsService>(EventsService);
  });

  it('should throw if event not found or inactive', async () => {
    // 이벤트가 존재하지 않거나 비활성일 경우 예외가 발생하는지 테스트
    (eventModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(service.requestReward('user1', 'event1')).rejects.toThrow('존재하지 않거나 비활성 이벤트입니다.');
  });

  it('should throw if already requested', async () => {
    // 이미 같은 이벤트에 대해 보상 요청을 한 경우 예외 발생 테스트
    (eventModel.findById as jest.Mock).mockResolvedValue({ active: true, condition: 'login_3_days' });
    (requestModel.findOne as jest.Mock).mockResolvedValue(true);
    (eventsService.checkCondition as jest.Mock).mockResolvedValue(true);
    await expect(service.requestReward('user1', 'event1')).rejects.toThrow('이미 보상을 요청했습니다.');
  });

  it('should create a reward request successfully', async () => {
    // 정상적으로 보상 요청이 처리되는 경우 테스트
    (eventModel.findById as jest.Mock).mockResolvedValue({ active: true, condition: 'login_3_days' });
    (requestModel.findOne as jest.Mock).mockResolvedValue(null);

    (eventsService.checkCondition as jest.Mock).mockResolvedValue(true);
    (requestModel.create as jest.Mock).mockImplementation((data) => Promise.resolve(data));
    jest.spyOn(service, 'giveReward').mockResolvedValue(undefined);

    const result = await service.requestReward('user1', 'event1');
    expect(result).toHaveProperty('userId', 'user1');
    expect(result).toHaveProperty('eventId', 'event1');
    expect(requestModel.create).toHaveBeenCalled();
    expect(service.giveReward).toHaveBeenCalled();
  });
});