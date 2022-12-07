import { FormControl, InputLabel, MenuItem, Select, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";

export default function SelectClient({clients, selectClientHandler}){
  return (
    <Stack gap={1}>
      <Typography variant="h3">Login as</Typography>
      {clients === null ? <Skeleton height={80} /> :  
        <FormControl>
          <InputLabel id="client-dropdown-label">Select a Client</InputLabel>
          <Select 
            labelId="client-dropdown-label"
            label="Select a Client"
            onChange={(e) => {selectClientHandler(e.target.value)}}
            value={""}
          >
            {clients.map((c, i) => <MenuItem key={`item${i}`} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
      }
    </Stack>
  )
}