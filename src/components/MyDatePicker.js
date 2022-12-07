import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TextField } from '@mui/material';
import { DATE_FORMAT } from '../libs/config';

export default function MyDatePicker({value, handleChange, ...props}) {
  
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <MobileDatePicker
          label="Select a Date"
          inputFormat={DATE_FORMAT}
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField size='small' {...params} />}
          {...props}
        />
    </LocalizationProvider>
  )
}