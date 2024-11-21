import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Avatar,
  Button,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import { retrieveSession } from '../../../helpers/retrieveSession';

function PatientAppointments() {
  const { patient_id } = useParams(); // Obtenemos el ID del paciente desde la URL
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const session = retrieveSession();
        const response = await axios.get(
          `http://localhost:3001/api/appointments/${session.user}`
        );
        console.log(response);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las citas médicas');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patient_id]); // Ejecuta el efecto cuando el patient_id cambia

  return (
    <>
      <Navbar />
      <Container maxWidth='lg'>
        <Box sx={{ mt: 4 }}>
          <Typography
            variant='h4'
            gutterBottom>
            Citas Médicas
          </Typography>

          {loading ? (
            <Typography>Cargando...</Typography> // Mientras se cargan las citas, mostramos este mensaje
          ) : error ? (
            <Typography color='error'>{error}</Typography> // Si ocurre un error, mostramos este mensaje de error
          ) : (
            <Grid
              container
              spacing={3}>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={appointment.id}>
                    <Card>
                      <CardContent>
                        <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                          {appointment.reason[0].toUpperCase()}{' '}
                          {/* Inicial del motivo de la cita */}
                        </Avatar>
                        <Typography variant='h6'>
                          {appointment.reason}
                        </Typography>
                        <Typography
                          variant='body1'
                          color='text.secondary'>
                          Doctor: {appointment.doctor_name}{' '}
                          {appointment.doctor_last_name}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'>
                          Fecha:{' '}
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleString()}
                        </Typography>

                        {/* Incrustar el mapa de Google */}
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant='body2'
                            color='text.secondary'>
                            Ubicación:
                          </Typography>
                          <iframe
                            src={appointment.location}
                            width='100%'
                            height='200'
                            style={{ border: 0 }}
                            allowFullScreen=''
                            loading='lazy'></iframe>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant='contained'
                            color='primary'>
                            Ver Detalles
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No tienes citas médicas programadas.</Typography>
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}

export default PatientAppointments;
