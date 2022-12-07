import { Divider, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAllReservations, getProviders, getSlots } from "../libs/api";
import { DATE_FORMAT } from "../libs/config";
import ClientTimeSlots from "./ClientTimeSlots";
import MyDatePicker from "./MyDatePicker";
import TimeZone from "./TimeZone";

export default function Reservation({client}) {
  const [selectedDate, changeSelectedDate] = useState(moment().format(DATE_FORMAT));
  const [providers, setProviders] = useState(null);
  const [providerSlots, setProviderSlots] = useState(null);
  const [reservations, setReservations] = useState(null);

  const changeDate = (newDate) => {
    changeSelectedDate(newDate.format(DATE_FORMAT));
    setProviderSlots(null);
  };

  useEffect(() => {
    getProviders()
      .then(rsp =>{
        if (rsp.status == "success") {
          const keyedProviders = rsp.response.reduce((prev, curr) => {
            prev[`[${curr.id}]`] = curr;
            return prev;
          }, []);
          setProviders(keyedProviders);
        }
      });
  }, []);

  useEffect(() => {
    getSlots(selectedDate)
      .then(rsp =>{
        if (rsp.status === "success") {
          setProviderSlots(rsp.response);
        }
      });
    getAllReservations()
      .then(rsp =>{
        if (rsp.status === "success") {
          setReservations(rsp.response);
        }
      });
    
  }, [selectedDate]);

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">Reservation</Typography>
      </Stack>
      <Stack spacing={2}>
        <TimeZone />
        <MyDatePicker 
          value={selectedDate} 
          handleChange={changeDate} 
        />
      </Stack>
      <Divider sx={{margin: "10px 0"}} />
      <ClientTimeSlots 
        client={client} 
        selectedDate={selectedDate}
        providers={providers} 
        providerSlots={providerSlots}
        reservations={reservations}
        setReservations={setReservations}
      />
      <Divider sx={{margin: "10px 0"}} />
    </Stack>
  )
}