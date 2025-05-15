# 이벤트/보상 관리 플랫폼 (NestJS MSA)

## 프로젝트 개요

이 프로젝트는 NestJS와 MongoDB 기반으로 구축된 이벤트/보상 관리 시스템입니다.  
MSA 아키텍처로 세 개의 서비스(`auth-svc`, `event-svc`, `gateway-svc`)와 MongoDB 컨테이너로 구성되어 있습니다.

---

## 서비스 구성 및 역할

| 서비스 이름    | 포트  | 역할                                                         |
|---------------|-------|--------------------------------------------------------------|
| auth-svc      | 3100  | 유저 등록, 로그인, JWT 발급, 역할 관리                       |
| event-svc     | 3200  | 이벤트/보상 생성 및 관리, 유저 보상 요청 처리                |
| gateway-svc   | 3300  | API 게이트웨이, JWT 인증 및 역할 기반 권한 검사, 요청 라우팅  |
| mongo         | 27017 | MongoDB 데이터베이스                                        |

---

## 주요 기술 스택

- Node.js 18.x
- NestJS 최신 버전
- MongoDB 6.x
- JWT 기반 인증 및 역할 기반 권한 관리
- Docker & Docker Compose
- TypeScript

---

## 실행 방법

1. Docker 및 Docker Compose 설치 ([공식 문서](https://docs.docker.com/compose/install/))

2. 각 서비스 폴더에 `.env` 파일 생성 및 환경 변수 설정

예시: auth-svc/.env

\`\`\`env
PORT=3100
MONGO_URI=mongodb://mongo:27017/auth-db
JWT_SECRET=secret
JWT_EXPIRES_IN=1h
\`\`\`

예시: event-svc/.env

\`\`\`env
PORT=3200
MONGO_URI=mongodb://mongo:27017/event-db
JWT_SECRET=secret
JWT_EXPIRES_IN=1h
\`\`\`

예시: gateway-svc/.env

\`\`\`env
PORT=3300
JWT_SECRET=secret
JWT_EXPIRES_IN=1h
\`\`\`

3. 루트 디렉토리에서 Docker Compose 실행

\`\`\`bash
docker-compose up --build
\`\`\`

4. 서비스가 정상 실행되면 아래 포트로 접근 가능

- http://localhost:3100 — auth-svc  
- http://localhost:3200 — event-svc  
- http://localhost:3300 — gateway-svc  

---

## API 테스트 가이드

### 1. 유저 등록 및 로그인 (auth-svc)

- POST /auth/register : 유저 생성 (역할 포함)  
- POST /auth/login : 로그인 후 JWT 토큰 발급  

### 2. 이벤트 & 보상 관리 (gateway-svc → event-svc)

- POST /events : 이벤트 생성 (OPERATOR, ADMIN 권한)  
- POST /rewards : 보상 생성 (OPERATOR, ADMIN 권한)  

### 3. 유저 보상 요청 (gateway-svc → event-svc)

- POST /requests/:eventId : 보상 요청 (USER 권한)  
- GET /requests/my : 본인 보상 요청 이력 조회 (USER 권한)  
- GET /requests : 전체 보상 요청 내역 조회 (AUDITOR, OPERATOR, ADMIN 권한)  

---

## 역할별 권한 요약

| 역할      | 가능 작업                                |
|-----------|----------------------------------------|
| USER      | 보상 요청, 본인 요청 내역 조회          |
| OPERATOR  | 이벤트/보상 생성, 전체 요청 내역 조회    |
| AUDITOR   | 전체 요청 내역 조회                     |
| ADMIN     | 모든 기능 접근 가능                      |

---

## 추가 정보

- JWT 토큰은 Authorization: Bearer <token> 헤더로 API 요청에 포함해야 합니다.  
- 모든 서비스는 `.env` 파일을 통해 민감 정보 및 포트를 관리합니다.  
- 각 서비스는 독립적으로 동작하며, Docker Compose로 통합 실행됩니다.  
- 테스트는 Postman 또는 curl을 통해 가능합니다.  

---

## 프로젝트 구조

\`\`\`
├── auth-svc/
├── event-svc/
├── gateway-svc/
├── docker-compose.yml
├── README.md
\`\`\`

---