import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import routes from './routes';
import { retrieveSession } from '../../helpers/retrieveSession';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const session = retrieveSession();

    if (!session) {
      navigate('/');
    } else {
      session.role == 'doctor' ? setMode(0) : setMode(1);
      setUserId(session.user);
      setUsername(`${session.lastname}, ${session.name}`);
    }
  }, [navigate]);

  const goTo = (url) => {
    navigate(url);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position='static'
        sx={{ paddingRight: '52px' }}>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }} // Show on small screens
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}>
            Bienvenido! {mode == 0 ? 'Dr. ' : ''} {username}
          </Typography>
          {mode
            ? routes[1].map((route, index) => {
                return (
                  <Button
                    key={index}
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      backgroundColor: 'inherit',
                    }}
                    onClick={() => {
                      goTo(route.route);
                    }}>
                    {route.label}
                  </Button>
                );
              })
            : routes[0].map((route, index) => {
                return (
                  <Button
                    key={index}
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'block',
                        backgroundColor: 'inherit',
                      },
                    }}>
                    {route.label}
                  </Button>
                );
              })}
        </Toolbar>
      </AppBar>

      {/* <Drawer
        anchor='left'
        open={drawerOpen}
        onClose={toggleDrawer(false)}>
        <List>
          {['Home', 'About', 'Contact'].map((text) => (
            <ListItem
              button
              key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer> */}
    </>
  );
};

export default Navbar;
