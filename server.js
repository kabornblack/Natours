const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});
const app = require("./app");



const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    //to connect to local (process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("DB connection successfull!")); //.catch(err => console.log("ERROR")); //To handle unhandled promise rejection

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION!. App shutting down...");
  server.close(() => {
    process.exit(1);
  })
});