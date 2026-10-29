/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable radix */
/**
 * Config object
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../.env') });

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  s3BucketConfig: {
    baseUrl: process.env.S3_BASE_URL,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
  },
};
/**
 * Exports config
 */
module.exports = config;
