import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import {
  useFetchAvailability,
  submitRegistration,
  registerAndBook,
  useFetchSlots
} from "../../hooks/requestHooks";
import moment from "moment";

const VaccineRegistration = ({ setBookingList, centreList }) => {
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingData, setBookingData] = useState("");
  const [availableSlots, setAvailableSlots] = useState();
  const history = useHistory();
  const today = new Date();
      
      useFetchSlots(
        {
          selectedDate,
          selectedCentre,
          setAvailableSlots,
          setErrorMessage,
        },);

  const handleSubmitBooking = async () => {
    const d = new Date(selectedDate);
    const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    const userPackage = {
      ...bookingData,
      dayMonthYear: date,
      slot: selectedSlot,
      centreName: selectedCentre.name,
      centre: selectedCentre._id,
    };

    registerAndBook({ userPackage, setErrorMessage, history });
  };
  
  console.log("today", today)
  console.log("available slots", availableSlots)

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
        >
          { errorMessage && <Alert severity="error"> { errorMessage } </Alert>  }
          <Typography component="h1" variant="h5">
            Book a slot
          </Typography>
          <TextField
            error={bookingData?.nric && !bookingData?.nric?.match(/^[STFG]\d{7}[A-Z]$/)}
            helperText="Please follow correct case-sensitive NRIC format. (e.g. G5976117Q)"
            margin="normal"
            required
            fullWidth
            id="nric"
            label="NRIC Number"
            name="NRIC"
            autoComplete="nric"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) =>
              setBookingData((data) => ({ ...data, nric: e.target.value }))
            }
          />
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            sx={{ mb: 2 }}
            onChange={(e) =>
              setBookingData((data) => ({ ...data, name: e.target.value }))
            }
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
          <Select
            labelId="vaccineCenterLabel"
            label="Vaccine Center"
            required
            fullWidth
            id="vaccineCenter"
            value={selectedCentre}
            onChange={(e) => {
              setSelectedCentre(e.target.value);
            }}
            sx={{ mb: 2 }}
          >
            {centreList &&
              centreList.map((centre) => {
                return (
                  <MenuItem key={centre._id} value={centre}>
                    {centre.name}
                  </MenuItem>
                );
              })}
          </Select>
          <DatePicker
            renderInput={(props) => <TextField {...props} />}
            label="Select Date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e);
            }}
            minDate={moment()}
            required
          />
          {availableSlots?.slots.length && (
            <>
              <InputLabel id="vaccineCenterLabel">Available Slot</InputLabel>
              <Select
                labelId="AvailableSlotLabel"
                label="Available Slot"
                required
                fullWidth
                id="availableSlot"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                sx={{ mb: 2 }}
              >
                {availableSlots?.slots.map((slot, key) => {
                  return (
                    <MenuItem key={key} value={slot}>
                      {`${key + 1}. ${slot?.time} - Slot Available`}
                    </MenuItem>
                )})}
              </Select>
            </>
          )}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmitBooking}
            disabled={
              !bookingData.nric ||
              !bookingData.name ||
              !selectedCentre ||
              !selectedDate ||
              !selectedSlot
            }
          >
            Register!
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default VaccineRegistration;
