const express = require('express');
const multer  = require('multer')
const assert = require('assert');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.json').mongo_uri;
const PORT = Number(process.env.PORT || require('./config.json').port);
const user = require("./route/user");
const app = express();
var fileExtension = require('file-extension')
//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// db connection
mongoose.Promise = global.Promise;
mongoose
    .connect(config, {useNewUrlParser: true})
    .then((res) => {
        console.log("Database connected");
    })
    .catch((err) => assert.equal(err, null));
app.use(cors());

app.use("/user", user);
app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});

/*
/!*multer*!/
var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'my_uploaded_files')
    },

    // Setting name of file saved
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
    }
})
var upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            //Error
            cb(new Error('Please upload JPG and PNG images only!'))
        }
        //Success
        cb(undefined, true)
    }
})
app.post('/multiple', upload.single('uploadedImage'), (req, res, next) => {
    const file = req.file
    console.log(req);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.status(200).send({
        statusCode: 200,
        status: 'success',
        uploadedFile: file
    })

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})*/
app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
});
