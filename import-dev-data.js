const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./models/tourModel");

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    //to connect to local (process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    //con is decleared but never used
    console.log("DB connection successfull!");
});

// READ JSON FILE
const tours = JSON(fs.readFileSync(`${__dirname}/tours-simple.json`, "UTF-8"));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
    console.log("Data successfully loaded!.");
    } catch (err) {
        console.log(err);
    }
};
importData();

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Data successfully deleted!.")
    } catch (err) {
        console.log(err);
    }
};


