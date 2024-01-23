import express from "express";
import connect from "./schemas/index.js";
import spartRouter from "./routes/spart.router.js";
import errorHandler from "./middlewares/error-handler.js";
import Spart from "./schemas/spart.schemas.js";

const app = express();
const PORT = 3000;

connect();

// ejs endeavor
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ejs endeavor
app.use(express.static("./style"));

app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl, "-", new Date());
  next();
});

const router = express.Router();

// ejs endeavor
app.get("/", async (req, res) => {
  const products = await Spart.find()
    .select("name thumbnailUrl price seller status createdAt")
    .sort("-createdAt")
    .exec();

  res.render("index", { post: products });
});

app.use("/api", [router, spartRouter]);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
