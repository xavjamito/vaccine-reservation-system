const express = require("express");
const router = express.Router();
const userDB = require("../models/User");
const slotDB = require("../models/Slot");
const vaccinationCentreDB = require("../models/VaccinationCentre");
const nurseDB = require("../models/Nurse");
const intervals = require("../util/dateTimeUtil")

//create new slots
router.post("/new", (req, res) => { 
  const { centre, dayMonthYear, day } = req.body;
  // check if a slot for that vaccine centre and date has already been created
  slotDB.find({ vaccinationCenterID: centre, date: dayMonthYear }, async (err, slotsFound) => {
    if (err) res.status(500).json(err)
    else if (!slotsFound.length) {
      //if no slots are found, generate slot

      //search for nurses working in the vaccination centre
      nurseDB.find({ vaccinationCentreID: centre }, async (err, nursesFound) => {
        if (err) res.status(500).json(err)
        else if (!nursesFound.length) {
          res.status(400).json({ error: "No nurses available for the vaccination centre" });
        }
        else if (nursesFound.length) {
          let slotsToBeCreated = [];
          //shift times
          const startTimeString = "9:00:00 AM";
          const endTimeString = "5:00:00 PM";
          const slotInterval = 30;
          
          const timeSlots = intervals(startTimeString, endTimeString, slotInterval);

          //get nurses who are working that day
          const nursesInShift = nursesFound.filter(nurse => {
            return nurse.shift[day] === true
          })

          //fill up slots 
          for (let i = 0; i < (timeSlots.length * nursesInShift.length); i++) {
            slotsToBeCreated.push({
              vaccinationCenterID: centre,
              date: dayMonthYear,
              time: timeSlots[i],
              booked: false
            })
          }
          
          const newSlots = await slotDB.insertMany(slotsToBeCreated)
          res.status(200).json({ slots: newSlots });
        }
      })
    }
    else if (slotsFound.length) {
    //if there are slots found for that date, do not generate, return existing slots
    // return only unbooked slots
    const unbookedSlots = slotsFound?.filter(slot => {
      return slot.booked === false
    })
    if (unbookedSlots.length > 0) res.status(200).json({ slots: unbookedSlots });
    else res.status(400).json({ message: "All slots for this date are fully booked." })
    }
  })
})

//get all available slots
router.get("/available/all", (req, res) => {
  slotDB.find({ booked: false }, async (err, availableSlots) => {
    if (err) res.status(500).json(err)
    else if (!availableSlots.length) {
      res.status(400).json("No available slots");
    }
    else if (availableSlots.length) {
    //if there are slots found for that date
      res.status(200).json({ availableSlots });
    }
  })
})
module.exports = router;