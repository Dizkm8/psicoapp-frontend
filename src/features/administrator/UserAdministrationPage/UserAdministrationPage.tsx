import {PurpleButton} from "../../../app/components/PurpleButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as React from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle, Divider, Grid, Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell, TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import User from "../../../app/models/User";
import agent from "../../../app/api/agent";
import {toast} from "react-toastify";
import LoadingComponent from "../../../app/layout/LoadingComponent";
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

interface DialogState {
    id: string;
    isEnabled: boolean;
    isDialogOpen: boolean;
}
export default function UserAdministrationPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [dialogState, setDialogState] =
        useState<DialogState>({id: '', isEnabled: false, isDialogOpen: false});
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleUpdate = () => {
        if(!dialogState)
            return;
        agent.Admin.updateUserAvailability(dialogState.id, !dialogState.isEnabled)
            .then(() => {
                const newUsers = users.map((user) => {
                    return (user.id !== dialogState.id) ? user :
                        {...user, isEnabled: !dialogState.isEnabled};
                });
                setUsers(newUsers);
                toast.success('El usuario se ha modificado con éxito.', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    toastId: 'success.updateUserAvailability',
                });
            })
            .catch(err => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        error = 'No se ha encontrado el usuario en el sistema.'
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
            })
            .finally(handleDialogClose);
    }

    const handleClick = (userId: string, isEnabled: boolean) =>
        setDialogState({id: userId, isEnabled: isEnabled, isDialogOpen: true});

    const handleDialogClose = () => setDialogState({id: '', isEnabled: false, isDialogOpen: false});

    useEffect(() => {
        setLoading(true);
        agent.Users.getUsers()
            .then((response) => {
                setUsers([...response]);
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

    return(
        <Grid container spacing={2} sx={{width: 'auto', m: 3}}>
            <Grid item xs={12}>
                <Typography variant="h2" align="center" gutterBottom>
                    Administración de Usuarios
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{display: 'flex', justifyContent: 'end'}}>
                    <Link to={'/administrator/manage-users/add-specialist'}>
                        <PurpleButton
                            variant="contained"
                            startIcon={<AddCircleIcon />}
                        >
                            Agregar especialista
                        </PurpleButton>
                    </Link>
                </Box>
            </Grid>
            {loading?
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>ID</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Nombre</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Correo</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Teléfono</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Rol</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((_, index) => (
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
            :
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxWidth: '1500px', margin: '0 auto'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>ID</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Nombre</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Correo</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Teléfono</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Rol</TableCell>
                                    <TableCell sx={{ backgroundColor: purple[400], color: 'white', fontSize: '1.05rem', fontWeight: 'bold', border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                        ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : users
                                ).map((user)=>{
                                    let id = user.id? user.id : '';
                                    let isEnabled = user.isEnabled? user.isEnabled : false;
                                    return (
                                        <TableRow
                                            key={user.id}
                                            hover
                                        >
                                            <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                                <Typography variant="body1">{user.id}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                                <Typography variant="body1">{user.fullName}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                                <Typography variant="body1">{user.email}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                                <Typography variant="body1">{user.phone}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ border: '1px solid lightgrey', textAlign: 'center', width: '20%' }}>
                                                <Typography variant="body1">{user.roleName}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1">{user.isEnabled? 'Habilitado': 'Inhabilitado'}</Typography>

                                                <Switch
                                                    checked={isEnabled}
                                                    onClick={() => handleClick(id, isEnabled)}
                                                />
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
                                        count={users.length}
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
                                        labelRowsPerPage={"Usuarios por página"}
                                        labelDisplayedRows={({ from, to, count }) =>
                                            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Grid>
            }

            <Dialog
                open={dialogState.isDialogOpen}
                onClose={handleDialogClose}
            >
                <Box>
                    <DialogTitle>Modificar usuario</DialogTitle>
                    <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
                    <DialogContent sx={{ backgroundColor: 'white' }}>
                        <Typography variant="body1">
                            {`¿Está seguro que quiere ${dialogState.isEnabled? 'deshabilitar': 'habilitar'} al usuario?`}
                        </Typography>
                    </DialogContent>
                    <Divider sx={{ backgroundColor: 'lightgrey', height: '3px' }} />
                    <DialogActions sx={{ backgroundColor: 'white' }}>
                        <Button onClick={handleDialogClose} color="secondary" variant="outlined">
                            No
                        </Button>
                        <Button onClick={handleUpdate} autoFocus color="primary" variant="outlined">
                            Sí
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Grid>
    );
}