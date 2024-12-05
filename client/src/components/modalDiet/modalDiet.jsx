import { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import PropTypes from 'prop-types';
import styles from './ModalDiet.module.css';
import { postRequest } from '../../helpers/requestHandler';
import { retrieveSession } from '../../helpers/retrieveSession';
import ShowError from '../../helpers/errorHandler';
import SuccessHandler from '../../helpers/SuccessHandler/SuccessHandler';
import URLS from '../../constants/url';

function ModalDiet({ idPatient, closeModal }) {
  const [open] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [errorFields, setErrorFields] = useState({});
  const [time, setTime] = useState('');
  const [dishes] = useState([
    { id: 1, name: 'Sopa de Lentejas', description: 'Sopa con lentejas' },
    { id: 2, name: 'Ensalada', description: 'Ensalada Caesar' },
  ]);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleClose = () => closeModal(false);

  useEffect(() => {
    const userData = retrieveSession();
    postRequest(URLS.dev + '/patients/doctor', { doctor_id: userData.user })
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleAssign = () => {
    if (!selectedPatient) {
      setError({ message: 'Seleccione un paciente' });
      setShowError(true);
      return;
    }

    if (!description) {
      setError({ message: 'Ingrese una descripción para la dieta' });
      setShowError(true);
      return;
    }

    if (!time) {
      setError({ message: 'Seleccione la hora de la dieta' });
      setShowError(true);
      return;
    }

    const payload = {
      patient_id: selectedPatient.id,
      doctor_id: retrieveSession().user,
      description,
      time,
      dishes: dishes.map((dish) => ({
        dish_id: dish.id,
        name: dish.name,
      })),
    };

    postRequest(URLS.dev + '/assign-diet', payload)
      .then((response) => {
        const successManager = new SuccessHandler(
          'Dieta Asignada!',
          'La dieta se asignó correctamente.'
        );
        successManager.show();
        handleClose();
      })
      .catch((error) => {
        setError(error);
        setShowError(true);
        console.error('Error assigning diet:', error);
      });
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
            width: '90vw',
            height: '80vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            border: 'solid 1px #f1f1f11e',
            zIndex: 1,
          }}>
          <Typography
            id='modal-title'
            variant='h6'
            component='h2'
            gutterBottom>
            Asignar Dieta
          </Typography>
          <Grid
            container
            spacing={3}>
            {/* Patient List */}
            <Grid
              item
              xs={6}>
              <Box
                sx={{
                  maxHeight: '50vh',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}>
                {patients?.map((patient) => (
                  <Card
                    key={patient.id}
                    variant='outlined'
                    onClick={() => handleSelectPatient(patient)}
                    sx={{
                      border:
                        selectedPatient?.id === patient.id
                          ? '2px solid blue'
                          : '',
                      cursor: 'pointer',
                    }}>
                    <CardContent>
                      <Typography variant='h6'>
                        {patient.first_name} {patient.last_name}
                      </Typography>
                      <Typography>{patient.phone}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>

            {/* Dishes and Time Input */}
            <Grid
              item
              xs={6}>
              {selectedPatient && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}>
                  {dishes.map((dish) => (
                    <Card
                      key={dish.id}
                      variant='outlined'>
                      <CardContent>
                        <Typography variant='h6'>{dish.name}</Typography>
                        <Typography variant='body2'>
                          {dish.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                  <TextField
                    type='time'
                    label='Hora de la Dieta'
                    variant='outlined'
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}>
            <Grid
              item
              xs={12}
              md={8}>
              <TextField
                fullWidth
                margin='normal'
                label='Descripción'
                variant='outlined'
                value={description}
                error={!!errorFields.description} // Highlight if there's an error
                helperText={errorFields.description} // Display error message
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrorFields((prev) => ({ ...prev, description: '' })); // Clear error when editing
                }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={2}>
              <TextField
                fullWidth
                margin='normal'
                label='Fecha de Inicio'
                type='date'
                variant='outlined'
                value={startDate}
                error={!!errorFields.startDate} // Highlight if there's an error
                helperText={errorFields.startDate} // Display error message
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setErrorFields((prev) => ({ ...prev, startDate: '' })); // Clear error when editing
                }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={2}>
              <TextField
                fullWidth
                margin='normal'
                label='Fecha de Fin'
                type='date'
                variant='outlined'
                error={!!errorFields.endDate} // Highlight if there's an error
                helperText={errorFields.endDate} // Display error message
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setErrorFields((prev) => ({ ...prev, endDate: '' })); // Clear error when editing
                }}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              onClick={handleAssign}
              variant='contained'
              color='primary'
              sx={{ mr: 2 }}>
              Asignar
            </Button>
            <Button
              onClick={handleClose}
              variant='contained'
              color='secondary'>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>

      {showError && (
        <ShowError
          error={error}
          open={showError}
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}

ModalDiet.propTypes = {
  idPatient: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalDiet;
