const express = require("express");
const {check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../model/User");
const Addpost = require("../model/Post");
const Products = require("../model/Products");
const Categories = require("../model/Categories");
const Cart = require("../model/Cart");
const Coupon = require("../model/Discount");
const auth = require("../middleware/auth");
const multer  = require('multer')
var fileExtension = require('file-extension')
router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
          console.log("79",req.body)
            console.log(err.message);
            res.status(500).send("Error in Sign up");
        }
    }
);


router.post(
    "/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
      console.log("i am res",res)
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {email, password} = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);


router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({message: "Error in Fetching user"});
    }
});


/*All prouducts & Categories*/
router.get("/products", async (req, res) => {
    Products.find((err, result) => {
        if (err) assert.deepStrictEqual(null, err);
        res.json(result);
    });
});

/*get single product & categories*/
router.get("/single", async (req, res) => {
    Products.find({"category_details.category_id": req.query.id},
        (err, result) => {
            if (err) assert.deepStrictEqual(null, err);
            res.json(result);
        }
    );
    res.json(result);
});


/*get all categories*/
router.get("/categories", async (req, res) => {
    Categories.find((err, result) => {
        if (err) assert.deepStrictEqual(null, err);
        res.json(result);
    });
});


/*search product by name*/
router.post("/search", async (req, res) => {
    var query = req.query.name;
    Products.find({product_name: {$regex: query, $options: '$i'}}).then(
        data => {
            /* res.send(data);*/
            if (data.length === 0) {

                res.send({message: "No Matching Search Found"})
            } else {
                res.send(data)
            }
        }
    )
});

/*get cart details of a particular user*/
router.post("/getcart", async (req, res) => {
    Cart.find({user_id: req.query.userid}, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result);
        }
    })
});


/*update cart quantity product by id*/
router.post("/updatecart", async (req, res) => {

    Cart.findByIdAndUpdate({_id : req.query.id},{
        quantity : req.query.quantity,
        totalprice : req.query.totalprice
    },(err, result) => {
        if (err) assert.deepStrictEqual(null, err);
        res.json(result);
    });

});


/*delete cart items*/
router.post("/deletecart", async (req, res) => {
    Cart.findByIdAndDelete({_id : req.query.id},(err, result) => {
        if (err) assert.deepStrictEqual(null, err);
        res.json(result);
    });

});
/*multer post*/

/*multer*/
var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'my_uploaded_files')
    },

    // Setting name of file saved
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.' + fileExtension(file.originalname))
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
const cpUpload = upload.fields([{ name: 'fileSource', maxCount: 5 }])

router.post('/addpost', cpUpload, (req, res, next) => {
    let images =[]
    req.files.fileSource.forEach(element => {
        console.log(element)
        images.push({path : element.path,filename : element.originalname})
    });
    const file = req.files
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
    let data = {
        title: req.body['title'],
        images : images
    }
    Addpost.insertMany(data, function (err, result) {
        if (err) {
            res.send(err)
        } else {

        }
    })

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})
router.get('/addpost', cpUpload, (req, res, next) => {
    Addpost.find((err, result) => {
        if (err) assert.deepStrictEqual(null, err);
        res.json(result);
    });
})

module.exports = router;
