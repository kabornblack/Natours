const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email address"],
        unique: [true, "Email address already in use"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"]
        // {
        //     validator: function (value) {
        //       // Regular expression for email validation
        //       const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        //       return emailRegex.test(value);
        //     },
        //     message: "Please enter a valid email address",
        //   },
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8
    },
    passwordConfirmed: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (value) {
            return value === this.password;
            },
            message: "Passwords do not match",
        }
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;