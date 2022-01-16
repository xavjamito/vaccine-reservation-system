const { model, Schema } = require("mongoose");

const ReservationSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "user",  
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  userNRIC: {
    type: String,
    required: true,
  },
  centreName: {
    type: String,
    required: true,
  },
  slotID: {
    type: Schema.Types.ObjectId,
    ref: "slot",  
    required: true,
  },
  dateTimeSlot: {
    type: String,
    required: true,
  },
  vaccinationCentreID: {
    type: Schema.Types.ObjectId,
    ref: "vaccinationCenter",  
    required: true,
  },
});

module.exports =  model("Reservation", ReservationSchema);
