import moment from "moment";
import { DATE_FORMAT, TIME_ADVANCE } from "./config";

export const isExpired = (date, hour, min) => {
  const currentTimeObj = moment();
  const currentTime = currentTimeObj.startOf('date').unix();
  const currentHour = moment().format('hh');
  const currentMinute = moment().format('mm');
  
  const selectedTimeObj = moment(date, DATE_FORMAT);
  const selectedHour = moment(date, DATE_FORMAT).format('hh');
  const selectedMinute = moment(date, DATE_FORMAT).format('mm');
  console.log(date, ":", currentTimeObj.startOf('date').format(DATE_FORMAT))
  if (selectedTimeObj.unix() - currentTimeObj.unix() > TIME_ADVANCE) {
    return true;
  } else if (selectedTimeObj.unix() - currentTimeObj.unix() == TIME_ADVANCE) {
    if (currentHour > hour || (currentHour == hour && currentMinute > min)) {
      return true;
    }
  }

  return false;
}