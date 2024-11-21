import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { getRequest } from '../../helpers/requestHandler';
import URLS from '../../constants/url';

export default function ModalAssign({ closeModal }) {
  const [open] = useState(true);
  const [patients, setPatients] = useState([]);
  const handleClose = () => {
    closeModal(false);
  };

  useEffect(() => {
    getRequest(URLS.dev + 'patients')
      .then((response) => {
        const { data } = response;
        console.log(data);
        setPatients(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAssign = (patientId) => {
    console.log(`Asignar patient with ID: ${patientId}`);
    // Implement the assign logic here, such as calling an API or updating state
  };

  return (
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
          width: '65vw',
          maxWidth: '65vw',
          overflow: 'hidden',
          height: '95vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
        <Typography
          id='modal-title'
          variant='h6'
          component='h2'>
          Todos los Pacientes
        </Typography>
        <Box
          sx={{
            overflow: 'auto',
            width: '100%',
            height: '100%',
          }}>
          <Grid
            container
            spacing={2}
            sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
            {patients?.map((patient) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={100}
                key={patient.id}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>{`${patient.first_name} ${patient.last_name}`}</Typography>
                    <Typography color='textSecondary'>{`Email: ${patient.email}`}</Typography>
                    <Typography color='textSecondary'>{`Phone: ${patient.phone}`}</Typography>
                    <Typography color='textSecondary'>{`Birth Date: ${patient.birth_date}`}</Typography>
                    <Typography color='textSecondary'>{`CURP: ${patient.curp}`}</Typography>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button
                      size='small'
                      color='primary'
                      variant='contained'
                      onClick={() => handleAssign(patient.id)}>
                      Asignar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={handleClose}
            variant='contained'
            color='secondary'>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
