import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    }, components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1088e5', // Custom button background color 
                    color: '#d0d2d2',
                    ':hover': {
                        backgroundColor: '#3e28e5', // Custom hover color
                        color: '#ffffff'
                    },
                },
            },
        }
    }
});

export default lightTheme;
