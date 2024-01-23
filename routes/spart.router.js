import express from "express";
import joi from "joi";
import Spart from "../schemas/spart.schemas.js";

const router = express.Router();

const createdSpartSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
  thumbnailUrl: joi.string(),
  price: joi.number().min(100).max(10000000).required(),
  description: joi.string().min(10).required(),
  seller: joi.string().min(3).max(30).required(),
  password: joi.string().min(4).required(),
});

const updatedSpartSchema = joi.object({
  name: joi.string().min(3).max(50),
  description: joi.string().min(10),
  status: joi.string(),
  price: joi.number().min(100).max(10000000),
});

// 1. 상품 작성 API
router.post("/goods", async (req, res, next) => {
  try {
    const validation = await createdSpartSchema.validateAsync(req.body);

    const { name, thumbnailUrl, price, description, seller, password } =
      validation; // 전역변수로 빼보자

    // // 기본 상태는 판매 중
    // const status = "FOR_SALE";

    const product = new Spart({
      name,
      thumbnailUrl,
      price,
      description,
      seller,
      password,
      status,
    });

    const savedProduct = await product.save();

    return res
      .status(201)
      .json({ message: "상품 등록됐음~~", product: savedProduct });
  } catch (error) {
    next(error);
  }
});

// 2. 상품 목록 조회 API
router.get("/goods", async (req, res, next) => {
  try {
    const products = await Spart.find()
      .select("name thumbnailUrl price seller status createdAt")
      .sort("-createdAt") //내림차순
      .exec();

    return res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
});

// 3. 상품 상세 조회 API
router.get("/goods/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Spart.findById(productId).select("-password").exec(); // 비번 배제

    if (!product) {
      return res.status(404).json({ message: "상품 조회 실패했음@@@@@!!!!!" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
});

// 4. 상품 정보 수정 API
router.put("/goods/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { password, ...updateFields } = req.body;

    const validation = await updatedSpartSchema.validateAsync(updateFields);

    const product = await Spart.findById(productId).exec();

    if (!product) {
      return res.status(404).json({ message: "상품 없음...!!!" });
    }

    if (password !== product.password) {
      return res.status(401).json({ message: "비번 그게 아님" });
    }

    // 업데이트 필드 적용
    Object.assign(product, validation);

    const updatedProduct = await product.save();

    return res
      .status(200)
      .json({ message: "수정됐음~~", product: updatedProduct });
  } catch (error) {
    next(error);
  }
});

// 5. 상품 삭제 API
router.delete("/goods/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { password } = req.body;

    const product = await Spart.findById(productId).exec();

    if (!product) {
      return res.status(404).json({ message: "상품 없음...!!!" });
    }

    if (password !== product.password) {
      return res.status(401).json({ message: "비번 그게 아님" });
    }

    await Spart.findByIdAndDelete(productId).exec(); //내장함수 활용

    return res.status(200).json({ message: "삭제했음~" });
  } catch (error) {
    next(error);
  }
});

export default router;
