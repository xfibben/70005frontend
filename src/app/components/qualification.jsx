import React, { useState } from 'react';
import { Modal, Backdrop, Fade, Box, Typography, TextField, Button, FormControl, Select, MenuItem, InputLabel, Alert } from '@mui/material';

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

const AddResultModal = ({ open, handleClose, students, handleStudentSearch, studentSearch, filteredStudents, newResult, handleNewResultChange, addResult }) => {
  const [error, setError] = useState('');

  const handleAddResult = async () => {
    setError('');
    try {
      await addResult();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Agregar Resultado
          </Typography>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
          )}
          <TextField
            type="text"
            placeholder="Buscar estudiante"
            value={studentSearch}
            onChange={handleStudentSearch}
            className="border p-2 w-full mb-4"
          />
          <FormControl variant="outlined" className="w-full">
            <InputLabel>Seleccione un estudiante</InputLabel>
            <Select
              name="studentId"
              value={newResult.studentId}
              onChange={handleNewResultChange}
              label="Seleccione un estudiante"
            >
              <MenuItem value="">
                <em>Seleccione un estudiante</em>
              </MenuItem>
              {filteredStudents.map(student => (
                <MenuItem key={student.id} value={student.id}>
                  {student.lastName} {student.secondName} {student.name} {student.dni}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="endingTime"
            label="Hora de finalización (HH:MM)"
            value={newResult.endingTime}
            onChange={handleNewResultChange}
            className="border p-2 w-full"
            variant="outlined"
          />
          <Button onClick={handleAddResult} variant="contained" color="primary" className="mt-4">
            Aceptar
          </Button>
          <Button onClick={handleClose} variant="contained" color="secondary" className="mt-4">
            Cancelar
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddResultModal;
