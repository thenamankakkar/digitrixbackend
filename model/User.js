const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    cart_details: {
        type: [{
            product_id: {type: String},
            quantity: {type: String},
            price: {type: String}
        }]
    }
});

// export model user with UserSchema
module.exports = mongoose.model("users", UserSchema);
