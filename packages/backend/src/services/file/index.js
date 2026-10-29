const aws = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const { s3BucketConfig } = require("../../config"); // Your configuration file
const { getPath } = require("./uploadPaths"); // Assuming you have a function to get the path
const path = require('path')

aws.config.update({
  secretAccessKey: s3BucketConfig.secretAccessKey,
  accessKeyId: s3BucketConfig.accessKeyId,
});

const s3 = new aws.S3({
  endpoint: s3BucketConfig.baseUrl,
});

const storage = multerS3({
  s3,
  bucket: s3BucketConfig.bucket,
  key: function (req, file, cb) {
    cb(
      null,
      `${getPath(req.originalUrl)}${Date.now()}-original-${file.originalname}`
    );
  },
  acl: "public-read",
});

const imageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validFileTypes = /jpg|jpeg|png|mp4|mov|avi|avif|pdf/

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
      s3.deleteObject(
        {
          Bucket: s3BucketConfig.bucket,
          Key: file.constructor === String ? file : file.key,
        },
        function (err, data) { }
      );
    });
  }
};

module.exports = { imageUpload, deleteFile };
