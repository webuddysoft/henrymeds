import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import moment from 'moment';
import { useState } from "react";
import { addReservation, confirmReservation, cancelReservation } from "../libs/api";
import { DATE_FORMAT, SLOT_STATUS, TIME_ADVANCE_THIRTY_MINUTES } from "../libs/config";
import { compareId, findSlot, formatMinute, isExpired, isSlotExpired, sortByDate } from "../libs/utils";
import MyAlert from "./MyAlert";
import { ClientSlot, SlotProgressBar, SlotSkeleton } from "./Slot";


export default function ClientTimeSlots({client, selectedDate, providers, reservations, providerSlots, setReservations, ...props}) {
  const [processingSlots, setProcessingSlots] = useState([]);
  const [message, setMessage] = useState(null);
  
  if (providerSlots === null || providers === null || reservations === null) {
    return <SlotSkeleton />;
  }

  const clientReservations = reservations.filter(r => compareId(client.id, r.clientId));

  let availableSlots = sortByDate(providerSlots.filter(s => reservations.length == 0 || reservations.find(function(r) {
    const bS = reservations.find(r => compareId(s.id, r.slotId));
    return !bS || compareId(client.id, bS.clientId) || (!bS.confirmed && isSlotExpired(bS, TIME_ADVANCE_THIRTY_MINUTES));
  })));

  availableSlots = Object.values(availableSlots.reduce((prev, curr) => {
    const key = `${curr.date}:${curr.hour}:${curr.minute}`;
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push(curr);
    return prev;
  }, []));
  
  const doReservationHandler = (slot) => {
    if (processingSlots.includes(slot.hour * 4 + slot.minute)) {
      return false;
    }
    if (isSlotExpired(slot)) {
      setMessage({"type": "error", "message": "Reservation must be made at least 24 hours in advance."});
      return false;
    }
    setProcessingSlots(prev => prev.concat([slot.hour * 4 + slot.minute]));

    addReservation(client.id, slot.id, selectedDate, slot.hour, slot.minute)
      .then(rsp => {
        if (rsp.status === 'success') {
          setReservations(prev => prev === null ? [rsp.response] : prev.concat([rsp.response]));
          setMessage({"type": "success", "message": "The reservation has been booked successfully."})
        }
      })
      .finally(() => {
        setProcessingSlots(prev => prev.filter(item => item !== (slot.hour * 4 + slot.minute)));
      });
  }

  const confirmReservationHandler = (slot) => {
    if (processingSlots.includes(slot.hour * 4 + slot.minute)) {
      return false;
    }

    if (isSlotExpired(slot, TIME_ADVANCE_THIRTY_MINUTES)) {
      setMessage({"type": "error", "message": "The reservation has been expired. You must confirm the reservation in 30 minutes."});
      return false;
    }

    setProcessingSlots(prev => prev.concat([slot.hour * 4 + slot.minute]));

    confirmReservation(slot.id)
      .then(rsp => {
        if (rsp.status === 'success') {
          setReservations(prev => prev.map(r => r.id == slot.id ? rsp.response : r));
          setMessage({"type": "success", "message": "The reservation has been confirmed."})
        }
      })
      .finally(() => {
        setProcessingSlots(prev => prev.filter(item => item !== (slot.hour * 4 + slot.minute)));
      });
  }

  const cancelReservationHandler = (slot) => {
    if (processingSlots.includes(slot.hour * 4 + slot.minute)) {
      return false;
    }
    setProcessingSlots(prev => prev.concat([slot.hour * 4 + slot.minute]));
    cancelReservation(slot.id)
      .then(rsp => {
        if (rsp.status === 'success') {
          setReservations(prev => prev.filter(r => r.id == slot.id ? false : true));
          setMessage({"type": "success", "message": "The reservation has been cancelled."})
        }
      })
      .finally(() => {
        setProcessingSlots(prev => prev.filter(item => item !== (slot.hour * 4 + slot.minute)));
      });
  }

  return (
    <>
      <MyAlert open={message !== null} severity={!message ? "success" : message.type} handleClose={() => setMessage(null)}>{!message ? null : message.message}</MyAlert>
      <Grid container spacing={1} 
        sx={{
          userSelect: "none",
        }}
        {...props}
      > 
        {
          availableSlots.length == 0 ? <Grid item><Typography>There is no time slot available.</Typography></Grid> :
          availableSlots.map((items, i) => {
            const bookedSlot = findSlot(selectedDate, items[0].hour, items[0].minute, clientReservations);
            let status = SLOT_STATUS.AVAILABLE;
            if (bookedSlot) {
              if (bookedSlot.confirmed) {
                status = SLOT_STATUS.CONFIRMED;
              } else {
                status = !isSlotExpired(bookedSlot, TIME_ADVANCE_THIRTY_MINUTES) ? SLOT_STATUS.PENDING : SLOT_STATUS.BOOKING_EXPIRED;
              }
            } else if (isSlotExpired(items[0])) {
              status = SLOT_STATUS.EXPIRED;
            }
            return (
              <Grid item 
                xs={12} 
                key={`g${i}`}              
              >
                <ClientSlot status={status}>
                  {processingSlots.includes(items[0].hour * 4 + items[0].minute) && <SlotProgressBar />}
                  <Stack justifyContent="space-between" direction="row">
                    <Typography marginBottom={1}>{formatMinute(items[0].hour * 4 + items[0].minute)}</Typography>
                    {status == SLOT_STATUS.AVAILABLE && <Typography>{items.length} Provider(s) Available</Typography>}
                    {status == SLOT_STATUS.PENDING && <Typography>Booked - Pending</Typography>}
                    {status == SLOT_STATUS.CONFIRMED && <Typography>Booked - Confirmed</Typography>}
                    {status == SLOT_STATUS.BOOKING_EXPIRED && <Typography>Booked - Expired</Typography>}
                    {status == SLOT_STATUS.EXPIRED && <Typography>Expired</Typography>}
                  </Stack>
                  
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px"
                    }}
                  >
                    {
                      items.map((item, j) => {
                        if (status == SLOT_STATUS.AVAILABLE) {
                          return <Button 
                                    variant="outlined" 
                                    key={`g_d_${i}_${j}`}
                                    onClick={() => doReservationHandler(item)}
                                  >
                                    {providers[item.providerId].name}
                                  </Button> 
                          } else if (status == SLOT_STATUS.EXPIRED) {
                            return <Button 
                                    variant="outlined" 
                                    sx={{cursor: "default"}}
                                    key={`g_d_${i}_${j}`}
                                  >
                                    {providers[item.providerId].name}
                                  </Button> 
                          } else if (`[${item.id}]` == bookedSlot.slotId) {
                          if (status == SLOT_STATUS.CONFIRMED) {
                            return (
                              <Stack 
                                justifyContent="space-between" 
                                alignItems="center" 
                                key={`g_d_${i}_${j}`}
                                sx={{
                                  width: "100%",
                                  flexDirection: {
                                    "xs": "column",
                                    "sm": "row"
                                  }
                                }}
                              >
                                <Stack 
                                  sx={{
                                    alignItems: {
                                      "xs": "center",
                                      "sm": "flex-start"
                                    }
                                  }}
                                  key={`g_d${j}`}
                                >
                                  <Typography>{providers[item.providerId].name}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{gap: "5px"}}>
                                  <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="error"
                                    onClick={() => cancelReservationHandler(bookedSlot)}
                                  >Cancel</Button>
                                </Stack>
                              </Stack>
                            )
                          } else if (status == SLOT_STATUS.PENDING) {
                            return (
                              <Stack 
                                justifyContent="space-between" 
                                alignItems="center" 
                                key={`g_d_${i}_${j}`}
                                sx={{
                                  width: "100%",
                                  flexDirection: {
                                    "xs": "column",
                                    "sm": "row"
                                  }
                                }}
                              >
                                <Stack 
                                  sx={{
                                    alignItems: {
                                      "xs": "center",
                                      "sm": "flex-start"
                                    }
                                  }}
                                >
                                  <Typography>{providers[item.providerId].name}</Typography>
                                  <Typography variant="caption">Booked Time: {moment.unix(bookedSlot.createdDate).format(`${DATE_FORMAT} hh:mm`)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{gap: "5px"}}>
                                  <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="success"
                                    onClick={() => confirmReservationHandler(bookedSlot)}
                                  >Confirm</Button>
                                  <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="error"
                                    onClick={() => cancelReservationHandler(bookedSlot)}
                                  >Cancel</Button>
                                </Stack>
                              </Stack>
                            )
                          }
                        } else if (status == SLOT_STATUS.EXPIRED) {
                        } else {
                          return null;
                        }
                      })
                    }
                  </Box>
                </ClientSlot>
              </Grid>
            )
          })
        }        
      </Grid>
    </>
  )
}
