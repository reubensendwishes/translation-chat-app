const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

if (!ACCESS_TOKEN_SECRET) {
  console.error("ERROR:缺少必要的環境變數：ACCESS_TOKEN_SECRET。");
  process.exit(1);
}

if (!REFRESH_TOKEN_SECRET) {
  console.error("ERROR:缺少必要的環境變數：REFRESH_TOKEN_SECRET。");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("ERROR:缺少必要的環境變數：MONGO_URI。");
  process.exit(1);
}

export const config = {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  MONGO_URI,
  PORT,
  NODE_ENV,
};
