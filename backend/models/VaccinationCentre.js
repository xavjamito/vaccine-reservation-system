const { model, Schema } = require("mongoose");

const VaccinationCentreSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  maxCapacity: {
    type: Number,
    required: true
  }
});

module.exports = model("VaccinationCenter", VaccinationCentreSchema);
