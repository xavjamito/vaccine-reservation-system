import { useEffect } from "react";

export const useFetchCentre = ({ setCentreList, setMessage }) => {
  useEffect(() => {
    const fetchAllCentres = async () => {
      const res = await fetch("/api/centre/all", {
        mode: "cors",
      });
      const { allCentre } = await res.json();
      console.log("all centres", allCentre)
      if (res.ok) setCentreList(allCentre);
    };
    fetchAllCentres();
  }, []);
};

export const fetchCentreBooking = async (centre, setBookingList) => {
  console.log("hit");
  const res = await fetch(`/api/reservation/centre/${centre._id}`, {
    mode: "cors",
  });
  const { reservationsFound } = await res.json();
  console.log("allCentreBooking", reservationsFound);
  if (res.ok) setBookingList(reservationsFound);
};

export const useUserData = ({ reservationID, setUserInfo, setMessage }) => {
  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch(`/api/reservation/${reservationID}`, {
        mode: "cors",
      });
      const data = await res.json();
      console.log('user data:', data);
      if (res.ok) setUserInfo(data);
      else setMessage("Website Temporary Unavilable");
    };
    fetchUserInfo();
  }, []);
};

export const useFetchAvailability = (
  { selectedDate, selectedCentre, setAvailability, setMessage },
  setBookingData
) => {
  useEffect(() => {
    const fetchAvailability = async () => {
      const centerId = selectedCentre._id;
      const d = new Date(selectedDate);
      const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;

      const res = await fetch(
        `/api/bookingTable/availability/${centerId}/${date}`,
        {
          mode: "cors",
        }
      );
      const { availability, tableId } = await res.json();
      if (res.ok) {
        setAvailability(availability);
        if (tableId)
          setBookingData((data) => ({
            ...data,
            bookingTable: tableId,
          }));
      } else setMessage("Sorry, This Date Is Fully Book");
    };
    if (selectedCentre && selectedDate) fetchAvailability();
  }, [selectedDate, selectedCentre]);
};

export const registerAndBook = async ({
  userPackage,
  setErrorMessage,
  history,
}) => {
  //* Submit Post Request
  const res = await fetch(`/api/reservation/new`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userPackage),
  });
  if (res.ok) {
    // const { userBooking } = await res.json();
    history.push("/bookings");
  } else {
    const result = await res.json();
    setErrorMessage(result.error)
  }
};

export const submitEditNew = async ({
  userPackage,
  setBookingList,
  setMessage,
  history,
}) => {
  //* Submit Post Request
  const res = await fetch(`/api/bookingTable/edit-booking/${userPackage._id}`, {
    mode: "cors",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userPackage),
  });
  if (res.ok) {
    const { userBooking } = await res.json();
    history.push("/bookings");
    setBookingList([userBooking]);
  } else setMessage("Oops, something went wrong. Try again later");
};

export const handleEdit = async ({
  userPackage,
  reservationID,
  setErrorMessage,
  history,
}) => {
  //* Submit Post Request
  const res = await fetch(`/api/reservation/edit/${reservationID}`, {
    mode: "cors",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userPackage),
  });
  if (res.ok) {
    history.push("/bookings");
  } else {
    const result = await res.json();
    setErrorMessage(result.error)
  }
};

export const handleDelete = async (
  reservationID,
  setBookingList,
  setMessage,
  index
) => {
  
  //* Submit Post Request
  const res = await fetch(`/api/reservation/delete/${reservationID}`, {
    mode: "cors",
    method: "DELETE",
  });
  if (res.ok) {
    const { deletedUser } = await res.json();
    console.log("index", index);
    setBookingList((bookingList) => {
      return bookingList?.filter((item, itemIndex) => itemIndex !== index)
    });
  } else setMessage("Oops, something went wrong. Try again later");
};

//get available slots for selected date
export const useFetchSlots = async (
  { selectedDate, selectedCentre, setAvailableSlots, setErrorMessage }
) => {
  useEffect(() => {
    const centreId = selectedCentre._id;
    const d = new Date(selectedDate);
    const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    const day = d.toLocaleString('en-us', {weekday: 'long'}).toLowerCase();

    const generateSlots = async () => {
      const res = await fetch(
        `/api/slot/new`,
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            centre: centreId,
            dayMonthYear: date,
            day: day,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        //only return slots which aren't booked yet
        if (result) setAvailableSlots(result)
      } else {
        const result = await res.json();
        setErrorMessage(result.error)
      }
    };

    if (selectedCentre && selectedDate) {
      generateSlots();
    }
  }, [selectedDate, selectedCentre, setAvailableSlots]);
};
