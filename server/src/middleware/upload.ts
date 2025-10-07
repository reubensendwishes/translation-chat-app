import multer from 'multer'

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/webp']
		cb(null, allowed.includes(file.mimetype))
	},
})

export default upload
