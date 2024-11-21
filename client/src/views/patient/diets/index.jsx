import { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box, Container, Avatar, Button, Paper, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from '../../../components/navbar/Navbar';

function PatientDiets() {
  const { patient_id } = useParams();  // Obtenemos el ID del paciente desde la URL
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());  // Para manejar la fecha actual

  useEffect(() => {
    const fetchDietas = async () => {
      try {
        // Obtener el token desde sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const token = userData ? userData.token : null;

        // Verificamos si el token existe, si no, mostramos un mensaje de error
        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        // Realizamos la solicitud a la API pasando el token en los encabezados
        const response = await axios.get(`http://localhost:3001/api/diets/active/${patient_id}`, {
          headers: {
            Authorization: token,  // Token de autorización en el encabezado
          },
        });

        setDietas(response.data);
        setLoading(false);
      } catch (err) {
        // Si ocurre un error, mostramos un mensaje de error
        setError('Error al cargar las dietas');
        setLoading(false);
      }
    };

    fetchDietas();
  }, []);  // El efecto se ejecuta cada vez que cambia el ID del paciente

  return (
    <>
    <Navbar />    
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dietas Activas
        </Typography>

        {/* Calendario centrado */}
        <Paper sx={{ padding: 2, marginBottom: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha Actual"
                value={selectedDate}
                onChange={() => {}}  // No se puede cambiar la fecha
                disabled  // Deshabilitamos la capacidad de cambiar la fecha
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </Paper>

        {loading ? (
          <Typography>Cargando...</Typography>  // Mientras se cargan las dietas, mostramos este mensaje
        ) : error ? (
          <Typography color="error">{error}</Typography>  // Si ocurre un error, mostramos un mensaje de error
        ) : (
          <Grid container spacing={3}>
            {dietas.length > 0 ? (
              dietas.map((dieta) => (
                <Grid item xs={12} sm={6} md={4} key={dieta.id}>
                  <Card>
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                        {dieta.dish_name[0].toUpperCase()}  {/* Inicial del plato */}
                      </Avatar>
                      <Typography variant="h6">{dieta.dish_name}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {dieta.description}  {/* Descripción de la dieta */}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de inicio: {new Date(dieta.start_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de fin: {new Date(dieta.end_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hora: {dieta.time}  {/* Hora de la dieta */}
                      </Typography>
                      {dieta.is_active === 1 && (
                        <Box sx={{ mt: 2 }}>
                          <Button variant="contained" color="primary">
                            Seguir dieta
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No tienes dietas activas.</Typography>  // Si no hay dietas activas, mostramos este mensaje
            )}
          </Grid>
        )}
      </Box>
    </Container>
    </>

  );
}

export default PatientDiets;
