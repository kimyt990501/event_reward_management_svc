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
      email: 'user1@example.com',
      password: 'password1',
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

  const invited_users = [
    {
      email: 'user2@example.com',
      password: 'password2',
      roles: ['USER'],
      invited_by: 'user1@example.com'
    },
    {
      email: 'user3@example.com',
      password: 'password3',
      roles: ['USER'],
      invited_by: 'user1@example.com'
    },
    {
      email: 'user4@example.com',
      password: 'password4',
      roles: ['USER'],
      invited_by: 'user1@example.com'
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

  it('회원가입 테스트 (USER, OPERATOR, ADMIN, AUDITOR)', async () => {
    for (const user of users) {
      await request(app.getHttpServer())
        .post('/api/register')
        .send(user)
        .expect(201);
    }
  });

  it('로그인 & 토큰 저장 테스트', async () => {
    for (const user of users) {
      const res = await request(app.getHttpServer())
        .post('/api/login')
        .send({ email: user.email, password: user.password })
        .expect(201);

      tokens[user.roles[0]] = res.body.access_token;
    }
  });

  it('이벤트 생성 테스트 - ADMIN, OPERATOR', async () => {
    const eventPayload = {
      title: "친구 3명 초대 이벤트",
      description: "친구 3명을 초대하면 보상을 드립니다.",
      condition: "invite_3_friends",
      active: true,
      startAt: "2025-05-10T00:00:00.000Z",
      endAt: "2025-07-10T00:00:00.000Z"
    };

    // ADMIN 생성
    await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .send(eventPayload)
      .expect(201);
    
    const res = await request(app.getHttpServer())
      .get('/api/events')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .expect(200);

    const events = res.body?.data || res.body;
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);

    createdEventId = events[0]._id;
    expect(createdEventId).toBeDefined();

    // USER → 실패
    await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${tokens['USER']}`)
      .send(eventPayload)
      .expect(403);
  });

  it('REWARD 생성 테스트 - ADMIN, OPERATOR', async () => {
    const rewardPayload = {
      name: "친구 3명 초대 쿠폰",
      type: "coupon",
      quantity: 1,
      eventId: createdEventId,
    };

    await request(app.getHttpServer())
      .post('/api/rewards')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .send(rewardPayload)
      .expect(201);
  });

  it('사용자 초대 후 보상 요청 테스트 (보상 조건 만족 시 자동 승인) - USER', async () => {
    // 한 사용자의 아이디를 초대 아이디에 넣어서 총 세명 회원가입 실시
    for (const user of invited_users) {
      await request(app.getHttpServer())
        .post('/api/register')
        .send(user)
        .expect(201);
    }
    await request(app.getHttpServer())
      .post(`/api/requests/${createdEventId}`)
      .set('Authorization', `Bearer ${tokens['USER']}`)
      .expect(201);
    
    // 2. 내 요청 목록 조회해서 최근 요청 ID 추출
    const res = await request(app.getHttpServer())
    .get('/api/requests/my')
    .set('Authorization', `Bearer ${tokens['USER']}`)
    .expect(200);

    const myRequests = res.body?.data || res.body;
    expect(Array.isArray(myRequests)).toBe(true);
    expect(myRequests.length).toBeGreaterThan(0);

    createdRequestId = myRequests[0]._id;
    expect(createdRequestId).toBeDefined();
  });

  it('보상 중복 요청 테스트 (방지 되는지) - USER', async () => {
    await request(app.getHttpServer())
      .post(`/api/requests/${createdEventId}`)
      .set('Authorization', `Bearer ${tokens['USER']}`)
      .expect(400);
  });

  it('기존 이벤트 삭제 후 새로운 이벤트 및 보상 등록 테스트 (이벤트 삭제 시 연결된 보상도 같이 삭제되는지) - ADMIN, OPERATOR', async () => {
    // 이벤트 삭제
    await request(app.getHttpServer())
      .delete(`/api/events/${createdEventId}`)
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .expect(200);

    const eventPayload = {
      title: "test",
      description: "test",
      condition: "test",
      active: true,
      startAt: "2025-05-10T00:00:00.000Z",
      endAt: "2025-07-10T00:00:00.000Z"
    };

    await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .send(eventPayload)
      .expect(201);
    
    const res = await request(app.getHttpServer())
      .get('/api/events')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .expect(200);

    const events = res.body?.data || res.body;
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);

    createdEventId = events[0]._id;

    const rewardPayload = {
      name: "test",
      type: "coupon",
      quantity: 1,
      eventId: createdEventId,
    };

    await request(app.getHttpServer())
      .post('/api/rewards')
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .send(rewardPayload)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/requests/${createdEventId}`)
      .set('Authorization', `Bearer ${tokens['USER']}`)
      .expect(201);
    
    // 내 요청 목록 조회해서 최근 요청 ID 추출
    const myRes = await request(app.getHttpServer())
    .get('/api/requests/my')
    .set('Authorization', `Bearer ${tokens['USER']}`)
    .expect(200);

    const myRequests = myRes.body?.data || myRes.body;
    expect(Array.isArray(myRequests)).toBe(true);
    expect(myRequests.length).toBeGreaterThan(0);

    createdRequestId = myRequests[1]._id;
    expect(createdRequestId).toBeDefined();
  } )

  it('보상 요청 관리자가 확인하여 수동으로 승인/거절 테스트 - ADMIN, OPERATOR', async () => {
    // 승인
    await request(app.getHttpServer())
      .patch(`/api/requests/approve/${createdRequestId}`)
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .expect(200);

    // 거절
    await request(app.getHttpServer())
      .patch(`/api/requests/reject/${createdRequestId}`)
      .set('Authorization', `Bearer ${tokens['ADMIN']}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
