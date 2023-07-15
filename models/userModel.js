const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    photo: String,
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
    },
    passwordConfirmed: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            //This is only going to work on CREATE and SAVE!!!
            validator: function (value) {
            return value === this.password;
            },
            message: "Passwords do not match",
        }
    },
    passwordChangedAt: Date
});

userSchema.pre("save", async function(next) {
    //Only run this if password was modified
    if (!this.isModified("password")) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete password confirmed field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimeStamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp <= changedTimestamp;
    }

    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;