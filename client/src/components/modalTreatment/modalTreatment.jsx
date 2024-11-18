import { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import { postRequest, getRequest } from '../../helpers/requestHandler';
import PropTypes from 'prop-types';
import URLS from '../../constants/url';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './modalTreatment.module.css';
import { retrieveSession } from '../../helpers/retrieveSession';

function ModalTreatment({ idPatient, closeModal }) {
  const [open] = useState(true);
  const [meds, setMeds] = useState([]); // All medications from the backend
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleClose = () => {
    closeModal(false);
  };

  useEffect(() => {
    getRequest(URLS.dev + 'medications')
      .then((response) => {
        const { data } = response;
        console.log('meds', data);
        setMeds([
          {
            id: 1,
            name: 'Paracetamol',
            descripcion: 'Caja con 12 tabletas 500mg',
          },
          {
            id: 2,
            name: 'Ibuprofeno',
            descripcion: 'Caja con 12 tabletas 250mg',
          },
          {
            id: 3,
            name: 'Nafazolina',
            descripcion: 'Gotero con 20ml',
          },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Add a medication to the selected list
  const handleAddMed = (med) => {
    if (!selectedMeds.some((m) => m.id === med.id)) {
      setSelectedMeds((prev) => [
        ...prev,
        { ...med, dose: '', frequency: '' }, // Add dose and frequency fields
      ]);
    }
    console.log(selectedMeds);
  };

  // Remove a medication from the selected list
  const handleRemoveMed = (medId) => {
    setSelectedMeds((prev) => prev.filter((m) => m.id !== medId));
  };

  // Update dose or frequency for a selected medication
  const handleInputChange = (medId, field, value) => {
    setSelectedMeds((prev) =>
      prev.map((med) => (med.id === medId ? { ...med, [field]: value } : med))
    );
  };

  // Filter medications based on the search term
  const filteredMeds = meds.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle the assign button action
  const handleAssign = () => {
    const session = retrieveSession();
    const payload = {
      treatment: {
        patient_id: idPatient,
        doctor_id: session.user,
        description: description,
        start_date: startDate,
        end_date: endDate,
      },
      medications: selectedMeds.map(({ id, dose, frequency }) => ({
        medication_id: id,
        dose: dose,
        frequency: frequency,
      })),
    };

    postRequest(
      URLS.dev + 'treatment-medications/add-treatment-with-medications',
      payload
    )
      .then((response) => {
        console.log('Assigned successfully:', response);
        const { data } = response;
        console.log('server sent:', data);
      })
      .catch((error) => {
        console.error('Error assigning treatment:', error);
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
          }}>
          <Typography
            id='modal-title'
            variant='h6'
            component='h2'
            gutterBottom>
            Asignar Tratamiento
          </Typography>
          <div className={styles.notContainer}>
            <Grid
              container
              spacing={3}>
              {/* Left Column: Search and List */}
              <Grid
                item
                xs={6}>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Buscar medicamento'
                  variant='outlined'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <List
                  sx={{
                    maxHeight: '50vh',
                    overflow: 'auto',
                    border: '1px solid lightgray',
                    borderRadius: 1,
                    mt: 2,
                  }}>
                  {filteredMeds.map((med) => (
                    <ListItem
                      key={med.id}
                      button
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleAddMed(med)}>
                      <ListItemText
                        primary={med.name}
                        secondary={med.descripcion}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Right Column: Selected Medications */}
              <Grid
                item
                xs={6}>
                <Typography
                  variant='subtitle1'
                  gutterBottom>
                  Medicamentos seleccionados:
                </Typography>
                <Box
                  sx={{
                    maxHeight: '50vh',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}>
                  {selectedMeds.map((med) => (
                    <Card
                      key={med.id}
                      variant='outlined'>
                      <CardContent>
                        <Typography variant='h6'>{med.name}</Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          gutterBottom>
                          {med.descripcion}
                        </Typography>
                        <Grid
                          container
                          spacing={1}>
                          <Grid
                            item
                            xs={6}>
                            <TextField
                              fullWidth
                              label='Dosis'
                              variant='outlined'
                              sx={{ margin: 0, height: '25px' }}
                              value={med.dose}
                              onChange={(e) =>
                                handleInputChange(
                                  med.id,
                                  'dose',
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={6}>
                            <TextField
                              fullWidth
                              label='Frecuencia'
                              variant='outlined'
                              sx={{ margin: 0, height: '25px' }}
                              value={med.frequency}
                              onChange={(e) =>
                                handleInputChange(
                                  med.id,
                                  'frequency',
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <IconButton
                          color='error'
                          onClick={() => handleRemoveMed(med.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </div>
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
                onChange={(e) => setDescription(e.target.value)}
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
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setStartDate(e.target.value)}
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
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
          </Grid>
          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 3,
            }}>
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
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

ModalTreatment.propTypes = {
  idPatient: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalTreatment;
