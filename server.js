const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(con => {
    //con is decleared but never used
    console.log("DB connection successfull!");
});

const port = process.env.port;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);

});
