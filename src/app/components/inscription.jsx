"use client";

import React, { useState } from 'react';
import { Modal, Backdrop, Fade, Box, Typography, TextField, Button, Grid, Alert } from '@mui/material';

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

const InscriptionModal = ({ open, handleClose, studentId, testId, onSave }) => {
  const [ticket, setTicket] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(''); // Estado para manejar el mensaje de error

  const handleSave = async () => {
        setError(''); // Resetea el mensaje de error antes de intentar guardar
        const inscription = {
            ticket,
            quantity: +quantity,
            studentId,
            testId
        };
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}inscription`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inscription),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al crear la Inscripción: ${response.status} ${response.statusText}`);
            }
    
            onSave(); // Cierra el modal
    
            // Recargar la página para reflejar los cambios
            window.location.reload();
    
        } catch (error) {
            setError(error.message); // Almacena el mensaje de error en el estado
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
            Crear Inscripción
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número de Recibo"
                value={ticket}
                onChange={(e) => setTicket(e.target.value.toUpperCase())}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Monto"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default InscriptionModal;
