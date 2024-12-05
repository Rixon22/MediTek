import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { retrieveSession } from '../../../helpers/retrieveSession';
import Navbar from '../../../components/navbar/Navbar';

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
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
          `http://localhost:3001/api/patient/detail/${session.user}`,
          {
            headers: {
              Authorization: token, // Agregamos el token de autorización
            },
          }
        );

        setUserDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del usuario');
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleBackClick = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" className="mt-4">
        {loading ? (
          <Typography variant="h6">Cargando detalles...</Typography>
        ) : error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : userDetails ? (
          <Paper sx={{ padding: 4, marginBottom: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                {userDetails.first_name[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4">
                  {userDetails.first_name} {userDetails.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userDetails.email}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Fecha de nacimiento" secondary={userDetails.birth_date} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Teléfono" secondary={userDetails.phone} />
              </ListItem>
              <ListItem>
                <ListItemText primary="CURP" secondary={userDetails.curp} />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom mt={3}>
              Información Médica
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Condiciones" secondary={userDetails.conditions} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Alergias" secondary={userDetails.allergies} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tratamientos" secondary={userDetails.treatments} />
              </ListItem>
            </List>

            <Box sx={{ mt: 4 }}>
              <Button variant="contained" color="primary" onClick={handleBackClick}>
                Volver
              </Button>
            </Box>
          </Paper>
        ) : null}
      </Container>
    </>
  );
};

export default UserProfile;