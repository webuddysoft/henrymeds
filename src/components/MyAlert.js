import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

export default function MyAlert({open, severity, handleClose, children, ...props}) {
  const closeHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    handleClose();
  };
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={closeHandler} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
      <Alert onClose={closeHandler} severity={severity} sx={{ width: '100%' }} variant="filled">{children}</Alert>
    </Snackbar>
  )
}