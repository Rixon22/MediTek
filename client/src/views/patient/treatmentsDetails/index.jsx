import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { retrieveSession } from '../../../helpers/retrieveSession';
import Navbar from '../../../components/navbar/Navbar';

const TreatmentDetails = () => {
  const { id } = useParams(); // Obtenemos el ID del tratamiento desde la URL
  const [treatmentDetails, setTreatmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreatmentDetails = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const token = userData ? userData.token : null;

        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/api/treatments/details/view/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const { start_date, end_date } = response.data;

        setTreatmentDetails(response.data);
        setStartDate(new Date(start_date));
        setEndDate(new Date(end_date));

        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del tratamiento');
        console.error(err);
        setLoading(false);
      }
    };

    fetchTreatmentDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className="mt-4">
        {loading ? (
          <Typography variant="h6">Cargando detalles...</Typography>
        ) : error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : treatmentDetails ? (
          <>
            <Typography variant="h4" gutterBottom>
              Detalles del Tratamiento
            </Typography>

            <Paper sx={{ padding: 4, marginBottom: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Columna 1: Detalles del tratamiento */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Paciente:
                  </Typography>
                  <Typography variant="body1">
                    {treatmentDetails.patient_name} {treatmentDetails.patient_last_name}
                  </Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Doctor:
                  </Typography>
                  <Typography variant="body1">
                    {treatmentDetails.doctor_name}
                  </Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Descripción del tratamiento:
                  </Typography>
                  <Typography variant="body1">{treatmentDetails.description}</Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Fechas del tratamiento:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Fecha de inicio"
                        value={startDate}
                        disabled
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                      <DatePicker
                        label="Fecha de fin"
                        value={endDate}
                        disabled
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>

                {/* Columna 2: Medicamento */}
                <Box sx={{ flex: 1 }}>
                  <Card>
                    <CardContent>
                      {/* Avatar con la primera letra del nombre del medicamento */}
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                        {treatmentDetails.medication_name[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        Medicamento: {treatmentDetails.medication_name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Dosis: {treatmentDetails.medication_dose}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Frecuencia: {treatmentDetails.medication_frequency}
                      </Typography>

                      <Typography variant="h6" gutterBottom mt={2}>
                        Instrucciones:
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {treatmentDetails.medication_instructions || 'No se han especificado instrucciones.'}
                      </Typography>

                      {/* Opcional: Lista de ingredientes o detalles adicionales si aplica */}
                      {treatmentDetails.ingredients && (
                        <>
                          <Typography variant="h6" gutterBottom mt={2}>
                            Ingredientes:
                          </Typography>
                          <ul>
                            {treatmentDetails.ingredients.map((ingredient, index) => (
                              <li key={index}>
                                <Typography variant="body2">
                                  {ingredient.name} - {ingredient.quantity}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Button variant="contained" color="primary" onClick={handleBackClick}>
                  Volver
                </Button>
              </Box>
            </Paper>
          </>
        ) : null}
      </Container>
    </>
  );
};

export default TreatmentDetails;
