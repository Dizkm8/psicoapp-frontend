import * as React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { purple } from '@mui/material/colors';
import { getGlobalUserId, setGlobalUserId } from './UserContext';
import { Divider } from '@mui/material';
import agent from '../../app/api/agent';
import moment from 'moment';
import Skeleton from '@mui/material/Skeleton';
import Appointment from '../../app/models/Appointment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import SpecialistInfo from "../../app/models/SpecialistInfo";
import SearchIcon from "@mui/icons-material/Search";

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

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSpecialists, setFilteredSpecialists] = useState<Appointment[]>([]);
  const userId = getGlobalUserId();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredSpecialists.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let limitDate = new Date(Date.now());
  limitDate.setHours(+24);

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

  useEffect(() => {
    const filteredSpecialists = appointments.filter((appointment) => {
          const specialistName: string = appointment.requestedUserFullName ? appointment.requestedUserFullName : '';
          return specialistName.toLowerCase().includes(searchTerm.toLowerCase());
        }
    );
    setFilteredSpecialists(filteredSpecialists);
  }, [searchTerm, appointments]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
        toast.success('La cita se ha cancelado exitosamente', {
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <Grid container spacing={2} sx={{width: 'auto', m: 3}}>
        <Grid item xs={12}>
            <Typography variant="h2" align="center" gutterBottom>
                Ver citas
            </Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto', marginTop: '50px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Código</TableCell>
                  <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Especialista</TableCell>
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
          <Typography variant="h2" align="center" gutterBottom>
              Ver citas
          </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box mt={2} sx={{justifyContent: 'flex-start'}}>
          <SearchIcon sx={{color: 'action.active', mr: 1, mt: 2}} />
          <TextField
              sx={{maxWidth: '50%'}}
              label="Buscar especialista"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto', marginTop: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Código</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Especialista</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Hora</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Fecha</TableCell>
                <TableCell sx={{ backgroundColor:purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                  ? filteredSpecialists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredSpecialists
                ).map((appointment) => {
                const appointmentDate = new Date(appointment.bookedDate);
                return (
                  <TableRow key={appointment.id}>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                      <Typography variant="body1">{`#${appointment.id}`}</Typography>
                    </TableCell>
                    <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                      <Typography variant="body1">{`${appointment.requestedUserFullName}`}</Typography>
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
                  count={filteredSpecialists.length}
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
                  labelRowsPerPage={"Citas por página"}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
        <Box>
          <DialogTitle>Cancelar cita</DialogTitle>
          <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
          <DialogContent sx={{ backgroundColor: 'white' }}>
            <Typography variant="body1">Estás seguro de que deseas cancelar esta cita?</Typography>
          </DialogContent>
          <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
          <DialogActions sx={{ backgroundColor: 'white' }}>
            <Button onClick={handleConfirmationClose} color="secondary" variant="outlined">
              No
            </Button>
            <Button onClick={handleConfirmationProceed} autoFocus color="primary" variant="outlined">
              Sí
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Grid>
  );
}
