const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES


if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
};

app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 2) ROUTES

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//Route error handling
app.all("*", (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`));
});

//Global error handler
app.use(globalErrorHandler);

module.exports = app;
