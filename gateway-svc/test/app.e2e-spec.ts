import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('Gateway E2E (e2e)', () => {
  let app: INestApplication;
  let tokens = {};
  let createdEventId: string;
  let createdRequestId: string;

  const users = [
    {
      email: 'user5@example.com',
      password: 'password5',
      roles: ['USER'],
    },
    {
      email: 'admin1@example.com',
      password: 'password4',
      roles: ['ADMIN'],
    },
    {
      email: 'auditor1@example.com',
      password: 'password3',
      roles: ['AUDITOR'],
    },
    {
      email: 'operator1@example.com',
      password: 'password2',
      roles: ['OPERATOR'],
    },
  ];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('회원가입', async () => {
    for (const user of users) {
      await request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(201);
    }
  });

  it('로그인 & 토큰 저장', async () => {
    for (const user of users) {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send({ email: user.email, password: user.password })
        .expect(201);

      tokens[user.roles[0]] = res.body.access_token;
    }
  });

  it('ADMIN 또는 OPERATOR만 이벤트 생성 가능', async () => {
    const eventPayload = {
      title: '주간 로그인 이벤트1',
      description: '이번 주 내내 로그인한 유저에게 쿠폰을 드립니다.',
      condition: 'weekly_login',
      active: true,
      startAt: '2025-05-12T00:00:00.000Z',
      endAt: '2025-05-18T23:59:59.000Z',
    };

    // ADMIN 생성
    const res = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .send(eventPayload)
      .expect(201);

    createdEventId = res.body.id || res.body._id; // 실제 필드 확인 필요
    expect(createdEventId).toBeDefined();

    // USER → 실패
    await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokens['USER']}`)
      .send(eventPayload)
      .expect(403);
  });

  it('REWARD 생성 - ADMIN 또는 OPERATOR', async () => {
    const rewardPayload = {
      name: '주간 로그인 쿠폰1',
      type: 'coupon',
      quantity: 1,
      eventId: createdEventId,
    };

    await request(app.getHttpServer())
      .post('/rewards')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .send(rewardPayload)
      .expect(201);
  });

  it('요청 생성 - USER만 가능', async () => {
    await request(app.getHttpServer())
      .post(`/requests/${createdEventId}`)
      .set('Authorization', `Bearer ${tokens['USER']}`)
      .expect(201);

    // 2. 내 요청 목록 조회해서 최근 요청 ID 추출
    const res = await request(app.getHttpServer())
      .get('/requests/my')
      .set('Authorization', `Bearer ${tokens['USER']}`)
      .expect(200);

    const myRequests = res.body?.data || res.body;
    expect(Array.isArray(myRequests)).toBe(true);
    expect(myRequests.length).toBeGreaterThan(0);

    createdRequestId = myRequests[0]._id;
    expect(createdRequestId).toBeDefined();
  });

  it('승인/거절 - ADMIN만 가능', async () => {
    // 승인
    await request(app.getHttpServer())
      .patch(`/requests/approve/${createdRequestId}`)
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .expect(200);

    // 거절
    await request(app.getHttpServer())
      .patch(`/requests/reject/${createdRequestId}`)
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
