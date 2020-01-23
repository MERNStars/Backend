const { uuid } = require('uuidv4');
var aws = require('aws-sdk');
require("dotenv").config();

aws.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});
aws.config.region = 'ap-southeast-2';

const getImageUrl = (req, res) => {
    console.log("Image url...");
    const key = `images/${uuid()}`;
    var s3 = new aws.S3();
    const url = s3.getSignedUrl('putObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: 'image/*',
      Expires: 300,
    }, 
    (err, url)=>{
        if(err)
            res.status(400).json({success:false, message: "Something went wrong"});
        else
            res.status(200).json({success: false, message: "Here is your url", data: url});

        }
    );
    
    return res;
}


module.exports = { getImageUrl };