import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import SpecialistInfo from "../../app/models/SpecialistInfo";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {
    Box,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
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

export default function AppointmentManagementPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [specialists, setSpecialists] = useState<SpecialistInfo[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - specialists.length) : 0;

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setLoading(true);
        agent.Users.getSpecialists()
            .then((response) => {
                setSpecialists([...response]);
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
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto', marginTop: '50px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>ID</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Nombre</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Especialidad</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Correo</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Teléfono</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {specialists.map((_, index) => (
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
        <Grid container spacing={2} sx={{width: 'auto', mx: 3}}>
            <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto', marginTop: '50px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>ID</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Nombre</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Especialidad</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Correo</TableCell>
                                <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Teléfono</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                    ? specialists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : specialists
                            ).map((specialist)=>{
                                return (
                                    <TableRow
                                        key={specialist.userId}
                                        hover
                                        onClick={() => navigate(`/administrator/manage-appointments/${specialist.userId}`)}
                                    >
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{specialist.userId}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{specialist.userFullName}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{specialist.specialityName}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{specialist.userEmail}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                            <Typography variant="body1">{specialist.userPhone}</Typography>
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
                                    count={specialists.length}
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
                                    labelRowsPerPage={"Especialistas por página"}
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