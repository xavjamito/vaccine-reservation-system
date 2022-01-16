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

mongoose.connection.once("open", () => {
  console.log("Connected to mongo");
});

//* MIDDLEWARE
app.use(express.static(path.join(__dirname, "./frontend/build")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const centre = require("./backend/controllers/centreController");
const reservation = require("./backend/controllers/reservationController");
const nurse = require("./backend/controllers/nurseController");
const slot = require("./backend/controllers/slotController");

//* ROUTES
app.use("/api/centre", centre);
app.use("/api/reservation", reservation);
app.use("/api/nurses", nurse);
app.use("/api/slot", slot);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build", "index.html"));
});

// LISTEN
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
