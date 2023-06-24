const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const expiresIn = 9111100;

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: expiresIn
    });
}

exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create(req.body);

    //THIS WILL BE THE BEST PRACTICE TO SIGN UP USER AS NORMAL AND THEN WE CAN CADD ADMIN ROLE ON MONGODB IF THEY ARE TO BE SIGNED AS ADMIN
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirmed: req.body.passwordConfirmed
    // });

    const token = jwt.sign(newUser._id, process.env.JWT_SECRET, {
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

exports.login = catchAsync( async (req, res, next) => {
    //const email = req.body.email;
    //const password = req.body.password;
    //USE OBJECT DESTRUCTURING BELLOW
    const { email, password } = req.body;

    //1) Check if email and password is exist
    if (!email || !password) {
        return next(new AppError("Please provide a valid email and password", 400)); 
    };

    //2) Check if user exist && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError("Incorrect email or password!", 401));
    };
    
    //3) If everything is ok, send token to the client
    const token = signToken(user._id);

    res.status(200).json({
        status: "successful",
        token
    });
});

exports.protect = catchAsync ( async (req, res, next) => {
    //1) Get the token and check it it exist
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
     {token = req.headers.authorization.split(" ")[1];}

    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access", 401));
    }

    //2) Varification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3)Check if user still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError("The user belonging to this token does no longer exist.", 401));
    }


    //4) Check if user change password after the JWT was issued
    if(freshUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password! please log in again", 401));
    };

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
});