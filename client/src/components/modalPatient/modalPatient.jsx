import { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const ModalPatient = ({ selectedPatient, closeModal }) => {
  const [open] = useState(true);

  const handleClose = () => {
    closeModal(false);
  };
  console.log(selectedPatient);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
          <Typography
            id='modal-title'
            variant='h6'
            component='h2'>
            Modal Title
          </Typography>
          <Typography
            id='modal-description'
            sx={{ mt: 2 }}>
            This is the content inside the modal. You can customize it as
            needed.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}>
            <Button
              onClick={handleClose}
              variant='contained'
              color='secondary'>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalPatient;
