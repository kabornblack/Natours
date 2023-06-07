const fs = require("fs");
const Tour = require("./../models/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage";
    req.query.fields = "name,price,ratingsaverage,summary,difficulty,duration";
    next();
};

// exports.checkID = (req, res, next, val) => {
//     console.log(`The next value is ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: "fail",
//             message: "Cant find ID"
//         });
//     }
//     next();
// };

// Just leave here for ref

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Missing name or price"
//         });
//     };
//     next();
// };

exports.getAllTours = async (req, res) => {
    try {
        //BUILD QUERY
        //1) FILTERING
        const queryObj = { ...req.query };
        const deletedObjs = ["limit", "page", "sort", "fields"];
        deletedObjs.forEach(el => delete queryObj[el]);

        //2) ADVANCE FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // const query = Tour.find().where("duration").equals(5).where("difficulty").equals("easy");

        //3) SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        };

        //4) FIELD LIMITING
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        };

        //5) PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error("This page does not exist");
        }

        
        //EXECUTE QUERY
        const tours = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: "Success",
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};

 
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id: req.params.id})

        res.status(200).json({
            status: "Success",
            data: {
                tour
            }
        });

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({});
        // newTour.save();
    
        const newTour = await Tour.create(req.body);
    
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
             tour
            }
         });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};
   
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
   res.status(204).json({
      status: "success",
      data: null
   });
};
