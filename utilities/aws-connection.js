const { uuid } = require('uuidv4');
var aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

async function getPresignedUploadUrl(bucket, directory) {
  const key = `${directory}/${uuid()}`;
  var s3 = new aws.S3();
  const url = await s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: key,
      ContentType: 'image/*',
      Expires: 300,
    })
    .promise();
return url;
}



module.exports = { getPresignedUploadUrl };