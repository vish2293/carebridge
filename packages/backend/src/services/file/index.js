const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3BucketConfig } = require("../../config");
const { getPath } = require("./uploadPaths");
const path = require('path')

const s3 = new S3Client({
  endpoint: s3BucketConfig.baseUrl,
  region: s3BucketConfig.region,
  credentials: {
    accessKeyId: s3BucketConfig.accessKeyId,
    secretAccessKey: s3BucketConfig.secretAccessKey,
  },
});

const storage = multerS3({
  s3,
  bucket: s3BucketConfig.bucket,
  key: function (req, file, cb) {
    cb(
      null,
      `${getPath(req.originalUrl)}${Date.now()}-original-${file.originalname.replace(/[^\w.-]/g, '_')}`
    );
  },
  acl: "public-read",
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    const validFileTypes = /^\.(jpg|jpeg|png|mp4|mov|avi|avif|pdf)$/

    const extname = validFileTypes.test(path.extname(file.originalname).toLowerCase())

    if (extname === true) {
      return cb(null, true)
    } else {
      return cb("Error: Please upload valid file")
    }
  }
});

/**
 * Delete files
 * @param {*} files
 */
const deleteFile = (files) => {
  if (files) {
    (files.constructor === Array ? [...files] : [files]).forEach((file) => {
      s3.send(
        new DeleteObjectCommand({
          Bucket: s3BucketConfig.bucket,
          Key: file.constructor === String ? file : file.key,
        })
      ).catch(() => { });
    });
  }
};

module.exports = { imageUpload, deleteFile };
