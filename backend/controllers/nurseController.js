const express = require("express");
const router = express.Router();
const nurseDB = require("../models/Nurse");

//* GET all nurses (WORKING)
router.get("/all", (req, res) => {
  nurseDB.find({}, (err, allNurses) => {
    if (err) res.status(400).json({});
    else res.status(200).json({ allNurses });
  });
});

//GET all nurses working in centre
router.get("/:centreId", (req, res) => {
  const centre = req.params.centreId;
  console.log('nurse centre id', centre);

  nurseDB.find({ vaccinationCentreID: centre }, async (err, nursesFound) => {
    if (err) res.status(500).json(err)
    else if (!nursesFound.length) {
      res.status(400).json({ error: "No nurses available for the vaccination centre" });
    }
    else if (nursesFound.length) {
      res.status(200).json({ nursesFound });
    }
  })
});

module.exports = router;
