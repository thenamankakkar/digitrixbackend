const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
SUMMER: {
    type: String,
    required: true},
DISCOUNT: {type: String},
ACTIVE: {type: String},
});

// export model user with UserSchema
   module.exports = mongoose.model("coupons", UserSchema);
