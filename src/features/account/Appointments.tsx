import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams } from 'react-router-dom';
import { purple } from '@mui/material/colors';
import { getGlobalUserId, setGlobalUserId } from './UserContext';
import { Divider } from '@mui/material';
import agent from '../../app/api/agent';
import moment from 'moment';
import Skeleton from '@mui/material/Skeleton';
import Appointment from '../../app/models/Appointment';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const userId = getGlobalUserId();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await agent.Appointments.getAppointmentsByClient();
      setAppointments(response || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmationProceed = async () => {
    setConfirmationOpen(false);
    if (selectedAppointmentId) {
      try {
        await agent.Appointments.cancelAppointment(selectedAppointmentId);
        // Actualizar el estado de appointments después de cancelar la cita
        await fetchAppointments();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto', marginTop: '50px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Código</TableCell>
                  <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Especialista</TableCell>
                  <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Hora</TableCell>
                  <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Fecha</TableCell>
                  <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                      <Skeleton animation="wave" height={20} width="80%" />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                      <Skeleton animation="wave" height={20} width="40%" />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                      <Skeleton animation="wave" height={20} width="40%" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto', marginTop: '50px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Código</TableCell>
                <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Especialista</TableCell>
                <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Hora</TableCell>
                <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Fecha</TableCell>
                <TableCell sx={{ backgroundColor: purple[500], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center' }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                    <Typography variant="body1">{`#${appointment.id}`}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                    <Typography variant="body1">{`${appointment.requestedUserFullName}`}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                    <Typography variant="body1">{moment(appointment.bookedDate).format('HH:mm')}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                    <Typography variant="body1">{new Date(appointment.bookedDate).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#681b80',
                        color: 'white',
                      }}
                      onClick={() =>
                        appointment.appointmentStatusId === 2 && handleCancelAppointment(appointment.id!)
                      }
                      disabled={appointment.appointmentStatusId !== 2}
                    >
                      {appointment.appointmentStatusName}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
        <Box>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
          <DialogContent sx={{ backgroundColor: 'white' }}>
            <Typography variant="body1">Are you sure you want to cancel this appointment?</Typography>
          </DialogContent>
          <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
          <DialogActions sx={{ backgroundColor: 'white' }}>
            <Button onClick={handleConfirmationClose} color="secondary" variant="outlined">
              No
            </Button>
            <Button onClick={handleConfirmationProceed} autoFocus color="primary" variant="outlined">
              Yes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Grid>
  );
}
