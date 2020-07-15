const express = require('express');
var today = new Date();
const moment = require('moment')
const fileUpload = require('express-fileupload');
const AWS = require("aws-sdk");
const BUCKET_NAME = "new-s3-uploader";
const s3 = new AWS.S3({
    accessKeyId: process.env.API_ID,
    secretAccessKey: process.env.API_KEY,
});
const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

/** @description Method for Uploading Files
 * @async
 * @method
 * @param {object} req - Request object contains  files to upload
 * @param {object} res - Reponse object contains details of Uploaded data.
 * @param {function next(error) {
}} next - calls the error handling middleware.
*/
async function uploadS3(req, res, next) {
    try {
        //const BUCKET_FOLDER = user.firstName + "_" + user.lastName + "_" + user.id;
       
        let imageFile = req.files;
        console.log(req.body)
        const dataArray = []
        let i = 0
        let imageFileArr = []
        console.log(Object.keys(imageFile).length, "SSSSSSSSSS")
        if (!Array.isArray(imageFile)) {
            imageFileArr.push(imageFile)
        }
        else {
            imageFileArr = imageFile
        }
        console.log(imageFileArr, 'AAAAAAAAAA')

        imageFileArr.map((item, key) => {

            var params = {
                Bucket: BUCKET_NAME,
                Key: BUCKET_FOLDER + "/" + item.name,
                Body: item.data,
                ACL: "public-read",
            };
            s3.upload(params, async function (err, data) {
                if (err) {
                    console.log("Error creating the folder: ", err);
                } else {
                    dataArray.push(data)
                    console.log("Successfully UPLOADED file on S3");
                    const uData = await models.Data.create({
                        fName: data.Key.replace(BUCKET_FOLDER + '/', ""),
                        fType: item.mimetype,
                        fSize: (item.size / 1000) + ' KB',
                        file: data.Location,
                        fDate: moment(today).format('L'),
                        email: user.email
                    })
                    i = i + 1
                    if (i === imageFileArr.length) {
                        res.status(200).json({
                            success: true,
                            data: dataArray,
                            message: "SUCCESSFULLY UPLOADED",
                        });
                    }


                }
            });
       });
        logger.info('FILE UPLOADED to S3')
    }

    catch (error) {
        res.status(400).json({
            error:error
        });
       
    }
  }

  module.exports=uploadS3