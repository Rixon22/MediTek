import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './views/login/login';
import { ThemeProvider, CssBaseline, Button } from '@mui/material';
import { useState } from 'react';
import lightTheme from './themes/lightTheme';
import darkTheme from './themes/darkTheme';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Button
          variant='contained'
          color='primary'
          onClick={handleThemeChange}>
          Toggle Theme
        </Button>
        <Routes>
          <Route
            path='/'
            element={<Login />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
