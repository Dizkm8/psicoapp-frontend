import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import agent from "../../app/api/agent";
import {toast, ToastContainer} from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    Grid, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import moment from "moment/moment";
import Appointment from "../../app/models/Appointment";
import {useTheme} from "@mui/material/styles";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import PropTypes from "prop-types";
import {purple} from "@mui/material/colors";
import Skeleton from "@mui/material/Skeleton";

function TablePaginationActions(props: any) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: any) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: any) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: any) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: any) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function SpecialistAppointmentManagementPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const {id} = useParams();
    const specialistId: string = id ? id : '';
    const [specialistName, setSpecialistName] = useState('');
    let limitDate = new Date(Date.now());
    limitDate.setHours(+24);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) : 0;

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setLoading(true);
        agent.Users.getSpecialist(specialistId)
            .then((response) => setSpecialistName(response.userFullName))
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
                .then((response: Appointment[]) => setAppointments(response))
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

    const handleCancelAppointment = (appointmentId: number) => {
        setSelectedAppointmentId(appointmentId);
        setConfirmationOpen(true);
    };

    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
    };

    const handleCancel = () => {
        setConfirmationOpen(false);
        if (selectedAppointmentId) {
            agent.Appointments.cancelAppointment(selectedAppointmentId)
                .then(() => {
                    // Este valor no debería estar quemado. Hay que buscar una mejor forma en el futuro.
                    const newAppointments = appointments.map((appointment) => {
                        return (appointment.id !== selectedAppointmentId) ? appointment :
                            {...appointment, appointmentStatusId: 3, appointmentStatusName: 'Canceled'};
                    });
                    setAppointments(newAppointments);
                    toast.success('La cita se ha cancelado con éxito.', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                        toastId: 'success.cancelAppointment',
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
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Código</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Cliente</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Hora</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Fecha</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((_, index) => (
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
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Skeleton animation="wave" height={20} width="40%" />
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
        <Grid container spacing={2} sx={{width: 'auto', m: 3}}>
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
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Código</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Cliente</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Hora</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Fecha</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                    ? appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : appointments
                            ).map((appointment) => {
                                const appointmentDate = new Date(appointment.bookedDate);
                                return (
                                    <TableRow key={appointment.id}>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{`#${appointment.id}`}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{appointment.requestingUserFullName}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{moment(appointmentDate).format('HH:mm')}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{new Date(appointmentDate).toLocaleDateString()}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#681b80',
                                                    color: 'white',
                                                }}
                                                disabled={!(appointment.appointmentStatusId === 2
                                                    && limitDate < appointmentDate)}
                                                onClick={() => handleCancelAppointment(appointment.id!)}
                                            >
                                                {appointment.appointmentStatusName}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 25, 100, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={appointments.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
                    <Box>
                        <DialogTitle>Cancelar cita</DialogTitle>
                        <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
                        <DialogContent sx={{ backgroundColor: 'white' }}>
                            <Typography variant="body1">¿Está seguro de que deseas cancelar esta cita?</Typography>
                        </DialogContent>
                        <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
                        <DialogActions sx={{ backgroundColor: 'white' }}>
                            <Button onClick={handleConfirmationClose} color="secondary" variant="outlined">
                                No
                            </Button>
                            <Button onClick={handleCancel } autoFocus color="primary" variant="outlined">
                                Sí
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>

                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </Grid>
        </Grid>
    );
}