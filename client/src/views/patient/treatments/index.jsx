import { useEffect, useState } from 'react';
import axios from 'axios';
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
import { useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from '../../../components/navbar/Navbar';
import { retrieveSession } from '../../../helpers/retrieveSession';

function PatientTreatments() {
  const { patient_id } = useParams(); // Obtenemos el ID del paciente desde la URL
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Para manejar la fecha actual

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        // Obtener el token desde sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const token = userData ? userData.token : null;
        const session = retrieveSession();
        // Verificamos si el token existe, si no, mostramos un mensaje de error
        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        // Realizamos la solicitud a la API pasando el token en los encabezados
        const response = await axios.get(
          `http://localhost:3001/api/treatments/details/${session.user}`,
          {
            headers: {
              Authorization: token, // Token de autorización en el encabezado
            },
          }
        );

        // Agrupamos los tratamientos por descripción
        const groupedTreatments = response.data.reduce((acc, treatment) => {
          const existingTreatment = acc.find(
            (item) =>
              item.treatment_description === treatment.treatment_description
          );

          if (existingTreatment) {
            existingTreatment.medications.push({
              medication_name: treatment.medication_name,
              medication_dose: treatment.medication_dose,
              medication_frequency: treatment.medication_frequency,
            });
          } else {
            acc.push({
              treatment_id: treatment.treatment_id,
              treatment_description: treatment.treatment_description,
              start_date: treatment.start_date,
              end_date: treatment.end_date,
              doctor_name: treatment.doctor_name,
              medications: [
                {
                  medication_name: treatment.medication_name,
                  medication_dose: treatment.medication_dose,
                  medication_frequency: treatment.medication_frequency,
                },
              ],
            });
          }

          return acc;
        }, []);

        setTreatments(groupedTreatments);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los tratamientos');
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [patient_id]); // El efecto se ejecuta cada vez que cambia el ID del paciente

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className="mt-4">
        <Typography variant="h4" gutterBottom>
          Tratamientos Activos
        </Typography>

        {/* Calendario centrado */}
        <Paper sx={{ padding: 2, marginBottom: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha Actual"
                value={selectedDate}
                onChange={() => {}} // No se puede cambiar la fecha
                disabled // Deshabilitamos la capacidad de cambiar la fecha
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </Paper>

        {loading ? (
          <Typography>Cargando...</Typography> // Mientras se cargan los tratamientos, mostramos este mensaje
        ) : error ? (
          <Typography color="error">{error}</Typography> // Si ocurre un error, mostramos este mensaje de error
        ) : (
          <div className="row">
            {treatments.length > 0 ? (
              treatments.map((treatment) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={treatment.treatment_id}>
                  <Card className="h-100">
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                        {treatment.treatment_description[0].toUpperCase()} {/* Inicial del tratamiento */}
                      </Avatar>
                      <Typography variant="h6">{treatment.treatment_description}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Tratado por: {treatment.doctor_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de inicio: {new Date(treatment.start_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de fin: {new Date(treatment.end_date).toLocaleDateString()}
                      </Typography>

                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Medicamentos:
                      </Typography>
                      <ul>
                        {treatment.medications.map((medication, index) => (
                          <li key={index}>
                            <Typography variant="body2">
                              {medication.medication_name} ({medication.medication_dose})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Frecuencia: {medication.medication_frequency}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                      <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" fullWidth>
                          Continuar tratamiento
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <Typography>No tienes tratamientos activos.</Typography> // Si no hay tratamientos activos, mostramos este mensaje
            )}
          </div>
        )}
      </Container>
    </>
  );
}

export default PatientTreatments;
