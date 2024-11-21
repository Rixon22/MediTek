import Navbar from '../../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import { retrieveSession } from '../../../helpers/retrieveSession';
import { postRequest } from '../../../helpers/requestHandler';
import User from '../../../models/user/user';
import URLS from '../../../constants/url';
import styles from './patients.module.css';
import { Button, List, ListItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ModalPatient from '../../../components/modalPatient/modalPatient';
import ModalAssign from '../../../components/modalAssigner/modalAssigner';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showAssigner, setShowAssigner] = useState(false);
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
          }}
          onClick={() => setShowAssigner(true)}>
          Añadir Nuevo
        </Button>
      </div>
      <div className={styles.listContainer}>
        <List sx={{ width: '100%', mx: 'auto' }}>
          {patients?.map((patient, index) => {
            return (
              <ListItem
                key={index}
                disableGutters
                sx={{ padding: 0, cursor: 'pointer' }}
                onClick={() => {
                  setSelectedPatient(patient);
                  setShowModal(true);
                  console.log('show!');
                }}>
                <Card
                  variant='outlined'
                  sx={{
                    width: '100%',
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 4, // Elevate card on hover
                    },
                  }}>
                  <CardContent>
                    <Typography
                      variant='h6'
                      component='div'>
                      {patient.first_name}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'>
                      {patient.last_name}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'>
                      {patient.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            );
          })}
        </List>
      </div>
      {showModal && selectedPatient ? (
        <ModalPatient
          selectedPatient={selectedPatient}
          closeModal={setShowModal}
        />
      ) : null}
      {showAssigner ? (
        <ModalAssign closeModal={setShowAssigner}></ModalAssign>
      ) : null}
    </>
  );
}
