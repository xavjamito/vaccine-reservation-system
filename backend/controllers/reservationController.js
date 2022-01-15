const express = require("express");
const router = express.Router();
const userDB = require("../models/User");
const reservationDB = require("../models/Reservation");
const slotDB = require("../models/Slot");

//* POST new reservation
router.post("/new", (req, res) => {
  //* Check user exist
  const { name, nric, centre, centreName, slot } = req.body;
  userDB.findOne({ nric }, (err, userFound) => {
    if (err) res.status(500).json(err);
    else if (userFound) {
      // If User with NRIC already exists
      res.status(400).json({ error: "User already exists" });
    } else {
      // If User does not exist in DB yet, proceed
      userDB.create({
        name: name,
        nric: nric,
      }, (err, userCreated) => {
        // User is now created along with reservation
        if (err) res.status(500).json(err);
        else {
          reservationDB.create({
            userID: userCreated._id,
            userNRIC: userCreated.nric,
            name: userCreated.name,
            centreName: centreName,
            slotID: slot._id,
            dateTimeSlot: `${slot.date} ${slot.time}`,
            vaccinationCentreID: centre,
          }, async (err, reservationCreated) => {
            if (err) res.status(500).json(err);
            else {
              //after reservation has been created, update slot's booked field to true
              const filter = { _id: reservationCreated?.slotID };
              const update = { booked: true };

              const updatedSlot = await slotDB.findOneAndUpdate(filter, update, {
                new: true
              })
              res.status(200).json({ reservationCreated });
            }
          })
        }
      });
    }
  });
});

//* GET all reservations in vaccination centre
router.get("/centre/:centreId", (req, res) => {
  const centreID = req.params.centreId;
  reservationDB.find({ vaccinationCentreID: centreID }, (err, reservationsFound) => {
    if (err) res.status(500).json({});
    else res.status(200).json({ reservationsFound });
  });
});

//Get reservation based on ID
router.get("/:reservationID", (req, res) => {
  const reservationID = req.params.reservationID;
  reservationDB.find({ _id: reservationID }, (err, reservationFound) => {
    if (err) res.status(500).json({});
    else res.status(200).json({ reservationFound });
  });
})

router.put("/edit/:reservationID", (req, res) => {
  const reservationID = req.params.reservationID;
  const { name, nric, centre, centreName, timeSlot } = req.body;
  const dateTime = `${timeSlot.date} ${timeSlot.time}`;

  reservationDB.findById(reservationID, async (err, prevReservation) => {
    if (err) res.status(500).json(err);
    else {
      //only update reservation if there is an actual change in the data
      if (
        prevReservation.name !== name ||
        prevReservation.userNRIC !== nric ||
        prevReservation.centre !== centre ||
        prevReservation.dateTime !== dateTime
        ) {
          const reservationFilter = { _id: reservationID };
          const reservationUpdate = {
            name,
            userNRIC: nric,
            centreName,
            vaccinationCentreID: centre,
            dateTimeSlot: dateTime,
          };
        
          reservationDB.updateOne(reservationFilter, reservationUpdate, {
            new: true
          }, async (err, updatedReservation) => {
            if (err) res.status(500).json(err);
            else {
              //update user and slot as well
              const userFilter = { nric: prevReservation.userNRIC };
              const userUpdate = {
                name,
                nric
              };
              
              await userDB.findOneAndUpdate(userFilter, userUpdate, {
                new: true
              })
                            
              //update new slot and set booked to true
              const newSlotUpdate = {
                booked: true
              };
              await slotDB.findByIdAndUpdate(timeSlot._id, newSlotUpdate, {
                new: true
              })
    
              //update old slot and set booked to false
              const oldSlotUpdate = {
                booked: false
              };
              await slotDB.findByIdAndUpdate(prevReservation.slotID, oldSlotUpdate, {
                new: true
              })
              res.status(200).json({ updatedReservation });
            }
          })

        } else {
          res.status(400).json({ error: "Data is unchanged." });
        }
    }
  })
});

//DELETE reservation 
router.delete("/delete/:reservationID", (req, res) => {
  const reservationID = req.params.reservationID;

  reservationDB.findByIdAndDelete(reservationID, async(err, deletedReservation) => {
    if (err) res.status(500).json(err);
    else {
      //delete user
      await userDB.findOneAndDelete({nric: deletedReservation.userNRIC})
      //set slot's booked field to false
      const slotUpdate = {
        booked: false
      };
      await slotDB.findByIdAndUpdate(deletedReservation.slotID, slotUpdate, {
        new: true
      });

      res.status(200).json({ message: "Reservation successfully deleted." });
    }
  })

})

module.exports = router;

