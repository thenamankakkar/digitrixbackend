const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    category_id: {type: String},
    category_name: {type: String}
});

// export model user with UserSchema
module.exports = mongoose.model("categories", UserSchema);
