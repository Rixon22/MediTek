import { useLocation } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import { useEffect, useState } from 'react';
import { retrieveSession } from '../../../helpers/retrieveSession';
import { postRequest } from '../../../helpers/requestHandler';
import User from '../../../models/user/user';

export default function Patients() {
  const location = useLocation();
  const userData = location.usr | {};
  const [user, setUser] = useState({});
  const [patients, setPatients] = useState([]);

  console.log(userData);
  const getUserInfo = () => {
    const session = retrieveSession();
    if (!session) return;
    const retrieved = new User(
      session.role,
      session.name,
      session.lastname,
      session.user
    );
    setUser(retrieved);
  };
  useEffect(()=>{
    getUserInfo();
    const retrievedPatients = postRequest();
  }, []);
  return (
    <>
      <Navbar />
      <div>Patients!</div>
    </>
  );
}
