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
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
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
  const userId = getGlobalUserId();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState<Appointment[]>([]);

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredClients.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await agent.Appointments.getAppointmentsBySpecialist();
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
        const filteredClients = appointments.filter((appointment) => {
                const clientName: string = appointment.requestingUserFullName ? appointment.requestingUserFullName : '';
                return clientName.toLowerCase().includes(searchTerm.toLowerCase());
            }
        );
        setFilteredClients(filteredClients);
    }, [searchTerm, appointments]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
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
                    label="Buscar cliente"
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
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Usuario</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Hora</TableCell>
                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                  ? filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredClients
                ).map((appointment) => {
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 25, 100, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={filteredClients.length}
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
    </Grid>
  );
}
