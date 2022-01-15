const express = require("express");
const router = express.Router();
const centreDB = require("../models/VaccinationCentre");

//* GET all vaccine centre (WORKING)
router.get("/all", (req, res) => {
  centreDB.find({}, (err, allCentre) => {
    if (err) res.status(500).json({});
    else res.status(200).json({ allCentre });
  });
});

//* POST create new centre (WORKING)
router.post("/new", (req, res) => {
  centreDB.create(req.body, (err, newCentre) => {
    if (err) res.status(500).json({});
    else res.status(200).json({ newCentre });
  });
});

//* PUT update centre
router.put("/update/:centreId", (req, res) => {
  const centreId = req.params.centreId;
  centreDB.findByIdAndUpdate(
    centreId,
    req.body,
    { new: true },
    (err, updatedCentre) => {
      if (err) res.status(500).json({ err: err });
      else res.status(200).json({ updatedCentre });
    }
  );
});

module.exports = router;
