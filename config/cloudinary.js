const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const storage = {
  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'restaurant-app',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return cb(error)
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
        })
      }
    )

    file.stream.pipe(uploadStream)
  },

  _removeFile(req, file, cb) {
    cb(null)
  },
}

module.exports = { cloudinary, storage }