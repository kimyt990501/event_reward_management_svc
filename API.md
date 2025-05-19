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
  "roles": ["USER"] // AUDITOR, ADMIN, OPERATOR
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
  "password": "password1",
  "invited_by": "초대한 사람의 이메일" // 선택 입력 필드
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

### [DELETE] /api/events/:eventId
- **설명**: 이벤트 삭제
- **권한**: `ADMIN`, `OPERATOR`  

- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "message": "이벤트와 연결된 보상이 함께 삭제되었습니다."
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

### [DELETE] /api/rewards/rewardId  
- **설명**: 보상 삭제
- **권한**: `ADMIN`, `OPERATOR`  

- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": {
    "message": "보상이 삭제되었습니다."
  }
}
```

---

## Reward Requests

### [GET] /api/requests?status=&eventId
- **설명**: 모든 보상 요청 목록 조회
- **권한**: `ADMIN`, `OPERATOR`, `AUDITOR`  
- **쿼리 파라미터**: status: 요청 상태 값 (PENDING, SUCCESS, FAIL), eventId: 이벤트 ID
- **성공 응답**:
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "_id": "682ad8f2fb6a5a2d145748fc",
      "user_email": "user1@example.com",
      "event_title": "첫 구매 보상 이벤트",
      "status": "PENDING",
      "requestedAt": "2025-05-19T07:08:34.565Z",
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
      "_id": "682ad8f2fb6a5a2d145748fc",
      "user_email": "user1@example.com",
      "event_title": "첫 구매 보상 이벤트",
      "status": "SUCCESS",
      "requestedAt": "2025-05-19T07:08:34.565Z",
      "__v": 0,
      "approvedAt": "2025-05-19T07:09:14.020Z"
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
