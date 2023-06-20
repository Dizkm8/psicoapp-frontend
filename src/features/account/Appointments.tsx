import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getGlobalUserId, setGlobalUserId } from './UserContext';
import agent from '../../app/api/agent';
import moment from 'moment';
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
    return <div>Loading...</div>;
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
