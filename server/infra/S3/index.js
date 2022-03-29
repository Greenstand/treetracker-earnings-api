const log = require("loglevel");
const s3 = require('./s3');

const uploadCsv = async (csv, Key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    ContentType: 'text/csv',
    Key,
    Body: csv,
    ACL: 'private',
  };

  log.info("setting for s3:", params)

  const uploadPromise = s3.upload(params).promise();
  return uploadPromise;
};

module.exports = {
  uploadCsv,
};
