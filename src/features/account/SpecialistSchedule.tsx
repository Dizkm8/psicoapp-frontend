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
  const userId = getGlobalUserId();
  
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await agent.Appointments.getSpecialistAppointments(userId || '');
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

  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto', marginTop: '50px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Código</TableCell>
                  <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Usuario</TableCell>
                  <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Hora</TableCell>
                  <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Skeleton animation="wave" height={20} width="80%" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Skeleton animation="wave" height={20} width="40%" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </Box>
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
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Código</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Usuario</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Hora</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => {
                const appointmentDate = new Date(appointment.bookedDate);
                return (
                  <TableRow key={appointment.id}>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                      <Typography variant="body1">{`#${appointment.id}`}</Typography>
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                      <Typography variant="body1">{`${appointment.requestingUserFullName}`}</Typography>
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                      <Typography variant="body1">{moment(appointmentDate).format('HH:mm')}</Typography>
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                      <Typography variant="body1">{new Date(appointmentDate).toLocaleDateString()}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
