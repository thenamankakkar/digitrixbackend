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

app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
});
