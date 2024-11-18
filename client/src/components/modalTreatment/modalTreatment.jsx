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
  Chip,
} from '@mui/material';
import { postRequest, getRequest } from '../../helpers/requestHandler';
import PropTypes from 'prop-types';
import URLS from '../../constants/url';
function ModalTreatment({ idPatient, closeModal }) {
  const [open] = useState(true);
  const [meds, setMeds] = useState([]); // All medications from the backend
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [selectedMeds, setSelectedMeds] = useState([]);

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
      setSelectedMeds((prev) => [...prev, med]);
    }
  };

  // Remove a medication from the selected list
  const handleRemoveMed = (medId) => {
    setSelectedMeds((prev) => prev.filter((m) => m.id !== medId));
  };

  // Filter medications based on the search term
  const filteredMeds = meds.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle the assign button action
  const handleAssign = () => {
    // Example payload structure
    const payload = {
      patientId: idPatient,
      medications: selectedMeds.map((med) => med.id),
    };

    postRequest(URLS.dev + 'assignTreatment', payload)
      .then((response) => {
        console.log('Assigned successfully:', response);
        closeModal(false);
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
            width: 1200,
            height: 750,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
          <Typography
            id='modal-title'
            variant='h6'
            component='h2'>
            Asignar Tratamiento
          </Typography>

          {/* Search Field */}
          <TextField
            fullWidth
            margin='normal'
            label='Buscar medicamento'
            variant='outlined'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* List of Medications */}
          <List sx={{ maxHeight: 200, overflow: 'auto', mt: 1, mb: 2 }}>
            {filteredMeds.map((med) => (
              <ListItem
                key={med.id}
                button
                onClick={() => handleAddMed(med)}
                sx={{
                  bgcolor: selectedMeds.some((m) => m.id === med.id)
                    ? 'lightgray'
                    : 'white',
                }}>
                <ListItemText
                  primary={med.name}
                  secondary={med.descripcion}
                />
              </ListItem>
            ))}
          </List>

          {/* Selected Medications */}
          {selectedMeds.length > 0 && (
            <Box>
              <Typography
                variant='subtitle1'
                gutterBottom>
                Medicamentos seleccionados:
              </Typography>
              <Grid
                container
                spacing={1}>
                {selectedMeds.map((med) => (
                  <Grid
                    item
                    key={med.id}>
                    <Chip
                      label={med.name}
                      onDelete={() => handleRemoveMed(med.id)}
                      color='primary'
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

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
