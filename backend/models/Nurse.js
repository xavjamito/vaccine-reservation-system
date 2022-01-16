const { model, Schema } = require("mongoose");

const NurseSchema = new Schema({
  name: { type: String, required: true },
  schedule: {
    type: Schema.Types.Date,
    required: true,
  },
  vaccinationCentreID: {
    type: Schema.Types.ObjectId,
    ref: "vaccinationCenter",  
    required: true,
  },
  shift: {
    sunday: {
      type: Boolean,
      required: true,
    },
    monday: {
      type: Boolean,
      required: true,
    },
    tuesday: {
      type: Boolean,
      required: true,
    },
    wednesday: {
      type: Boolean,
      required: true,
    },
    thursday: {
      type: Boolean,
      required: true,
    },
    friday: {
      type: Boolean,
      required: true,
    },
    saturday: {
      type: Boolean,
      required: true,
    },
  }
});

module.exports = model("Nurse", NurseSchema);
