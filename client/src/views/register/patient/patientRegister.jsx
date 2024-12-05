import { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';
import Swal from 'sweetalert2'; // Importamos SweetAlert2

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

  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form Values:', formValues);

    try {
      const response = await fetch('http://localhost:3001/api/patients/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formValues.firstName,
          last_name: formValues.lastName,
          birth_date: formValues.birthDate,
          email: formValues.email,
          phone: formValues.phone,
          password: formValues.password,
          curp: formValues.curp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar alerta de éxito
        Swal.fire({
          title: 'Paciente Creado',
          text: 'El paciente fue creado exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Redirigir a la página de login
          window.location.href = '/';
        });
      } else {
        // Mostrar alerta de error
        Swal.fire({
          title: 'Error',
          text: data.message || 'Hubo un error al crear al paciente.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      setError('Error en la comunicación con el servidor');
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al conectar con el servidor.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <h3 style={{ paddingTop: '1em' }}>Registro de Paciente</h3>
      <Container
        component="main"
        maxWidth="xs"
      >
        <form onSubmit={handleSubmit}>
          <TextField
            name="firstName"
            label="Nombre"
            value={formValues.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="lastName"
            label="Apellidos"
            value={formValues.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="birthDate"
            label="Fecha de Nacimiento"
            type="date"
            value={formValues.birthDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formValues.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="phone"
            label="Telefono"
            value={formValues.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={formValues.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="curp"
            label="CURP"
            value={formValues.curp}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Enviar
          </Button>
        </form>

        {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
      </Container>
    </>
  );
};

export default PatientForm;
