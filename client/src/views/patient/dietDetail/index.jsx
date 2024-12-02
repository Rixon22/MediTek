import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { retrieveSession } from '../../../helpers/retrieveSession';
import Navbar from '../../../components/navbar/Navbar';

const DietDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la dieta desde la URL
  const [dietDetails, setDietDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [dietTime, setDietTime] = useState(null); // Para manejar la hora de la dieta
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDietDetails = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const token = userData ? userData.token : null;
        const session = retrieveSession();

        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/api/diets/details/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const { diet_start_date, diet_end_date, diet_time } = response.data;

        // Convertir las fechas y hora a los formatos correctos para los pickers
        setDietDetails(response.data);
        setSelectedStartDate(new Date(diet_start_date));
        setSelectedEndDate(new Date(diet_end_date));

        // Convertimos la hora del formato "08:00:00" a un objeto Date con la fecha predeterminada
        const [hours, minutes] = diet_time.split(':');
        setDietTime(new Date(1970, 0, 1, hours, minutes)); // Usamos una fecha arbitraria con la hora correcta
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles de la dieta');
        console.error(err);
        setLoading(false);
      }
    };

    fetchDietDetails();
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
        ) : dietDetails ? (
          <>
            <Typography variant="h4" gutterBottom>
              Detalles de la Dieta
            </Typography>

            <Paper sx={{ padding: 4, marginBottom: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Columna 1: Detalles de la dieta */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Paciente:
                  </Typography>
                  <Typography variant="body1">
                    {dietDetails.patient_first_name} {dietDetails.patient_last_name}
                  </Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Doctor:
                  </Typography>
                  <Typography variant="body1">
                    {dietDetails.doctor_first_name} {dietDetails.doctor_last_name}
                  </Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Descripción de la dieta:
                  </Typography>
                  <Typography variant="body1">{dietDetails.diet_description}</Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Fechas:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Fecha de inicio"
                        value={selectedStartDate}
                        disabled
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                      <DatePicker
                        label="Fecha de fin"
                        value={selectedEndDate}
                        disabled
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Hora de la dieta:
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Hora"
                      value={dietTime}
                      disabled
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Columna 2: Detalles del platillo */}
                <Box sx={{ flex: 1 }}>
                  <Card>
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                        {dietDetails.dish_name[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="h6">{dietDetails.dish_name}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {dietDetails.dish_description}
                      </Typography>

                      <Typography variant="h6" gutterBottom mt={2}>
                        Ingredientes:
                      </Typography>
                      <ul>
                        <li>
                          <Typography variant="body2">
                            {dietDetails.ingredient_name} - {dietDetails.ingredient_quantity}
                          </Typography>
                        </li>
                      </ul>
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

export default DietDetails;
