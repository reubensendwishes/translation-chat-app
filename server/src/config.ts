const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const MONGO_URI = process.env.MONGO_URI
const PORT = Number(process.env.PORT) || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const CLIENT_URL = process.env.CLIENT_URL
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY

if (!ACCESS_TOKEN_SECRET) {
	console.error('ERROR:缺少必要的環境變數：ACCESS_TOKEN_SECRET。')
	process.exit(1)
}

if (!REFRESH_TOKEN_SECRET) {
	console.error('ERROR:缺少必要的環境變數：REFRESH_TOKEN_SECRET。')
	process.exit(1)
}

if (!MONGO_URI) {
	console.error('ERROR:缺少必要的環境變數：MONGO_URI。')
	process.exit(1)
}

if (!FIREBASE_STORAGE_BUCKET) {
	console.error('ERROR:缺少必要的環境變數：FIREBASE_STORAGE_BUCKET。')
	process.exit(1)
}

if (!GOOGLE_TRANSLATE_API_KEY) {
	console.error('ERROR:缺少必要的環境變數：GOOGLE_TRANSLATE_API_KEY。')
	process.exit(1)
}

export const config = {
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	MONGO_URI,
	PORT,
	NODE_ENV,
	CLIENT_URL,
	FIREBASE_STORAGE_BUCKET,
	GOOGLE_TRANSLATE_API_KEY,
}
