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
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { retrieveSession } from '../../../helpers/retrieveSession';
import Navbar from '../../../components/navbar/Navbar';

const AppointmentDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la cita desde la URL
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null); // Para manejar la fecha de la cita
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const token = userData ? userData.token : null;

        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/api/appointments/details/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const { appointment_date } = response.data;

        // Convertir la fecha y hora a un formato adecuado para el picker
        setAppointmentDetails(response.data);
        setAppointmentDate(new Date(appointment_date));

        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles de la cita');
        console.error(err);
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
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
        ) : appointmentDetails ? (
          <>
            <Typography variant="h4" gutterBottom>
              Detalles de la Cita
            </Typography>

            <Paper sx={{ padding: 4, marginBottom: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Columna 1: Detalles de la cita */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Paciente:
                  </Typography>
                  <Typography variant="body1">
                    {appointmentDetails.patient_name} {appointmentDetails.patient_last_name}
                  </Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Doctor:
                  </Typography>
                  <Typography variant="body1">
                    {appointmentDetails.doctor_name} {appointmentDetails.doctor_last_name}
                  </Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Motivo de la cita:
                  </Typography>
                  <Typography variant="body1">{appointmentDetails.reason}</Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Clínica:
                  </Typography>
                  <Typography variant="body1">
                    {appointmentDetails.clinic_name}
                  </Typography>
                  <Typography variant="body1">
                    {appointmentDetails.clinic_address}
                  </Typography>

                  <Typography variant="h6" gutterBottom mt={2}>
                    Fecha y hora:
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        sx={{ margin: 1 }}
                        label="Fecha"
                      value={appointmentDate}
                      disabled
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <TimePicker
                      label="Hora"
                      sx={{ margin: 1 }}
                      value={appointmentDate}
                      disabled
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Columna 2: Mapa con iframe */}
                <Box sx={{ flex: 1 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Ubicación de la cita:
                      </Typography>
                      <iframe
                        src={appointmentDetails.location}
                        width="100%"
                        height="300px"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
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

export default AppointmentDetails;
