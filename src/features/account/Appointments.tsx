import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getGlobalUserId, setGlobalUserId } from './UserContext';
import agent from '../../app/api/agent';
import moment from 'moment';
import Skeleton from '@mui/material/Skeleton';
import Appointment from '../../app/models/Appointment';
import User from '../../app/models/User';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = getGlobalUserId();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      agent.Appointments.listByUser(userId)
        .then((response) => {
          setAppointments(response);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      const updatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const user = await agent.Users.getProfileInformation();
          return { ...appointment, requestedUser: user };
        })
      );
      setAppointments(updatedAppointments);
    };

    if (appointments.length > 0) {
      fetchUserData();
    }
  }, [appointments]);

  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            Appointments
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Especialista</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton animation="wave" height={20} width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" height={20} width="40%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </TableCell>
                    <TableCell>
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

  const getAppointmentStatusName = (appointment: Appointment) => {
    console.log(appointment.appointmentStatusId)
    switch(appointment.appointmentStatusId)
    {
      case 1:
        return 'Done';
      case 2:
        return 'Booked';
      case 3:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" gutterBottom>
          Appointments
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'purple', color: 'white' }}>Código</TableCell>
                <TableCell sx={{ backgroundColor: 'purple', color: 'white' }}>Especialista</TableCell>
                <TableCell sx={{ backgroundColor: 'purple', color: 'white' }}>Hora</TableCell>
                <TableCell sx={{ backgroundColor: 'purple', color: 'white' }}>Fecha</TableCell>
                <TableCell sx={{ backgroundColor: 'purple', color: 'white' }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.requestedUser?.name} {appointment.requestedUser?.firstLastName}</TableCell>
                  <TableCell>{moment(appointment.bookedDate).format('HH:mm')}</TableCell>
                  <TableCell>{new Date(appointment.bookedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getAppointmentStatusName(appointment)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
