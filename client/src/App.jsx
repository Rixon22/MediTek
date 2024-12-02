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
import Patients from './views/doctor/patients/patients';
import PatientDiets from './views/patient/diets';
import PatientTreatments from './views/patient/treatments';
import PatientAppointments from './views/patient/appointments';
import DietDetails from './views/patient/dietDetail';
import AppointmentDetails from './views/patient/appointmentsDetails';
import TreatmentDetails from './views/patient/treatmentsDetails';

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
          <Route
            path='/patients'
            element={<Patients />}
          />
          <Route
            path='/patients/diets/actives'
            element={<PatientDiets />}
          />
          <Route
            path='/patients/treatments'
            element={<PatientTreatments />}
          />
          <Route
            path='/patients/appointments'
            element={<PatientAppointments />}
          />
          <Route
            path='/patients/diets/:id'
            element={<DietDetails />}
          />
          <Route
            path='/patients/appointments/detailed/:id'
            element={<AppointmentDetails />}
          />
          <Route
            path='/patients/treatments/detailed/:id'
            element={<TreatmentDetails />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
