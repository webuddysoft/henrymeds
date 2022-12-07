import moment from "moment";
import { DATE_FORMAT, TIME_ADVANCE_ONE_DAY } from "./config";

export const isExpired = (date, hour, min, offset = TIME_ADVANCE_ONE_DAY) => {
  const currentTimeObj = moment().startOf('date');
  const currentHour = parseInt(moment().format('H'));
  const currentMinute = parseInt(moment().format('m'));
  const selectedTimeObj = moment(date, DATE_FORMAT);

  return (selectedTimeObj.unix() + (hour * 60 + min) * 60) - (currentTimeObj.unix() + (currentHour * 60 + currentMinute) * 60) > offset ? false : true;
}

export const isSlotExpired = (slot, offset = TIME_ADVANCE_ONE_DAY) => {
  return isExpired(moment.unix(slot.date).format(DATE_FORMAT), slot.hour, slot.minute * 15, offset);
}

export const getStartTimeOfDate = (date, offset = TIME_ADVANCE_ONE_DAY) => {
  const dateObj = moment(date, DATE_FORMAT);
  const currObj = moment();
  const currentHour = parseInt(moment().format('H'));
  const currentMinute = parseInt(moment().format('m'));
  
  if (dateObj.unix() - currObj.startOf('date').unix() > offset) {
    return 0;
  } else if ((dateObj.unix() - currObj.unix()) < offset) {
    return null;
  } else {
    return currentHour * 4 + Math.ceil(currentMinute / 15);
  }
}

export const findSlot = (date, hour, minute, slots) => {
  const dateUnix = moment(date, DATE_FORMAT).unix();
  return slots.find(s => s.date === dateUnix && s.hour === hour && s.minute === minute);
}

export const formatMinute = (minute) => {
  return `${Math.floor(minute * 15 / 60).toString().padStart(2, 0)}:${(minute * 15 % 60).toString().padStart(2, 0)} - 
  ${Math.floor((minute + 1) * 15 / 60).toString().padStart(2, 0)}:${((minute + 1) * 15 % 60).toString().padStart(2, 0)}`;
}

export const sortByDate = (arr) =>  arr.sort((a, b) => (a.date - b.date + (a.hour - b.hour) * 10 + (a.minute - b.minute)));

export const compareId = (id, sId) => `[${id}]` == sId;
