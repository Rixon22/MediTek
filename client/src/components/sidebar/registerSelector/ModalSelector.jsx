import { Modal, Box, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ModalSelector({ closeModal }) {
  return (
    <Modal
      open={true}
      onClose={closeModal}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'>
      <Box sx={style}>
        <h2 id='modal-title'>Tipo de Registro</h2>
        <p id='modal-description'></p>
        <Button
          variant='contained'
          color='secondary'
          onClick={closeModal}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}

export default ModalSelector;
