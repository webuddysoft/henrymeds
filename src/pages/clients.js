import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import { getClients } from "../libs/api";
import MyBreadcrumbs from "../components/MyBreadcrumbs";
import Reservation from "../components/Reservation";
import SelectClient from "../components/SelectClient";

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

  const selectClientHandler = (cId) => {
    const c = clients.find(c => c.id === cId);
    setClient(c);
  }
  
  return (
    <Container maxWidth="sm">
      <Stack marginTop={2} gap={3}>
        <MyBreadcrumbs
          links={!client ? [{"title": "Clients"}] : 
            [
              {"title": "Clients", "onClick": () => setClient(null)},
              {"title": client.name}
            ]}
        />
        {!client ?
          <SelectClient clients={clients} selectClientHandler={selectClientHandler} /> :
          <Reservation client={client} />
        }
      </Stack>
    </Container>
  );
}