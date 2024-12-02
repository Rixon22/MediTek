import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Avatar,
  Button,
  Paper,
  TextField,
} from '@mui/material';
import Navbar from '../../../components/navbar/Navbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { retrieveSession } from '../../../helpers/retrieveSession';
import { useNavigate } from 'react-router-dom';

function PatientAppointments() {
  const { patient_id } = useParams(); // Obtenemos el ID del paciente desde la URL
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Para manejar la fecha actual
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const token = userData ? userData.token : null;
        const session = retrieveSession();

        // Verificamos si el token existe
        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        // Realizamos la solicitud a la API pasando el token en los encabezados
        const response = await axios.get(
          `http://localhost:3001/api/appointments/${session.user}`,
          {
            headers: {
              Authorization: token, // Agregamos el token de autorización
            },
          }
        );

        console.log(response);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las citas médicas');
        console.error(err);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patient_id]); // Ejecuta el efecto cuando el patient_id cambia

  const handleAppointmentClick = (id) => {
    navigate(`/patients/appointments/detailed/${id}`);
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Typography variant="h4" gutterBottom>
          Citas Médicas
        </Typography>

        {/* Calendario centrado */}
        <Paper sx={{ padding: 2, marginBottom: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha Actual"
                value={selectedDate}
                onChange={() => {}} // No permitimos cambiar la fecha
                disabled // Deshabilitamos el DatePicker para que sea solo visualización
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </Paper>

        {loading ? (
          <Typography>Cargando...</Typography> // Mientras se cargan las citas, mostramos este mensaje
        ) : error ? (
          <Typography color="error">{error}</Typography> // Si ocurre un error, mostramos este mensaje de error
        ) : (
          <div className="row">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={appointment.id}>
                  <Card className="h-100">
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                        {appointment.reason[0].toUpperCase()} {/* Inicial de la razón */}
                      </Avatar>
                      <Typography variant="h6">{appointment.reason}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Doctor: {appointment.doctor_name} {appointment.doctor_last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha:{" "}
                        {new Date(appointment.appointment_date).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ubicación:
                      </Typography>
                      {/* Agregamos el iframe para mostrar el mapa */}
                      <Box sx={{ mb: 2 }}>
                        <iframe
                          src={appointment.location}
                          title="Mapa de ubicación"
                          allowFullScreen
                          loading="lazy"
                          style={{ border: 0, width: '100%', height: '200px' }}
                        ></iframe>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" fullWidth onClick={() => handleAppointmentClick(appointment.id)}>
                          Ver Detalles
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <Typography>No tienes citas médicas programadas.</Typography> // Si no hay citas, mostramos este mensaje
            )}
          </div>
        )}
      </Container>
    </>
  );
}

export default PatientAppointments;
