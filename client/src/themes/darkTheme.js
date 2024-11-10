import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark', primary: {
            main: '#90caf9', // Primary color 

        }, secondary: {
            main: '#f48fb1', // Secondary color 

        },
    }, components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e88e5', // Custom button background color 
                    color: '#d2d2d2',
                    '&:hover': {
                        backgroundColor: '#1565c0', // Custom hover color
                        color: '#ffffff'
                    },
                },
            },
        } 
    }
});

export default darkTheme;
