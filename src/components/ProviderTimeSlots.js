import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import MyDatePicker from "./MyDatePicker";
import TimeZone from "./TimeZone";
import { SlotCell, SlotSkeleton } from "./Slot";
import { DATE_FORMAT, SLOT_STATUS } from "../libs/config";
import { findSlot, getStartTimeOfDate, isExpired } from "../libs/utils";
import { addProviderSlot, cancelProviderSlot, getProviderSlots } from "../libs/api";
import TimePicker from "./TimePicker";
import MyAlert from "./MyAlert";

const TimeSlots = ({date, selectedSlots, processingSlots, clickSlotHandler, ...props}) => {
  const [currentMinute, setCurrentMinute] = useState(moment().format("m"));
  useEffect(() => {
    const handler = setInterval(() => {
      setCurrentMinute(moment().format("m"));
    }, 1000 * 60);

    return () => {
      clearInterval(handler);
    }
  }, []);

  let slots = [];

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 4; m++) {
      const expired = isExpired(date, h, m * 15); 
      
      let status = SLOT_STATUS.NEW;
      const selected = findSlot(date, h, m, selectedSlots);

      if (selected != undefined) {
        status = SLOT_STATUS.AVAILABLE;
      }
      
      slots.push(
        <SlotCell
          key={`slot${h}_${m}`}            
          expired={expired}
          status={status}
          processing={processingSlots.includes(h * 4 + m)}
          clickSlotHandler={clickSlotHandler}
          date={date}
          h={h}
          m={m}
        />
      );  
    }
  }

  return (
    <Grid container spacing={1} 
      sx={{
        userSelect: "none",
      }}
      {...props}
    > 
      {slots}
    </Grid>
  );
}

export default function ProviderTimeSlots({provider}){
  const [selectedDate, changeSelectedDate] = useState(moment().add(24, 'hours').format(DATE_FORMAT));

  const startTimeOfDate = useMemo(() => getStartTimeOfDate(selectedDate), [selectedDate]);
  
  const [message, setMessage] = useState(null);

  const [selectedSlots, setSelectedSlots] = useState(null);
  const [processingSlots, setProcessingSlots] = useState([]);
  const [startTime, setStartTime] = useState(startTimeOfDate);
  const [endTime, setEndTime] = useState(startTimeOfDate);

  useEffect(() => {
    getProviderSlots(provider.id)
      .then(rsp =>{
        if (rsp.status === "success") {
          setSelectedSlots(rsp.response);
        }
      });
  }, []);

  const changeDate = (newDate) => {
    changeSelectedDate(newDate.format(DATE_FORMAT));
    setStartTime(getStartTimeOfDate(newDate.format(DATE_FORMAT)));
    setEndTime(getStartTimeOfDate(newDate.format(DATE_FORMAT)));
  };

  const clickSlotHandler = (date, h, m) => {
    if (isExpired(date, h, m * 15)) {
      return false;
    }
    if (processingSlots.includes(h * 4 + m)) {
      return false;
    }
    
    const slot = findSlot(date, h, m, selectedSlots);

    setProcessingSlots(prev => prev.concat([h * 4 + m]));

    if (slot !== undefined) {
      cancelProviderSlot(slot.id)
        .then(rsp => {
          if (rsp.status === 'success') {
            setSelectedSlots(prev => prev.filter(item => item.id !== slot.id));
          } else {
            throw new Error("API Error");
          }
        })
        .catch((e) => {
          setMessage({"type": "error", "message": "There was an error while cancelling the time slot."})
        })
        .finally(() => {
          setProcessingSlots(prev => prev.filter(item => item !== (h * 4 + m)));
        });
    } else {
      addProviderSlot(provider.id, date, h, m)
        .then(rsp => {
          if (rsp.status === 'success') {
            setSelectedSlots(prev => prev === null ? [rsp.response] : prev.concat([rsp.response]));
          } else {
            throw new Error("API Error");
          }
        })
        .catch((e) => {
          setMessage({"type": "error", "message": "There was an error while adding the time slot."})
        })
        .finally(() => {
          setProcessingSlots(prev => prev.filter(item => item !== (h * 4 + m)));
        });
    }
  }

  const submitTimeSlots = () => {
    if (startTime !== null && endTime !== null) {
      for (let v = startTime; v < endTime; v++) {
        let h = Math.floor(v / 4);
        let m = v % 4;
        clickSlotHandler(selectedDate, h, m);
      }
    }
  }
  
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">TimeSlots</Typography>
      </Stack>
      <Stack spacing={2}>
        <TimeZone />
        <Grid container>
          <Grid item xs={12} sm={6} 
            sx={{
              marginBottom: {
                sm: "0",
                xs: "20px"
              }
            }}
          >
            <MyDatePicker 
              value={selectedDate} 
              handleChange={changeDate} 
            />
          </Grid>
          {startTimeOfDate !== null && (
            <Grid item xs={12} sm={6} alignItems="center" display="flex">
              <TimePicker
                label="Start Time"
                value={startTime ?? startTimeOfDate}
                min={startTimeOfDate}
                changeTimeHandler={m => [setStartTime(m), setEndTime(Math.max(m, endTime))]}
              />
              <TimePicker
                label="End Time"
                value={endTime ?? startTime ?? startTimeOfDate}
                min={startTime ?? startTimeOfDate}
                changeTimeHandler={m => setEndTime(m)}
                sx={{
                  marginLeft: "10px"
                }}
              />
              <Button
                variant="outlined"
                sx={{
                  marginLeft: "5px"
                }}
                onClick={submitTimeSlots}
              >
                Submit
              </Button>
            </Grid>
          )}
        </Grid>
      </Stack>
      <Divider sx={{margin: "10px 0"}} />
      {selectedSlots === null ? 
        <SlotSkeleton /> : 
        <TimeSlots 
          date={selectedDate}
          selectedSlots={selectedSlots}
          processingSlots={processingSlots}
          clickSlotHandler={clickSlotHandler} 
        />
      }
      <Divider sx={{margin: "10px 0"}} />
      <MyAlert 
        open={message !== null} 
        severity={!message ? "success" : message.type} 
        handleClose={() => setMessage(null)}>
          {!message ? null : message.message}
      </MyAlert>
    </Stack>
  )
}
