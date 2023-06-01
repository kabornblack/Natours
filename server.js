const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    //to connect to local (process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(con => {
    //con is decleared but never used
    console.log("DB connection successfull!");
});

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    } 
});

const Tour = mongoose.model("Tour", tourSchema);


const port = process.env.port;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);

});
