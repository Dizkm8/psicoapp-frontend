import {PurpleButton} from "../../../app/components/PurpleButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as React from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import User from "../../../app/models/User";
import agent from "../../../app/api/agent";
import {toast} from "react-toastify";
import LoadingComponent from "../../../app/layout/LoadingComponent";

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

    const handleUpdate = () => {
        if(!dialogState)
            return;
        agent.Admin.updateUserAvailability(dialogState.id, dialogState.isEnabled)
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

    if (loading) return <LoadingComponent message='Cargando información...' />

    return(
        <>
            <Dialog
                open={dialogState.isDialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle id="alert-dialog-title">
                    {`¿Está seguro que quiere ${dialogState.isEnabled? 'deshabilitar': 'habilitar'} al usuario?`}
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        color='error'
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleUpdate}
                        color='success'
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Stack spacing={2} m={3}>
                <Typography variant="h2" align="center" gutterBottom>
                    Administración de Usuarios
                </Typography>
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user)=>{
                            let id = user.id? user.id : '';
                            let isEnabled = user.isEnabled? user.isEnabled : false;
                            return (
                                <TableRow
                                    key={user.id}
                                    hover
                                >
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.roleName}</TableCell>
                                    <TableCell>
                                        {user.isEnabled? 'Habilitado': 'Inhabilitado'}
                                        <Switch
                                            checked={isEnabled}
                                            onClick={() => handleClick(id, isEnabled)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Stack>
        </>
    );
}