import { Box,  Grid, LinearProgress, Skeleton, alpha } from "@mui/material";
import { blue, blueGrey, green, grey, lime } from "@mui/material/colors";
import { styled } from "@mui/system";
import { relativeTimeRounding } from "moment";
import { SLOT_STATUS } from "../libs/config";
import { formatMinute, isExpired } from "../libs/utils";


const SlotBase = styled(Box)({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: grey[700],
  borderRadius: "3px",
  textAlign: "center",
  padding: "5px",
});

export const SlotNew = SlotBase;

export const SlotAvailable = styled(SlotBase)({
  borderColor: green['700'],
  backgroundColor: green['900']
})

export const SlotPending = styled(SlotBase)({
  borderColor: alpha(blue['900'], 0.5),
  backgroundColor: alpha(blue['900'], 0.2)
})

export const SlotConfirmed = styled(SlotBase)({
  borderColor: alpha(green['900'], 0.5),
  backgroundColor: alpha(green['900'], 0.2)
})

export const SlotExpired = styled(SlotBase)({
  borderColor: alpha(blueGrey['800'], 0.5),
  backgroundColor: alpha(blueGrey['800'], 0.2)
})

export const SlotBooked = styled(SlotBase)({
  borderColor: lime['700'],
  backgroundColor: lime['900']
})

export const SlotProgressBar = styled(LinearProgress)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: "100%",
  backgroundColor: "transparent"
})

export function SlotSkeleton() {
  let slots = [];
  for (let i = 0; i < 4 * 10; i++) {
    slots.push(<Grid item xs={6} sm={3} key={`sk_${i}`}><Skeleton height={40} /></Grid>);
  }
  return <Grid container spacing={1}>{slots}</Grid>;
}

export function SlotCell({selectableRef, isSelected, isSelecting, date, h, m, status, expired, processing, clickSlotHandler, ...props}) {
  const minute = h * 4 + m;
  const isPast = isExpired(date, h, m * 15, 0);
  return (
    <Grid item 
      xs={6} 
      sm={3} 
      key={`slot${h}_${m}`}
      sx={{
        opacity: isPast ? 0.5 : expired ? 0.7 : 1,
        cursor: isPast ? 'not-allowed' : expired ? 'normal' : 'pointer',
      }}
      onClick={() => clickSlotHandler(date, h, m)}
      {...props}
      ref={selectableRef}
    >
      <Box position="relative" borderRadius="3px" overflow="hidden">
        {processing && <SlotProgressBar color="success" />}
        {status === SLOT_STATUS.NEW && <SlotNew>{formatMinute(minute)}</SlotNew>}
        {status === SLOT_STATUS.AVAILABLE && <SlotAvailable>{formatMinute(minute)}</SlotAvailable>}
        {status === SLOT_STATUS.BOOKED && <SlotBooked>{formatMinute(minute)}</SlotBooked>}
      </Box>
    </Grid>);
}

export function ClientSlot({status, children}) {
  if (status == SLOT_STATUS.AVAILABLE) {
    return <SlotNew sx={{position: "relative", overflow: "hidden"}}>{children}</SlotNew>
  }
  if (status == SLOT_STATUS.PENDING) {
    return <SlotPending sx={{position: "relative", overflow: "hidden"}}>{children}</SlotPending>
  }
  if (status == SLOT_STATUS.CONFIRMED) {
    return <SlotConfirmed sx={{position: "relative", overflow: "hidden"}}>{children}</SlotConfirmed>
  }
  if (status == SLOT_STATUS.EXPIRED) {
    return <SlotExpired sx={{position: "relative", overflow: "hidden"}}>{children}</SlotExpired>
  }
  if (status == SLOT_STATUS.BOOKING_EXPIRED) {
    return <SlotExpired sx={{position: "relative", overflow: "hidden"}}>{children}</SlotExpired>
  }
}