import './App.css';
import Ligth from './assets/icons8-sun.svg';
import Dark from './assets/icons8-dark-48.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './views/login/login';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';
import MedicRegister from './views/register/medic/medicRegister';
import { postRequest } from './helpers/requestHandler.js';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    postRequest('http://localhost:3001/api/login', {
      email: 'maria.fernandez@example.com',
      password: 'doctor123',
    });
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <div className='theme-toggle-container'>
        <div
          className='toggle-btn'
          onClick={handleThemeChange}>
          <img
            src={darkMode ? Dark : Ligth}
            className='toggle-icon'
          />
        </div>
      </div>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path='/'
            element={<Login />}
          />
          <Route
            path='/register'
            element={<MedicRegister />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
