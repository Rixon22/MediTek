import { useLocation } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import { retrieveSession } from '../../../helpers/retrieveSession';
import { postRequest } from '../../../helpers/requestHandler';
import User from '../../../models/user/user';
import URLS from '../../../constants/url';
import styles from './patients.module.css';
import { Button } from '@mui/material';

export default function Patients() {
  const location = useLocation();
  const [patients, setPatients] = useState([]);

  const getUserInfo = () => {
    const session = retrieveSession();
    if (!session) return;
    const retrieved = new User(
      session.role,
      session.name,
      session.lastname,
      session.user
    );
    retrieved.token = session.token;
    return session;
  };
  const userData = getUserInfo();

  useEffect(() => {
    postRequest(URLS.dev + 'patients/doctor', { doctor_id: userData.user })
      .then((response) => {
        const { data } = response;
        console.log(data);
        setPatients(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.controlRibbon}>
        <Button
          sx={{
            backgroundColor: '#1e5555', // Dark green background color
            color: '#ffffff', // White text color
            '&:hover': {
              backgroundColor: '#004d00', // Darker green on hover
              color: '#ffffff', // Keep the text color white
            },
          }}>
          Añadir Nuevo
        </Button>
      </div>
    </>
  );
}
