const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  nric: { type: String, required: true },
});

module.exports = model("User", UserSchema);
