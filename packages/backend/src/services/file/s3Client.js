const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// create s3 instance using S3Client 
// (this is how we create s3 instance in v3)
const s3 = new S3Client({
    credentials: {
        accessKeyId: "YOUR_ACCESS_KEY_ID_HERE", // store it in .env file to keep it safe
        secretAccessKey: "YOUR_SECRET_KEY_HERE"
    },
    region: "ap-south-1" // this is the region that you select in AWS account
})