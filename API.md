# 이벤트 / 보상 관리 플랫폼 API 명세서

---

## Auth

### [POST] /api/register  
- **설명**: 사용자 회원가입
- **권한**: 없음  
- **요청 바디**:
```json
{
  "email": "user5@example.com",
  "password": "password5",
  "roles": ["USER"]
}
```

- **성공 응답**: `201 Created`
```json
{
  "code": "SUCCESS",
  "data": {
      "message": "회원가입이 성공적으로 완료되었습니다."
  }
}
```

- **실패 응답**: `400 Bad Request`
```json
{
  "message": "Email already exists"
}
```

---

### [POST] /api/login  
- **설명**: 로그인 및 토큰 발급
- **권한**: 없음  
- **요청 바디**:
```json
{
  "email": "user1@example.com",
  "password": "password1"
}
```

- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "access_token": "eyJhbGciOi..."
  }
}
```

---

## Events

### [POST] /api/events  
- **설명**: 이벤트 등록
- **권한**: `ADMIN`, `OPERATOR`  
- **요청 바디**:
```json
{
  "title": "주간 로그인 이벤트1",
  "description": "이번 주 내내 로그인한 유저에게 쿠폰을 드립니다.",
  "condition": "weekly_login",
  "active": true,
  "startAt": "2025-05-12T00:00:00.000Z",
  "endAt": "2025-05-18T23:59:59.000Z"
}
```

- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "message": "이벤트가 등록되었습니다."
  }
}
```

---

### [GET] /api/events  
- **설명**: 이벤트 목록 조회
- **권한**: `ADMIN`, `OPERATOR`  
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "_id": "68299faa423c30c416d8ee69",
      "title": "주간 로그인 이벤트1",
      "active": true,
      "startAt": "2025-05-12T00:00:00.000Z",
      "endAt": "2025-05-18T23:59:59.000Z"
    }
  ]
}
```

---

### [GET] /api/events/:eventId  
- **설명**: 이벤트 상세 조회
- **권한**: `ADMIN`, `OPERATOR`  
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "_id": "68299faa423c30c416d8ee69",
    "title": "주간 로그인 이벤트1",
    "description": "이번 주 내내 로그인한 유저에게 쿠폰을 드립니다.",
    "condition": "weekly_login",
    "active": true,
    "startAt": "2025-05-12T00:00:00.000Z",
    "endAt": "2025-05-18T23:59:59.000Z"
  }
}
```

---

## Rewards

### [POST] /api/rewards  
- **설명**: 보상 등록
- **권한**: `ADMIN`, `OPERATOR`  
- **요청 바디**:
```json
{
  "name": "주간 로그인 쿠폰2",
  "type": "coupon",
  "quantity": 1,
  "eventId": "68299faa423c30c416d8ee69"
}
```

- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "message": "보상이 등록되었습니다."
  }
}
```

---

### [GET] /api/rewards  
- **설명**: 보상 목록 전체 조회
- **권한**: `ADMIN`, `OPERATOR`  
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "_id": "6829a01d423c30c416d8ee6d",
      "name": "주간 로그인 쿠폰2",
      "type": "coupon",
      "quantity": 1,
      "eventId": "68299faa423c30c416d8ee69",
      "__v": 0
    }
  ]
}
```

---

## Reward Requests

### [GET] /api/requests  
- **설명**: 모든 보상 요청 목록 조회
- **권한**: `ADMIN`, `OPERATOR`, `AUDITOR`  
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "_id": "6829a0b6423c30c416d8ee74",
      "userId": "682863fc04fc6d6693a1f1f9",
      "eventId": "68299faa423c30c416d8ee69",
      "status": "PENDING",
      "requestedAt": "2025-05-18T08:56:22.842Z",
      "__v": 0
    }
  ]
}
```

---

### [POST] /api/requests/:eventId  
- **설명**: 특정 이벤트에 대한 보상 요청 등록
- **권한**: `USER`, `ADMIN`  
- **성공 응답**:
```json
{
    "code": "SUCCESS",
    "data": {
        "message": "보상 요청이 등록되었습니다.",
        "status": "PENDING"
    }
}
```

---

### [PATCH] /api/requests/approve/:requestId  
- **설명**: 보상 요청 승인
- **권한**: `ADMIN`  
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "message": "보상이 승인되었습니다."
  }
}
```

---

### [PATCH] /api/requests/reject/:requestId  
- **설명**: 보상 요청 거절
- **권한**: `ADMIN`  
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "message": "보상이 거절되었습니다."
  }
}
```

---

### [GET] /api/requests/my  
- **설명**: 로그인한 유저의 보상 요청 내역 조회
- **권한**: `USER`  
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "_id": "6829a0b6423c30c416d8ee74",
      "userId": "682863fc04fc6d6693a1f1f9",
      "eventId": "68299faa423c30c416d8ee69",
      "status": "SUCCESS",
      "requestedAt": "2025-05-18T08:56:22.842Z",
      "__v": 0,
      "approvedAt": "2025-05-18T08:57:19.615Z"
    }
  ]
}
```

---

## 공통 에러 응답 예시

- **401 Unauthorized**
```json
{
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

- **403 Forbidden**
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```
