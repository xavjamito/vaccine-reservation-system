import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
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
  Alert
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import {
  useFetchCentre,
  useUserData,
  useFetchSlots,
  handleEdit,
} from "../../hooks/requestHooks";

const EditVaccinationBooking = ({ setBookingList }) => {
  const [centreList, setCentreList] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [nric, setNRIC] = useState("");
  const [availableSlots, setAvailableSlots] = useState();
  const history = useHistory();

  const { reservationID } = useParams();

  useFetchCentre({ setCentreList, setErrorMessage });
  useUserData({ reservationID, setUserInfo, setErrorMessage });

  useEffect(() => {
    const reservationInfo = userInfo?.reservationFound && userInfo.reservationFound[0];
    setName(reservationInfo?.name);
    setNRIC(reservationInfo?.userNRIC)
  }, [userInfo.reservationFound])

  useFetchSlots(
      {
        selectedDate,
        selectedCentre,
        setAvailableSlots,
        setErrorMessage,
      }
    );

  const handleEditBooking = async () => {
    const d = new Date(selectedDate);
    const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;

    const userPackage = {
      name: name,
      nric: nric,
      dayMonthYear: date,
      timeSlot: selectedSlot,
      centreName: selectedCentre.name,
      centre: selectedCentre._id,
    };
    console.log("userPackage", userPackage);

    handleEdit({ userPackage, reservationID, setBookingList, setErrorMessage, history });
  };

  return (
    <>
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
            Update your booking
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nric"
            label="NRIC"
            name="NRIC"
            autoComplete="nric"
            value={nric}
            onChange={(e) =>
              setNRIC(e.target.value)
            }
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            required
            fullWidth
            id="name"
            label="Name"
            value={name}
            sx={{ mb: 2 }}
            name="name"
            autoComplete="name"
            onChange={(e) =>
              setName(e.target.value)
            }
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Centre</InputLabel>
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
            onClick={handleEditBooking}
          >
            Update Booking!
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default EditVaccinationBooking;
