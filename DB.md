# 이벤트 / 보상 관리 플랫폼 MongoDB 데이터베이스 구조

---

## 1. Users 컬렉션

| 필드명       | 타입           | 설명                               | 제약조건                         | 기본값              |
|--------------|----------------|----------------------------------|---------------------------------|---------------------|
| `_id`        | ObjectId       | 문서 고유 ID                      | 자동 생성                       |                     |
| `email`      | String         | 사용자 이메일                     | 필수, 유니크                    |                     |
| `password`   | String         | 비밀번호 (해시 저장)              | 필수                           |                     |
| `roles`      | [String]       | 사용자 권한 리스트                | `Role` enum, 기본 `[USER]`     | `[Role.USER]`        |
| `lastLoginAt`| Date or null   | 마지막 로그인 시간                |                                 | `null`              |
| `loginDaysCount` | Number      | 누적 로그인 일수                  |                                 | 0                   |
| `invitedBy`  | String or null | 초대한 사용자 이메일 (추천인)     | 선택적                         | `null`              |
| `inviteCnt`  | Number         | 추천한 사용자 수                  |                                 | 0                   |

---

## 2. Events 컬렉션

| 필드명     | 타입       | 설명                              | 제약조건            | 기본값          |
|------------|------------|---------------------------------|---------------------|-----------------|
| `_id`      | ObjectId   | 문서 고유 ID                     | 자동 생성           |                 |
| `title`    | String     | 이벤트 제목                      | 필수                |                 |
| `description` | String  | 이벤트 상세 설명                | 선택적              |                 |
| `condition`| String     | 이벤트 조건                     | 필수                |                 |
| `active`   | Boolean    | 이벤트 활성 여부                |                     | `true`          |
| `startAt`  | Date       | 이벤트 시작일                   | 필수                |                 |
| `endAt`    | Date       | 이벤트 종료일                   | 필수                |                 |

---

## 3. Requests 컬렉션 (보상 요청)

| 필드명       | 타입          | 설명                                | 제약조건              | 기본값            |
|--------------|---------------|-----------------------------------|-----------------------|-------------------|
| `_id`        | ObjectId      | 문서 고유 ID                      | 자동 생성             |                   |
| `userEmail`  | String        | 요청한 사용자 이메일               | 필수                  |                   |
| `eventId`    | ObjectId      | 참조: Events 컬렉션의 `_id`       | 필수                  |                   |
| `eventTitle` | String        | 이벤트 제목 (복사 저장)             | 필수                  |                   |
| `status`     | String        | 요청 상태 ('PENDING', 'SUCCESS', 'FAILED') | 기본값 'PENDING' | `'PENDING'`       |
| `requestedAt`| Date          | 요청 일시                         |                       |                   |
| `approvedAt` | Date or null  | 승인 일시 (성공 시)               | 선택적                |                   |
| `rejectedAt` | Date or null  | 거절 일시 (실패 시)               | 선택적                |                   |

---

## 4. Rewards 컬렉션 (보상 정보)

| 필드명      | 타입          | 설명                               | 제약조건              | 기본값          |
|-------------|---------------|----------------------------------|-----------------------|-----------------|
| `_id`       | ObjectId      | 문서 고유 ID                     | 자동 생성             |                 |
| `name`      | String        | 보상명                           | 필수                  |                 |
| `type`      | String        | 보상 타입 (예: 쿠폰, 포인트 등) | 선택적                |                 |
| `quantity`  | Number        | 수량                             | 선택적                |                 |
| `eventId`   | ObjectId      | 참조: Events 컬렉션의 `_id`       | 필수                  |                 |

---
