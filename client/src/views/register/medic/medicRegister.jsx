import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

export default function MedicRegister() {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    specialtyId: '',
    email: '',
    phone: '',
    password: '',
    clinicId: '',
    consultingRoom: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Values:', formValues);
    // Here you would send formValues to the API
  };

  return (
    <Container
      component='main'
      maxWidth='xs'>
      <form onSubmit={handleSubmit}>
        <TextField
          name='firstName'
          label='Nombre (s)'
          value={formValues.firstName}
          onChange={handleInputChange}
          fullWidth
          margin='normal'
          required
        />
        <TextField
          name='lastName'
          label='Apellidos'
          value={formValues.lastName}
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
            name='specialtyId'
            value={formValues.specialtyId}
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
          value={formValues.password}
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
            name='clinicId'
            value={formValues.clinicId}
            onChange={handleInputChange}>
            <MenuItem value={1}>Clínica San José</MenuItem>
            <MenuItem value={2}>Clínica Vida Saludable</MenuItem>
            <MenuItem value={3}>Clínica Médica Integral</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name='consultingRoom'
          label='Consultorio'
          value={formValues.consultingRoom}
          onChange={handleInputChange}
          fullWidth
          margin='normal'
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth>
          Enviar
        </Button>
      </form>
    </Container>
  );
}
