async function getPresignedUploadUrl(bucket, directory) {
  const key = `${directory}/${uuid.v4()}`;
  const url = await s3
    .getSignedUrl('putObject', {
      Bucket: bucket,
      Key: key,
      ContentType: 'image/*',
      Expires: 300,
    })
    .promise();
  return url;
}



module.exports = { getPresignedUploadUrl };