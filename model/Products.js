const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    product_id: {type: String},
    product_name: {type: String},
    product_desc: {type: String},
    product_actualprice: {type: String},
    product_discountedprice: {type: String},
    product_image: {type: String},
    category_details: {
        category_id :{type : String},
        category_name :{type : String},
    },
});

// export model user with UserSchema
module.exports = mongoose.model("products", UserSchema);
