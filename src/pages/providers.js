import { Box, Breadcrumbs, Button, Container, Divider, FormControl, Grid, InputLabel, Link, MenuItem, Select, Skeleton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Link as RouterLink } from "react-router-dom";
import Timer from "../components/Timer";
import { getProviders } from "../libs/api";
import MyDatePicker from "../components/MyDatePicker";
import TimeSlots from "../components/TimeSlots";
import moment from "moment";
import { DATE_FORMAT } from "../libs/config";



const SelectProvider = ({providers, selectProvider}) => {
  return (
    <Stack gap={1}>
      <Typography variant="h3">Login as</Typography>
      {providers === null && <Skeleton height={80} /> }
      {providers && (
        <FormControl>
          <InputLabel id="provider-dropdown-label">Select a provider</InputLabel>
          <Select 
            labelId="provider-dropdown-label"
            label="Select a Provider"
            onChange={(e) => {selectProvider(e.target.value)}}
            value={""}
          >
            <MenuItem value="">Select a Provider</MenuItem>
            {providers.map((c, i) => <MenuItem key={`item${i}`} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
      )}
    </Stack>
  )
}

const SelectTimeSlots = ({provider}) => {
  const [selectedDate, changeSelectedDate] = useState(moment().add(24, 'hours').format(DATE_FORMAT));

  const changeDate = (newDate) => {
    changeSelectedDate(newDate);
  };
  
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">TimeSlots</Typography>
      </Stack>
      <Stack spacing={2}>
        <Timer />
        <MyDatePicker 
          value={selectedDate} 
          handleChange={changeDate} 
        />
      </Stack>
      <Divider sx={{margin: "10px 0"}} />
      <TimeSlots date={selectedDate} />
    </Stack>
  )
}

export default function Providers() {
  const [providers, setProviders] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    getProviders()
      .then(rsp =>{
        if (rsp.status == "success") {
          setProviders(rsp.response);
        }
      });
  }, []);

  const selectProvider = (cId) => {
    const c = providers.find(c => c.id === cId);
    setProvider(c);
  }
  
  return (
    <Container maxWidth="sm">
      <Stack marginTop={2} gap={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/">
            Home
          </Link>
          {!provider ? 
            <Typography color="text.primary">Providers</Typography> : 
            <Link onClick={() => setProvider(null)} sx={{cursor: "pointer"}}>Providers</Link>}
          {provider && <Typography color="text.primary">{provider.name}</Typography>}
        </Breadcrumbs>        
        
        {!provider ?
          <SelectProvider providers={providers} selectProvider={selectProvider} /> :
          <SelectTimeSlots provider={provider} />
        }
        

      </Stack>
    </Container>
  );
}