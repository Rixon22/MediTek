import { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';

const PatientForm = () => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    password: '',
    curp: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Values:', formValues);
    // Here you would send formValues to the API
  };

  return (
    <>
      <h3>Registro de Paciente</h3>
      <Container
        component='main'
        maxWidth='xs'>
        <form onSubmit={handleSubmit}>
          <TextField
            name='firstName'
            label='Nombre'
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
          <TextField
            name='birthDate'
            label='Fecha de Nacimiento'
            type='date'
            value={formValues.birthDate}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
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
            label='Telefono'
            value={formValues.phone}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
          />
          <TextField
            name='password'
            label='Password'
            type='password'
            value={formValues.password}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='curp'
            label='CURP'
            value={formValues.curp}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
          />
          <Button
            type='Enviar'
            variant='contained'
            color='primary'
            fullWidth>
            Submit
          </Button>
        </form>
      </Container>
    </>
  );
};

export default PatientForm;
