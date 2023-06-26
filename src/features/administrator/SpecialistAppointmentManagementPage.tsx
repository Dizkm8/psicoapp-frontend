import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
    Button,
    Grid, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import moment from "moment/moment";
import Appointment from "../../app/models/Appointment";

export default function SpecialistAppointmentManagementPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const {id} = useParams();
    const specialistId: string = id ? id : '';
    const [specialistName, setSpecialistName] = useState('');
    let limitDate = new Date(Date.now());
    limitDate.setHours(+24);

    useEffect(() => {
        setLoading(true);
        agent.Users.getSpecialist(specialistId).then((response) => {
            if(!response.userIsEnabled){
                toast.error('El especialista no está disponible', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
                navigate('/home');
            }
            setSpecialistName(response.userFullName);
        })
            .catch((err) =>{
                toast.error('Ha ocurrido un problema cargando la información', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
                navigate('/home');
            }).then( () =>
            agent.Appointments.getSpecialistAppointments(specialistId)
                .then((response: Appointment[]) => {
                    let result = response.filter((appointment) =>{
                        const appointmentDate = new Date(appointment.bookedDate)
                        console.log(appointmentDate)
                        return appointment.appointmentStatusId === 2 && limitDate < appointmentDate})
                    setAppointments(result);
                })
                .catch((error) => {
                    toast.error('Ha ocurrido un problema cargando la información', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });
                })
        ).finally(() => {
                setLoading(false);
            });
    }, [specialistId]);

    const handleCancel = (appointmentId: number) => {
        agent.Appointments.cancelAppointment(appointmentId)
            .then(() => {
                setAppointments(appointments.filter((appointment) => appointment.id !== appointmentId));
                toast.success('La cita se ha cancelado con éxito.', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            })
            .catch(err => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        error = 'Las citas solo se pueden cancelar con máximo 24 horas de anterioridad.'
                        break;
                    case 500:
                        error = 'Ha ocurrido un problema interno. Intente nuevamente.'
                        break;
                    default:
                        break;
                }
                toast.error(error, {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            });
    };

    if (loading) return <LoadingComponent message='Cargando información...' />

    return (
        <Grid container spacing={2} mt={3}>
            <Grid item xs={12}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    {specialistName}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Código</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Hora</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Cancelar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow key={appointment.id} hover>
                                    <TableCell>{appointment.id}</TableCell>
                                    <TableCell>{appointment.requestedUserFullName}</TableCell>
                                    <TableCell>{moment(appointment.bookedDate).format('HH:mm')}</TableCell>
                                    <TableCell>{new Date(appointment.bookedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleCancel(appointment.id)}
                                            color="error"
                                        >
                                            <CancelIcon />
                                        </IconButton>
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