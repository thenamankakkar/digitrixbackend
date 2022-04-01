const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true},
    product_id: {type: String},
    quantity: {type: String},
    price: {type: String},
    totalprice: {type: String}
});

// export model user with UserSchema
module.exports = mongoose.model("cart", UserSchema);
