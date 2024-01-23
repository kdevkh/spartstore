import mongoose from "mongoose"; // 몽구스 모델을 생성하기 위함

const SpartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // product 필드는 필수 요소입니다.
  },
  thumbnailUrl: {
    type: String,
    required: false, // thumbnailUrl 필드는 필수 요소입니다.
  },
  price: {
    type: Number,
    required: true, // price 필드 또한 필수 요소입니다.
  },
  description: {
    type: String,
    required: true, // description 필드 또한 필수 요소입니다.
  },
  seller: {
    type: String,
    required: true, // seller 필드 또한 필수 요소입니다.
  },
  password: {
    type: String,
    required: true, // password 필드 또한 필수 요소입니다.
  },
  status: {
    type: String, // status 필드 추가
    enum: ["FOR_SALE", "SOLD_OUT"],
    default: "FOR_SALE", // 기본 값은 "FOR_SALE"
  },
  createdAt: {
    type: Date,
    default: Date.now, // 날짜 타입입니다.
  },
});

// SpartSchema를 바탕으로 SpartStore모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Spart", SpartSchema);
