const fs = require("fs");
const Tour = require("./../models/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
    console.log(`The next value is ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Cant find ID"
        });
    }
    next();
};

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

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "Success",
        Time: req.requestTime,
        // result: tours.length,
        // data: {
        //     tours
        // }
    });
};

 
exports.getTour = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1;

    // const tour = tours.find(el => el.id === id);

    // res.status(200).json({
    //     status: "Success",
    //     data: {
    //         tour
    //     }
    // });
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
            message: "Invalid data entered"
        })
    }
};

exports.updateTour = (req, res) => {
   res.status(200).json({
      status: "success",
      data: {
       tour: "<Updated tour here...>"
      }
   });
}

exports.deleteTour = (req, res) => {
   res.status(204).json({
      status: "success",
      data: null
   });
};
