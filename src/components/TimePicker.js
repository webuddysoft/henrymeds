import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { formatMinute } from "../libs/utils";

export default function TimePicker({changeTimeHandler, label, min, ...props}) {
  let times = [];
  for (let m = min; m < 24 * 4; m++) {
      times.push(<MenuItem key={`item${m}`} value={m}>
        {`${Math.floor(m * 15 / 60).toString().padStart(2, 0)}:${(m * 15 % 60).toString().padStart(2, 0)}`}
      </MenuItem>)
  }
  times.push(<MenuItem key={`item24_0`} value={24 * 4}>
        {`${Math.floor(24 * 4 * 15 / 60).toString().padStart(2, 0)}:${(24 * 4 * 15 % 60).toString().padStart(2, 0)}`}
      </MenuItem>)
  return (
    <FormControl size="small">
      <InputLabel id={`${label.replaceAll(" ", "_").toLowerCase()}-label`}>{label}</InputLabel>
      <Select 
        labelId={`${label.replaceAll(" ", "_").toLowerCase()}-label`}
        onChange={(e) => {changeTimeHandler(e.target.value)}}
        label={label}
        {...props}
      >
        {times}
      </Select>
    </FormControl>
  )
}