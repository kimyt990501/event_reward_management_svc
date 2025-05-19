# 이벤트 / 보상 관리 플랫폼 백엔드 프로젝트

---

## 프로젝트 개요
본 프로젝트는 NestJS, MongoDB, JWT 인증을 활용하여 이벤트 및 보상 관리 시스템을 구현하는 백엔드 서비스입니다.  
3개의 마이크로서비스 구조로 구성되어 있으며, 각각 다음 역할을 수행합니다.

- **auth-svc** : 유저 인증, 권한 관리, JWT 발급  
- **event-svc** : 이벤트/보상 생성 및 조회, 유저 보상 요청 처리  
- **gateway-svc** : 모든 API 요청의 진입점, 인증 및 권한 검사, 각 서비스로 프록시 역할 수행  

---

## 기술 스택
- Node.js 18
- NestJS (최신)
- MongoDB
- JWT 인증
- Docker + Docker Compose
- TypeScript

---

## 주요 기능 및 API

- 기본적으로 모든 api 에 대해서 prefix 로 <code>/api</code> 적용

### Auth Service (auth-svc)
- 유저 등록, 로그인
- 역할(Role) 관리 (USER, OPERATOR, AUDITOR, ADMIN)
- JWT 토큰 발급 및 검증

### Event Service (event-svc)
- 이벤트 등록, 조회 (조건, 기간, 상태 포함)
- 보상 등록, 조회 (포인트, 아이템, 쿠폰 등)
- 유저 보상 요청 처리 (중복 요청 방지, 조건 검증)
- 보상 요청 내역 조회 (유저별 및 전체)

### Gateway Service (gateway-svc)
- JWT 인증 및 역할 기반 권한 검사
- 각 서비스 API 요청 프록시

### API 명세서
전체 API 설명은 아래 문서를 참고해주세요:

[API 명세서 보러가기](./API.md)

---

## 데이터베이스

### MongoDB
- 도커로 실행되는 MongoDB
- username, password 는 env 파일에서 관리
- 전체 DB 구조는 아래 문서를 참고해주세요

[DB 구조 보러가기](./DB.md)

---

## 개발 및 실행 환경 설정

### 환경변수 (.env, .env.test)
루트 디렉터리에 `.env` 파일을 생성 후 다음 환경변수를 설정합니다.

- .env
```env
AUTH_PORT=3100
EVENT_PORT=3200
GATEWAY_PORT=3000

AUTH_SVC_URL=http://auth-svc:3100
EVENT_SVC_URL=http://event-svc:3200

MONGO_USERNAME=nexon
MONGO_PASSWORD=nexon1234
MONGO_DB=reward-management-db
MONGO_PORT=27017

MONGO_URI=mongodb://nexon:nexon1234@mongo:27017/reward-management-db?authSource=admin
JWT_SECRET=secret
JWT_EXPIRES_IN=1h
```

---

## Docker Compose 실행

```bash
docker-compose up -d --build
```

- MongoDB 포함하여 3개 서비스가 자동으로 빌드 및 실행됩니다.
- 각 서비스는 설정된 포트에서 API 요청 대기 중입니다.

---

## 설계 및 구현 포인트

- 역할(Role) 기반 권한 관리 엄격 적용 (USER, OPERATOR, AUDITOR, ADMIN)
- 이벤트 조건 검증 로직 분리 및 확장 용이하게 설계 (예: 로그인 연속 3일, 친구 초대 등)
- 보상 지급 자동화 및 중복 요청 방지 로직 포함
- MSA 구조에 따른 서비스 간 책임 분리
- JWT 인증 및 권한 검증으로 보안 강화
- Docker 기반 배포 및 실행 환경 구성

### 이벤트 및 보상 종류

#### 1. \#일 간 연속 로그인 시 쿠폰 지급
- 예시 이벤트 등록 요청 바디 ([POST] /api/events)
```json
{
  "title": "3일 연속 출석 이벤트",
  "description": "3일 연속 로그인하면 보상 지급",
  "condition": "login_3_days",
  "active": true,
  "startAt": "2025-05-01T00:00:00Z",
  "endAt": "2025-06-01T00:00:00Z"
}
```
- 예시 보상 등록 요청 바디 ([POST] /api/rewards)
```json
{
  "name": "3일 연속 로그인 쿠폰",
  "type": "coupon",
  "quantity": 1,
  "eventId": "이벤트 ID"
}
```

#### 2. \#명의 회원 초대하여 회원가입 시 쿠폰 지급
- 예시 이벤트 등록 요청 바디 ([POST] /api/events)
```json
{
  "title": "친구 3명 초대 이벤트",
  "description": "친구 3명을 초대하면 보상을 드립니다.",
  "condition": "invite_3_friends",
  "active": true,
  "startAt": "2025-05-10T00:00:00.000Z",
  "endAt": "2025-07-10T00:00:00.000Z"
}
```
- 예시 보상 등록 요청 바디 ([POST] /api/rewards)
```json
{
  "name": "친구 3명 초대 쿠폰",
  "type": "coupon",
  "quantity": 1,
  "eventId": "이벤트 ID"
}
```

- 위의 이벤트들은 따로 관리자가 보상 요청을 확인하여 승인/거절할 필요 없이 내부 로직으로 자동 승인/거절하게 설계하였습니다.
- 또한 보상 요청 내역 확인 시 요청 상태, 이벤트 ID, 사용자 이메일을 쿼리 파라미터로 넣어 필터링도 가능하게 구현하였습니다. 

---

## 실행 및 배포

1. `.env` 파일 작성  
2. `docker-compose up -d --build` 실행  
3. `docker ps` 로 서비스 정상 실행 확인  
4. Postman 등으로 Gateway 서버 API 호출하여 기능 테스트

---

## 테스트 방법

### Postman API 테스트 예시
- 역할별 계정을 생성 후 로그인하여 JWT 토큰 획득
- 헤더에 `Authorization: Bearer <토큰>` 추가
- Gateway 서비스를 통해 이벤트 생성, 보상 요청 등 API 호출 가능

---

## 도커 테스트 코드

- 각 서비스별 단위 테스트 및 통합 테스트 포함
- Jest 사용
- 테스트 시나리오
  - 회원가입 테스트 (USER, OPERATOR, ADMIN, AUDITOR)
  - 로그인 & 토큰 저장 테스트
  - 이벤트 생성 테스트
  - REWARD 생성 테스트
  - 사용자 초대 후 보상 요청 테스트 (보상 조건 만족 시 자동 승인)
  - 보상 중복 요청 테스트
  - 기존 이벤트 삭제 후 새로운 이벤트 및 보상 등록 테스트 (이벤트 삭제 시 연결된 보상도 같이 삭제되는지)
  - 보상 요청 관리자가 확인하여 수동으로 승인/거절 테스트

## 도커 환경 테스트 실행 방법

```bash
docker compose -f docker-compose.test.yml up -d --build
docker exec -it gateway-svc-test sh
npm run test:e2e
```

- 테스트 다시 실행 할 시 아래 코드 실행하여 테스트 DB 데이터 초기화 후 위 코드 다시 실행
```bash
docker compose -f docker-compose.test.yml down -v
```

---

## 로그 관련 세팅

### 로깅 모듈

- Winston 사용

### 로그 확인 방법

```bash
docker logs -f gateway-svc
```

![image](https://github.com/user-attachments/assets/80642c80-a45c-4ee4-a089-189c5ddf9075)

- 위 이미지와 같이 간단하게 어떤 사용자가 언제 어떤 요청을 하였는지 확인 가능

---


## 개선 가능성이 있는 부분

- 더욱 다양한 조건을 가진 이벤트를 추가하여 각 이벤트 별로 조건 검증 로직을 추가로 구현하면 보다 완성도가 더 높아질 것 같음
- 기존에 가입했다가 부정행위나 불법적인 행위를 한 유저의 ip 및 이메일을 블랙리스트에 넣어 추후 다른 아이디 혹은 다른 위치에서 재가입하려 할때 차단되게 하는 기능도 추가 가능
- 회원가입 시 이메일 인증 절차 추가 가능
- 로그인 후 토큰 만료 시간이 됐을때 로그아웃 되는게 아니라 리프레시 토큰을 발급받는 로직 추가 가능
- 로그를 좀 더 구체적으로 남기는 작업

---

## 구현하면서 느낀 점

- 물론 간단한 소규모 과제였지만 인증 파트부터 기능 구현, 데이터베이스 설계까지 전부 해본건 이번이 처음이었습니다. 그래서 그런지 중간중간 어디까지 했고 어느 부분을 할 차례인지 헷갈릴 때도 있었지만 기능 체크리스트를 작성하며 해당 문제는 잘 해결됐고 여러모로 뜻깊은 과제였던것 같습니다.!
