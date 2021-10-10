const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const upload_csv = async (csv, Key) => {
  const params = {
    Bucket: process.env.BUCKET,
    ContentType: 'text/csv',
    Key,
    Body: csv,
    ACL: 'private',
  };

  const putObjectPromise = s3.putObject(params).promise();
  await putObjectPromise;
};

module.exports = {
  upload_csv,
};
