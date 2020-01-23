const { uuid } = require('uuidv4');
var aws = require('aws-sdk');
require("dotenv").config();

aws.config.update({
    accessKeyId: process.env.AWS_EXPLORER_ID,
    secretAccessKey: process.env.AWS_EXPLORER_SKEY,
    region: 'ap-southeast-2'
});

// aws.config.region = 'ap-southeast-2';

const getImageUrl = (req, res) => {
    // console.log(req);
    const {file_type} = req.body;

    const key = `images/${uuid()}`;
    var s3 = new aws.S3();

    const url = s3.getSignedUrl('putObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: file_type,
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