import { useState } from 'react';
import { Modal, Box, Button, Typography, Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const DietDetails = ({ selectedDiet, closeModal }) => {
  const [open] = useState(true);
  const handleClose = () => {
    closeModal(false);
  };

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
            width: 'auto',

            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            zIndex: 1,
          }}>
          <Typography
            id='modal-title'
            variant='h6'
            component='h2'>
            Información del Paciente
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedDiet && (
              <Grid
                container
                spacing={2}>
                <Grid
                  item
                  xs={6}>
                  <TextField
                    label='Nombre'
                    value={selectedDiet}
                    InputProps={{ readOnly: true }}
                    variant='outlined'
                    fullWidth
                    sx={{ cursor: 'auto' }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}>
                  <TextField
                    label='Apellidos'
                    value={selectedDiet}
                    InputProps={{ readOnly: true }}
                    variant='outlined'
                    fullWidth
                    sx={{ cursor: 'auto' }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}>
                  <TextField
                    label='Fecha de Nacimiento'
                    value={selectedDiet}
                    InputProps={{ readOnly: true }}
                    variant='outlined'
                    fullWidth
                    sx={{ cursor: 'auto' }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}>
                  <TextField
                    label='CURP'
                    value={selectedDiet}
                    InputProps={{ readOnly: true }}
                    variant='outlined'
                    fullWidth
                    sx={{ cursor: 'auto' }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}>
                  <TextField
                    label='Email'
                    value={selectedDiet}
                    InputProps={{ readOnly: true }}
                    variant='outlined'
                    fullWidth
                    sx={{ cursor: 'auto' }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}>
                  <TextField
                    label='Telefono'
                    value={selectedDiet}
                    InputProps={{ readOnly: true }}
                    variant='outlined'
                    fullWidth
                    sx={{ cursor: 'auto' }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}>
            <Box sx={{ margin: '4px' }}>
            </Box>
            <Box sx={{ margin: '4px' }}>
              <Button
                onClick={handleClose}
                variant='contained'
                color='secondary'>
                Cerrar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

DietDetails.propTypes = {
  selectedDiet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    birth_date: PropTypes.string,
    curp: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired, // selectedDiet must be an object matching the shape and is required
  closeModal: PropTypes.func.isRequired,
};

export default DietDetails;
