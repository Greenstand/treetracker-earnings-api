const s3 = require('../infra/S3/s3');

const uploadCsv = async (csv, Key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    ContentType: 'text/csv',
    Key,
    Body: csv,
    ACL: 'private',
  };

  const uploadPromise = s3.upload(params).promise();
  return uploadPromise;
};

module.exports = {
  uploadCsv,
};
