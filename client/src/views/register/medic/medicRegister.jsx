import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import { postRequest } from '../../../helpers/requestHandler';
import URLS from '../../../constants/url';

export default function MedicRegister() {
  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    specialty_id: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    clinic_id: '',
    consulting_room: '',
  });
  const [error, setError] = useState('');

  const handleError = (error) => {
    setError(error);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form Values:', formValues);
    if (formValues.password != formValues.passwordConfirm) {
      console.error('Contraseñas no coinciden');
      handleError('Contraseñas no coinciden');
      return;
    }

    const response = await postRequest(URLS.dev + 'doctors/add', formValues);
    const { data } = response;
    console.log(data);
    // Here you would send formValues to the API
  };

  return (
    <>
      <h3>Registro de Médico</h3>
      <Container
        component='main'
        maxWidth='xs'>
        <form onSubmit={handleSubmit}>
          <TextField
            name='first_name'
            label='Nombre (s)'
            value={formValues.first_name}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='last_name'
            label='Apellidos'
            value={formValues.last_name}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
          />
          <FormControl
            fullWidth
            margin='normal'
            required>
            <InputLabel>Especialidad</InputLabel>
            <Select
              name='specialty_id'
              value={formValues.specialty_id}
              onChange={handleInputChange}>
              <MenuItem value={1}>Cardiología</MenuItem>
              <MenuItem value={2}>Dermatología</MenuItem>
              <MenuItem value={3}>Pediatría</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name='email'
            label='Email'
            type='email'
            value={formValues.email}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='phone'
            label='Teléfono'
            value={formValues.phone}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
          />
          <TextField
            name='password'
            label='Contraseña'
            type='password'
            value={formValues.password}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='passwordConfirm'
            label='Repite Contraseña'
            type='password'
            value={formValues.passwordConfirm}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
          />
          <FormControl
            fullWidth
            margin='normal'
            required>
            <InputLabel>Clínica</InputLabel>
            <Select
              name='clinic_id'
              value={formValues.clinic_id}
              onChange={handleInputChange}>
              <MenuItem value={1}>Clínica San José</MenuItem>
              <MenuItem value={2}>Clínica Vida Saludable</MenuItem>
              <MenuItem value={3}>Clínica Médica Integral</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name='consulting_room'
            label='Consultorio'
            value={formValues.consulting_room}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
          />
          {error != '' ? <Box>{{ error }}</Box> : null}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth>
            Enviar
          </Button>
        </form>
      </Container>
    </>
  );
}
