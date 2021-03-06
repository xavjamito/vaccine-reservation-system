import { useEffect } from "react";

export const useFetchCentre = ({ setCentreList, setMessage }) => {
  useEffect(() => {
    const fetchAllCentres = async () => {
      const res = await fetch("/api/centre/all", {
        mode: "cors",
      });
      const { allCentre } = await res.json();
      if (res.ok) setCentreList(allCentre);
    };
    fetchAllCentres();
  }, []);
};

export const fetchCentreBooking = async (centre, setBookingList) => {
  const res = await fetch(`/api/reservation/centre/${centre._id}`, {
    mode: "cors",
  });
  const { reservationsFound } = await res.json();
  if (res.ok) setBookingList(reservationsFound);
};

export const useUserData = ({ reservationID, setUserInfo, setMessage }) => {
  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch(`/api/reservation/${reservationID}`, {
        mode: "cors",
      });
      const data = await res.json();
      if (res.ok) setUserInfo(data);
      else setMessage("Website Temporary Unavilable");
    };
    fetchUserInfo();
  }, []);
};

export const registerAndBook = async ({
  user,
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
    body: JSON.stringify(user),
  });
  if (res.ok) {
    // const { userBooking } = await res.json();
    history.push("/bookings");
  } else {
    const result = await res.json();
    setErrorMessage(result.error)
  }
};

export const handleEdit = async ({
  user,
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
    body: JSON.stringify(user),
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
            formattedDate: date,
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
