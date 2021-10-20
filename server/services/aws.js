const s3 = require("./s3");

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
