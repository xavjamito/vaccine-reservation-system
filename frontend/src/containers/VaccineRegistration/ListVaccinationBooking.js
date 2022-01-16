import { useState } from "react";
import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
  Select,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleDelete, fetchCentreBooking } from "../../hooks/requestHooks";

const ListVaccinationBooking = ({
  bookingList,
  setBookingList,
  centreList,
}) => {
  const [message, setMessage] = useState();
  const [selectedCentre, setSelectedCentre] = useState("  ");
  return (
    <>
      <CssBaseline />
      <Container>
        <Box sx={{ mt: 8 }}>
          {message && <h1>{message}</h1>}
          <Box sx={{ mt: 8, display: "flex", justifyContent: "space-between" }}>
            <Typography component="h1" variant="h5">
              Active Booking
            </Typography>
            <Select
              labelId="vaccineCenterLabel"
              label="Select Vaccine Centre"
              id="vaccineCenter"
              value={selectedCentre}
              onChange={(e) => {
                setSelectedCentre(e.target.value);
                fetchCentreBooking(e.target.value, setBookingList);
              }}
              sx={{ width: 1 / 4, mb: 2 }}
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
          </Box>
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Centre Name</TableCell>
                  <TableCell align="left">Date and Time</TableCell>
                  <TableCell align="left">&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingList &&
                  bookingList.map((bookingList, index) => (
                    <TableRow
                      key={bookingList?._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {bookingList?.name}
                      </TableCell>
                      <TableCell align="left">{bookingList?.centreName}</TableCell>
                      <TableCell align="left">
                        {bookingList?.dateTimeSlot}
                      </TableCell>
                      <TableCell align="left">
                        <Button component={Link} to={`/bookings/${bookingList?._id}`}>
                          <ModeEditIcon />
                        </Button>
                        <Button
                          onClick={() =>
                            handleDelete(
                              bookingList?._id,
                              setBookingList,
                              setMessage,
                              index
                            )
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default ListVaccinationBooking;
