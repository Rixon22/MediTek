import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark', primary: {
            main: '#90caf9', // Primary color 

        }, secondary: {
            main: '#f48fb1', // Secondary color 
        },
        terciary: {
            main: "#848485"
        }
    }, components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#3823B2', // Custom button background color 
                    color: '#d2d2d2',
                    margin: '0px 4px',
                    '&:hover': {
                        backgroundColor: '#414141', // Custom hover color
                        color: '#ffffff'
                    },
                },
            },
        } 
    }
});

export default darkTheme;
