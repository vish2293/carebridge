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
  mongo: {
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    authSource: process.env.DB_AUTH_SOURCE,
    caFile: process.env.DB_CA_FILE,
    isSSL: process.env.DB_SSL,
  },
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
