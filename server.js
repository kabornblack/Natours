const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Best practice to place the Uncaught exception before any code is run
process.on("uncaughtException", err => {
  console.log("UUNCAUGHT EXCEPTION!. App shutting down...");
  console.log(err.name, err.message);
  process.exit(1); // Best practice for uncaught exception

  //EVEN IF THIS WILL WOTK BUT ITS NOT GOOD TO CALL A VARIABLE BEFORE IT WAS DECLEARED
  // server.close(() => {
  //   process.exit(1); // Best practice for uncaught exception
  // });
});

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
  console.log("UNHANDLED REJECTION!. App shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // Optional for unhandled rejection
  });
});

console.log(x);



