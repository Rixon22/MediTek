import './App.css';
import Ligth from './assets/icons8-sun.svg';
import Dark from './assets/icons8-dark-48.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './views/login/login';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';
import MedicRegister from './views/register/medic/medicRegister';
import PatientForm from './views/register/patient/patientRegister';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

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
          <Route
            path='/register/patient'
            element={<PatientForm />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
