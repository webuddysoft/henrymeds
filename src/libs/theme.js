import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    h1: {
      fontSize: 40
    },
    h2: {
      fontSize: 36
    },
    h3: {
      fontSize: 32
    },
    h4: {
      fontSize: 28
    },
    h5: {
      fontSize: 24
    },
    h6: {
      fontSize: 18
    },
    fontFamily: [
      "Roboto", "Arial", '"Helvetica Neue"', "sans-serif"
    ].join(","),
    fontSize: 14
  },
});
export default theme;