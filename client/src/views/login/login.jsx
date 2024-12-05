import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Styles from './login.module.css';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../../helpers/requestHandler';
import URLS from '../../constants/url';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle login logic here
    const credentials = {
      email: username,
      password: password,
    };
    const response = await postRequest(URLS.dev + 'login', credentials);
    const { data } = response;
    if (data && data.id) {
      const token = 'Bearer ' + data.token;
      const userData = {
        token: token,
        user: data.id,
        role: data.role,
        name: data.name,
        lastname: data.lastname,
      };
      axios.defaults.headers.common.Authorization = token;
      sessionStorage.setItem('userData', JSON.stringify(userData));
      if (data.role === 'doctor') {
        handleRedirect('patients', { usr: userData });
      } else {
        handleRedirect('/patients/diets/actives/', { usr: userData });
      }
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const navigate = useNavigate();

  const handleRedirect = (url, params = null) => {
    if (params) {
      navigate(url, params);
    } else {
      navigate(url);
    }
  };

  return (
    <div className={Styles.loginContainer}>
      <Container
        component='main'
        maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography
            component='h1'
            variant='h5'>
            Inicia Sesión
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Email'
              name='username'
              autoComplete='username'
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showError ? <div>Correo o Contraseña Incorrectos</div> : null}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Iniciar Sesión
            </Button>
            <Grid container>
              <Grid
                item
                xs>
                <Link
                  href='#'
                  variant='body2'>
                  Olvidé mi contraseña
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href='#'
                  variant='body2'
                  onClick={() => handleRedirect('/register')}>
                  {'¿No tienes cuenta?'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
