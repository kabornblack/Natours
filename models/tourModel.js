const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxlength: [40, "A tour should have less or equal to 40 characters"],
        minlength: [10, "A tour should have more than 10 characters"],
        // validate: [validator.isAlpha, "Tour name must only contain characters"] //validator laibrary
    },

    slug:  String,

    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have difficulty"],
        enum: {
            values: [true, "easy", "medium", "difficult"],
            message: "Difficulty is either: easy, medium or difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "A rating must be above 1.0"],
        max: [5, "A rating can not be above 5"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                //This only points to newly created doc // not when updating doc
                return val < this.price;
            },
            message: "Discount price ({VALUE}) cant be more than the regular price"
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        //Image file will be read and saved in a string that will be used here
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],
    //An array of strings
    createdAt: {
        type: Date,
        default: Date.now(),
        //SELECT NOT TO DISPLAY TO THE CLIENT
        select: false
    },
    startDates: [Date], //An array of dates
    secretTour: {
        type: Boolean,
        default: false
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true}
});

tourSchema.virtual("durationWeeks").get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: Runs before the .save() and .create()
tourSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true });
    next()
});

// tourSchema.pre("save", function(next) {
//     console.log("Will save this doc...");
//     next();
// });

// tourSchema.post("save", function(doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE:
//tourSchema.pre("find", function(next) { //This will work with only findMany
tourSchema.pre(/^find/, function(next) { //Works on all query that starts with find(findOne, fineMany, findAndDelete) etc
    this.find( { secretTour: {$ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    console.log(docs)
        next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;