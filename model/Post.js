const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    images : {
        type :Array
    }
});

// export model user with UserSchema
module.exports = mongoose.model("posts", UserSchema);
