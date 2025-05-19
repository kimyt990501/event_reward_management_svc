db = db.getSiblingDB('reward-management-db');

// events 컬렉션에 데이터 삽입
const events = [
  {
    title: "3일 연속 출석 이벤트",
    description: "3일 연속 로그인하면 보상 지급",
    condition: "login_3_days",
    active: true,
    startAt: new Date("2025-05-01T09:00:00Z"),
    endAt: new Date("2025-06-01T09:00:00Z"),
  },
  {
    title: "친구 3명 초대 이벤트",
    description: "친구 3명을 초대하면 보상을 드립니다.",
    condition: "invite_3_friends",
    active: true,
    startAt: new Date("2025-05-01T09:00:00Z"),
    endAt: new Date("2025-07-10T09:00:00Z"),
  }
];

db.events.insertMany(events);

// events 컬렉션에서 _id를 찾아 rewards에 참조할 수 있도록 미리 가져오기
const eventLogin = db.events.findOne({ condition: "login_3_days" });
const eventInvite = db.events.findOne({ condition: "invite_3_friends" });

// rewards 컬렉션에 데이터 삽입
const rewards = [
  {
    name: "친구 3명 초대 쿠폰",
    type: "coupon",
    quantity: 1,
    eventId: eventInvite._id.toString(),
  },
  {
    name: "3일 연속 로그인 쿠폰",
    type: "coupon",
    quantity: 1,
    eventId: eventLogin._id.toString(),
  }
];

db.rewards.insertMany(rewards);