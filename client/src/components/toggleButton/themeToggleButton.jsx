import { useTheme } from '../../hooks/theme/useThemeChange.js';
import Ligth from '../../assets/icons8-sun.svg';
import Dark from '../../assets/icons8-dark-48.svg';

const ThemeToggleButton = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div
      className='theme-toggle-container'
      onClick={toggleTheme}>
      <img
        src={darkMode ? Dark : Ligth}
        alt='Toggle Theme'
        className='toggle-icon'
      />
    </div>
  );
};

export default ThemeToggleButton;
