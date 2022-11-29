import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
          >
            <Link to="/providers" style={{textDecoration: "none"}}>
              I am a Provider
            </Link>
          </Button>          
          <Button
            size='large'
            variant='contained'
            color='secondary'
          >
            <Link to="/clients" style={{textDecoration: "none"}}>
            I am a Client
            </Link>
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Home;
