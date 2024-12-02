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
import { useNavigate } from 'react-router-dom';

function PatientDiets() {
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Para manejar la fecha actual
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDietas = async () => {
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
          `http://localhost:3001/api/diets/active/${session.user}`,
          {
            headers: {
              Authorization: token, // Token de autorización en el encabezado
            },
          }
        );

        setDietas(response.data);
        setLoading(false);
      } catch (err) {
        // Si ocurre un error, mostramos un mensaje de error
        setError('Error al cargar las dietas');
        console.error(err);
        setLoading(false);
      }
    };

    fetchDietas();
  }, []); // El efecto se ejecuta cada vez que cambia el ID del paciente

  const handeDietClick = (dietId) => () => {
    // Redirigir a la página de detalle de dieta
    navigate(`/patients/diets/${dietId}`);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className="mt-4">
        <Typography variant="h4" gutterBottom>
          Dietas Activas
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
                onChange={() => {}} // No se puede cambiar la fecha
                disabled // Deshabilitamos la capacidad de cambiar la fecha
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </Paper>

        {loading ? (
          <Typography>Cargando...</Typography> // Mientras se cargan las dietas, mostramos este mensaje
        ) : error ? (
          <Typography color="error">{error}</Typography> // Si ocurre un error, mostramos este mensaje de error
        ) : (
          <div className="row">
            {dietas.length > 0 ? (
              dietas.map((dieta) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={dieta.id}>
                  <Card className="h-100">
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                        {dieta.dish_name[0].toUpperCase()} {/* Inicial del plato */}
                      </Avatar>
                      <Typography variant="h6">{dieta.dish_name}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {dieta.description} {/* Descripción de la dieta */}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de inicio: {new Date(dieta.start_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de fin: {new Date(dieta.end_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hora: {dieta.time} {/* Hora de la dieta */}
                      </Typography>
                      {dieta.is_active === 1 && (
                        <Box sx={{ mt: 2 }}>
                          <Button variant="contained" color="primary" fullWidth onClick={handeDietClick(dieta.id)}>
                            Seguir dieta
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <Typography>No tienes dietas activas.</Typography> // Si no hay dietas activas, mostramos este mensaje
            )}
          </div>
        )}
      </Container>
    </>
  );
}

export default PatientDiets;
