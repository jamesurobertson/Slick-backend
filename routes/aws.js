const express = require("express");
const { requireAuth } = require("../auth");
const { User } = require("../db/models");
const { asyncHandler } = require("../utils");
const path = require('path')

const multer = require('multer')
const AWS = require('aws-sdk')
const fs = require('fs')
const keys = require('../keys')

const router = express.Router();

// configuring the DiscStorage engine.
const storage = multer.diskStorage({
   destination: "./public/uploads/",
   filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({ storage, limits: {fileSize: 1000000} });

//setting the credentials
//The region should be the region of the bucket that you created
//Visit this if you have any confusion - https://docs.aws.amazon.com/general/latest/gr/rande.html
AWS.config.update({
    accessKeyId: keys.iam_access_id,
    secretAccessKey: keys.iam_secret,
    region: 'us-east-2',
});

//Creating a new instance of S3:
const s3= new AWS.S3();

//POST method route for uploading file
router.post('/post_file', requireAuth, upload.single('img'), asyncHandler(async(req, res) => {
  //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.
  //req.file is the demo_file
  uploadFile(req.file.path, req.file.filename ,res);
  const userId = req.user.id
  const user = await User.findByPk(userId)
  await user.update({ profileImageUrl: `http://localhost:8080/aws/get_file/${req.file.filename}` });
  res.json(user)
}))

//GET method route for downloading/retrieving file
router.get('/get_file/:file_name', asyncHandler( async (req,res)=>{
  retrieveFile(req.params.file_name, res);
}));

//The uploadFile function
function uploadFile(source,targetName,res){
    console.log('preparing to upload...');
    fs.readFile(source, function (err, filedata) {
        if (!err) {
        const putParams = {
            Bucket      : 'slickpics',
            Key         : targetName,
            Body        : filedata
        };
        s3.putObject(putParams, function(err, data){
          if (err) {
              console.error('Could nor upload the file. Error :',err);
            return res.send({success:false});
        }
        else{
            // fs.unlinkSync(source);// Deleting the file from uploads folder(Optional).Do Whatever you prefer.
            console.log('Successfully uploaded the file');
            return
          }
        });
      }
      else{
        console.error({'err':err});
      }
    });
  }

//The retrieveFile function
function retrieveFile(filename,res){

  const getParams = {
    Bucket: 'slickpics',
    Key: filename
  };

  s3.getObject(getParams, function(err, data) {
    if (err){
      retrieveFile(filename, res)
    //   return res.status(400).send({success:false,err:err});
    }
    else{
      return res.send(data.Body);
    }
  });
}

module.exports = router
