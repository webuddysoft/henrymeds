import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import { getProviders } from "../libs/api";
import SelectProvider from "../components/SelectProvider";
import ProviderTimeSlots from "../components/ProviderTimeSlots";
import MyBreadcrumbs from "../components/MyBreadcrumbs";

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

  const selectProviderHandler = (cId) => {
    const c = providers.find(c => c.id === cId);
    setProvider(c);
  }
  
  return (
    <Container maxWidth="sm">
      <Stack marginTop={2} gap={3}>
        <MyBreadcrumbs
          links={!provider ? [{"title": "Providers"}] : 
            [
              {"title": "Providers", "onClick": () => setProvider(null)},
              {"title": provider.name}
            ]}
        />
        {provider === null ?
          <SelectProvider 
            providers={providers} 
            selectProviderHandler={selectProviderHandler} 
          /> :
          <ProviderTimeSlots provider={provider} />
        }
        
      </Stack>
    </Container>
  );
}