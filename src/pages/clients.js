import { Box, Breadcrumbs, Container, Divider, FormControl, InputLabel, Link, MenuItem, Select, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getClients } from "../libs/api";

const SelectClient = ({clients, selectClient}) => {
  return (
    <Stack gap={1}>
      <Typography variant="h3">Login as</Typography>
      {clients === null && <Skeleton height={80} /> }
      {clients && (
        <FormControl>
          <InputLabel id="client-dropdown-label">Select a Client</InputLabel>
          <Select 
            labelId="client-dropdown-label"
            label="Select a Client"
            onChange={(e) => {selectClient(e.target.value)}}
            value={""}
          >
            <MenuItem value="">Select a Client</MenuItem>
            {clients.map((c, i) => <MenuItem key={`item${i}`} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
      )}
    </Stack>
  )
}

const SelectTimeSlots = ({client}) => {
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3">Reservations</Typography>
        
      </Stack>
      <Stack>
        
      </Stack>
    </Stack>
  )
}

export default function Clients() {
  const [clients, setClients] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    getClients()
      .then(rsp =>{
        if (rsp.status == "success") {
          setClients(rsp.response);
        }
      });
  }, []);

  const selectClient = (cId) => {
    const c = clients.find(c => c.id === cId);
    setClient(c);
  }
  
  return (
    <Container maxWidth="sm">
      <Stack marginTop={2} gap={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/">
            Home
          </Link>
          {!client ? 
            <Typography color="text.primary">Clients</Typography> : 
            <Link onClick={() => setClient(null)} sx={{cursor: "pointer"}}>Clients</Link>}
          {client && <Typography color="text.primary">{client.name}</Typography>}
        </Breadcrumbs>        
        
        {!client ?
          <SelectClient clients={clients} selectClient={selectClient} /> :
          <SelectTimeSlots client={client} />
        }
        

      </Stack>
    </Container>
  );
}