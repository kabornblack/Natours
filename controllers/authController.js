const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");


exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    //THIS WILL BE THE BEST PRACTICE TO SIGN UP USER AS NORMAL AND THEN WE CAN CADD ADMIN ROLE ON MONGODB IF THEY ARE TO BE SIGNED AS ADMIN
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirmed: req.body.passwordConfirmed
    // });

    const expiresIn = 3600;
    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: expiresIn
    });

    res.status(201).json({
        status: "successfull",
        token,
        data: {
            user: newUser
        }
    });
});