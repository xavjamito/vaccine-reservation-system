const { model, Schema } = require("mongoose");

const SlotSchema = new Schema({
  vaccinationCenterID: {
    type: Schema.Types.ObjectId,
    ref: "vaccinationCenter",  
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  booked: {
    type: Boolean,
    required: true,
  },
  nurseID: {
    type: Schema.Types.ObjectId,
    ref: "nurse",
  },
  reservationID: {
    type: Schema.Types.ObjectId,
    ref: "reservation",
  }
});

module.exports = model("Slot", SlotSchema);
