import { Box, Button, Grid } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import moment from 'moment';
import { DATE_FORMAT } from "../libs/config";
import { isExpired } from "../libs/utils";

export function Slot({minute, ...props}) {
  return (
    <Box
      sx={{
        cursor: "pointer",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: grey[700],
        borderRadius: "3px",
        textAlign: "center",
        padding: "5px",
      }}
    >
      {`${Math.floor(minute * 15 / 60).toString().padStart(2, 0)}:${(minute * 15 % 60).toString().padStart(2, 0)}
      -
      ${Math.floor((minute + 1) * 15 / 60).toString().padStart(2, 0)}:${((minute + 1) * 15 % 60).toString().padStart(2, 0)}`}
    </Box>
  )
}

export default function TimeSlots({date, ...props}) {
  
  const slots = [];
  const selectedTime = moment(date, DATE_FORMAT).unix();
  const selectedHour = moment(date, DATE_FORMAT).format('hh');
  const selectedMinute = moment(date, DATE_FORMAT).format('mm');
  
  const currentTime = moment().startOf('date').unix();
  const currentHour = moment().format('hh');
  const currentMinute = moment().format('mm');

  const diff = (selectedTime - currentTime) / 3600;

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 4; m++) {
      if (diff > 24 || (diff == 24 && h >= currentHour)) {
        slots.push(
          <Grid item 
            xs={6} 
            sm={3} 
            key={`slot${h}_${m}`}
            sx={{
              opacity: isExpired(date, h, m) ? 0.8 : 1
            }}
          >
            <Slot minute={h * 4 + m} />
          </Grid>
        );  
      }
    }
  }

  return <Grid container spacing={1}>
    {slots}
  </Grid>;
}