// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// CONFIG
const app = express();
const PORT = process.env.PORT || 3100;

//* MONGOOSE CONFIG
mongoose.connect(
  "mongodb+srv://xavier123:homage@samplecluster.tqnqx.mongodb.net/VaccineReservationDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//* SERVER LINKED => DATABASE
mongoose.connection.once("open", () => {
  console.log("Connected to mongo");
});

//* MIDDLEWARE
app.use(express.static(path.join(__dirname, "./frontend/build")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build", "index.html"));
});

// LISTEN
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
