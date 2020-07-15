const express = require('express');
require('dotenv').config()
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();
const AWS = require('aws-sdk');
const BUCKET_NAME = 'new-s3-upload';
const s3 = new AWS.S3({
    accessKeyId: process.env.API_ID,
    secretAccessKey: process.env.API_KEY,
});
app.use(fileUpload({

    abortOnLimit: false,
    responseOnLimit: true,
    limits: {
        fileSize: 50 * 1024 * 1024
    },
}));

app.use(bodyParser.json());

app.post('/fileupload', async (req, res) => {
    try {
        uploadedFilesCount = 0
        dataArray = []
        let msg
        if (!req.files) {

            res.send({success:false})
            
        } else {

            inputFileArray = []
            inputFile = req.files.file
            if (!Array.isArray(inputFile)) {
                inputFileArray.push(inputFile)
            }
            else {
                inputFileArray = inputFile
            }
            inputFileArray.map((item, key) => {
                let file = inputFileArray[key];
                if (file.size / 1000000 < 50) {
                    var params = {
                        Bucket: BUCKET_NAME,
                        Key: file.name,
                        Body: file.data

                    };
                    s3.upload(params, async function (err, data) {
                        if (err) {
                            console.log('Error creating the folder: ', err);
                        }
                        else {
                            console.log('Successfully UPLOADED file on S3');

                            dataArray.push({
                                name: file.name,
                                mimetype: file.mimetype,
                                size: file.size
                            });

                            uploadedFilesCount = uploadedFilesCount + 1
                            if (uploadedFilesCount === inputFileArray.length) {

                                msg = 'SUCCESSFULLY UPLOADED'
                            }
                            else
                                msg = 'All files should be less than 50MB'
                        }

                    });
                }
                else {

                    msg = `${file.name} should be less than 50MB`
                }
            })

        }
        res.status(200).json({
            success: true,
            data: dataArray,
            message: msg,
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const port = process.env.PORT || 8000;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);