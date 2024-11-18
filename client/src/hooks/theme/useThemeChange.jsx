import { createContext, useContext, useState } from 'react';
import lightTheme from '../../themes/lightTheme.js';
import darkTheme from '../../themes/darkTheme.js';

const ThemeContext = createContext();

export const ThemeProvider = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        theme: darkMode ? darkTheme : lightTheme,
        toggleTheme: handleThemeChange,
      }}>
  
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
