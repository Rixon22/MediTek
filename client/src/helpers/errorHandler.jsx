import { Snackbar, Alert } from '@mui/material';

export default function ShowError({ error, open, onClose }) {
  let errorMessage;
  if (error.response) {
    errorMessage = error.response.data.error || error.response.data.message;
  } else if (error.request) {
    errorMessage = 'No response received from the server.';
  } else {
    errorMessage = error.message;
  }
  console.log(error);
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert
        severity='error'
        onClose={onClose}
        variant='filled'>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}
