import { Test, TestingModule } from '@nestjs/testing';
import { ProxyController } from './proxy.controller';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ProxyController', () => {
  let controller: ProxyController;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProxyController],
      providers: [
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<ProxyController>(ProxyController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    // 컨트롤러 인스턴스 생성 확인 테스트
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    it('should proxy event creation and return data', async () => {
      /**
       * 이벤트 생성 요청을 프록시하여
       * 내부 event-svc POST 호출 후 데이터를 올바르게 반환하는지 테스트
       */
      const mockReq = { headers: { authorization: 'Bearer token' } };
      const mockRes = { send: jest.fn() };
      const mockBody = { title: 'New Event' };
      const mockResponse = { data: { id: 'event1', title: 'New Event' } };

      mockHttpService.post.mockReturnValueOnce(of(mockResponse));

      await controller.createEvent(mockReq as any, mockBody, mockRes as any);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'http://event-svc:3200/events',
        mockBody,
        { headers: { Authorization: mockReq.headers.authorization } },
      );
      expect(mockRes.send).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  describe('requestReward', () => {
    it('should proxy reward request and return data', async () => {
      /**
       * 보상 요청을 프록시하여
       * eventId에 맞게 event-svc POST 요청하고 결과를 반환하는지 테스트
       */
      const mockReq = { headers: { authorization: 'Bearer token' } };
      const mockRes = { send: jest.fn() };
      const eventId = 'event123';
      const mockResponse = { data: { success: true } };

      mockHttpService.post.mockReturnValueOnce(of(mockResponse));

      await controller.requestReward(mockReq as any, eventId, mockRes as any);

      expect(mockHttpService.post).toHaveBeenCalledWith(
        `http://event-svc:3200/requests/${eventId}`,
        {},
        { headers: { Authorization: mockReq.headers.authorization } },
      );
      expect(mockRes.send).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  describe('getRequests', () => {
    it('should proxy get requests and return data', async () => {
      /**
       * 보상 요청 내역 조회 API를 프록시하여
       * event-svc GET 요청 후 결과를 반환하는지 테스트
       */
      const mockReq = { headers: { authorization: 'Bearer token' } };
      const mockRes = { send: jest.fn() };
      const mockResponse = { data: [{ id: 'req1' }, { id: 'req2' }] };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      await controller.getRequests(mockReq as any, mockRes as any);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://event-svc:3200/requests',
        { headers: { Authorization: mockReq.headers.authorization } },
      );
      expect(mockRes.send).toHaveBeenCalledWith(mockResponse.data);
    });
  });
});