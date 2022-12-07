import { Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container maxWidth="sm">
      <Stack 
        alignItems="center" 
        justifyContent="center" 
        height="100%"
        marginTop={10}
      >
        <Typography 
          variant='h2' 
          textAlign="center"
        >
          Henrymeds<br />
          Reservation System
        </Typography>
        <Stack
          direction="row"
          gap={5}
          justifyContent="center"
          marginY={5}
        >
          <Button
            size='large'
            variant='contained'
            color='success'
            LinkComponent={RouterLink}
            to="/providers"
          >
              I am a Provider
          </Button>          
          <Button
            size='large'
            variant='contained'
            color='secondary'
            LinkComponent={RouterLink}
            to="/clients"
          >
            I am a Client
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Home;
