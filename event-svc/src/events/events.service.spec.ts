import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';

const mockEventModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
});

describe('EventsService', () => {
  let service: EventsService;
  let model: Model<Event>;

  beforeEach(async () => {
    // 테스트 전 모듈 생성 및 서비스, 모델 주입
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useFactory: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  it('should create an event', async () => {
    /**
     * 이벤트 생성(create) 메서드 테스트
     * - 주어진 DTO를 사용해 이벤트가 생성되는지 확인
     * - DB 모델의 create 메서드가 호출되었는지 검증
     */
    const createEventDto = { title: 'test', condition: 'login_3_days', active: true, startAt: new Date(), endAt: new Date() };
    (model.create as jest.Mock).mockResolvedValue(createEventDto);

    const result = await service.create(createEventDto);
    expect(result).toEqual(createEventDto);
    expect(model.create).toHaveBeenCalledWith(createEventDto);
  });

  it('should find all events', async () => {
    /**
     * 모든 이벤트 조회(findAll) 메서드 테스트
     * - DB 모델의 find 메서드가 호출되고, 예상 이벤트 리스트가 반환되는지 확인
     */
    const events = [{ title: 'event1' }, { title: 'event2' }];
    (model.find as jest.Mock).mockResolvedValue(events);

    const result = await service.findAll();
    expect(result).toEqual(events);
  });
});