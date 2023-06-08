import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import { purple } from '@mui/material/colors';
import { PurpleButton } from '../../app/components/PurpleButton';
import {
    Box, Button,
    Card, CardActions,
    CardContent, Dialog, DialogActions, DialogTitle,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useDispatch } from "react-redux";
import { signOff } from "./accountSlice";

interface PasswordForm {
    currentPassword?: string,
    newPassword?: string,
    confirmNewPassword?: string
}

const passwordRules =
{
    required: 'Campo obligatorio',
    minLength: { value: 10, message: 'La contraseña debe tener al menos 10 caracteres.' },
    maxLength: { value: 15, message: 'La contraseña no ouede tener más 15 caracteres.' }
};

export default function ChangePasswordForm() {
    const { control, handleSubmit, setError, formState: { isSubmitting, errors, isValid }, reset } = useForm({ mode: 'onTouched' });
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmitButton: SubmitHandler<FieldValues> = (data: FieldValues) => {
        setOpenConfirmation(false);
        const formData: PasswordForm = { ...data };
        agent.Login.updatePassword(formData)
            .then(response => {
                dispatch(signOff());
                navigate("/login");
            })
            .catch(err => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                console.log(err)
                switch (err.status) {
                    case 400:
                        if (err.data.error === "User not found")
                            error = 'Usuario no encontrado.'
                        else if (err.data.error === "Current password is incorrect") {
                            setError('currentPassword', { type: 'custom', message: 'La contraseña actual es incorrecta.' });
                            return;
                        }
                        if (!err.data.errors)
                            break;
                        if (err.data.errors.CurrentPassword)
                            setError('currentPassword', { type: 'required' });
                        if (err.data.errors.NewPassword) {
                            if (err.data.errors.NewPassword.includes('Confirm new Password is required'))
                                setError('confirmNewPassword', { type: 'required' });
                            else if (err.data.errors.NewPassword.includes('Password must have a length between 10 and 15 characters.'))
                                setError('confirmNewPassword', {
                                    type: 'custom',
                                    message: 'La contraseña de tener un largo entre 10 y 15 caracteres.'
                                });
                        }
                        if (err.data.errors.ConfirmNewPassword) {
                            if (err.data.errors.ConfirmNewPassword.includes('Confirm new Password is required'))
                                setError('confirmNewPassword', { type: 'required' });
                            else if (err.data.errors.ConfirmNewPassword.includes('Password must have a length between 10 and 15 characters.'))
                                setError('confirmNewPassword', { type: 'custom', message: 'La contraseña de tener un largo entre 10 y 15 caracteres.' });
                            else if (err.data.errors.ConfirmNewPassword.includes('Passwords do not match.'))
                                setError('confirmNewPassword', { type: 'custom', message: 'Las contraseñas no coinciden.' });
                        }
                        return;
                    case 500:
                        error = 'Ha ocurrido un problema interno. Intente nuevamente.'
                        break;
                    default:
                        break;
                }
                toast.error(error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            });
    };

    return (
        <>
            <Grid container component="main"
                spacing={0}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Card sx={{ width: '75%' }}>
                    <CardContent>
                        <Card sx={{ color: 'white', bgcolor: purple[400], my: 2 }}>
                            <Typography align="center" sx={{ my: 2, fontWeight: 'bold' }} variant="h4">Cambiar Contraseña</Typography>
                        </Card>
                        <Stack>
                            <Box component="form" id="password-form" noValidate onSubmit={handleSubmit(handleSubmitButton)} >
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <AccountBoxIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Contraseña Actual</Typography>
                                </Box>
                                <Controller
                                    name="currentPassword"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField
                                            margin="dense"
                                            type="password"
                                            sx={{ mt: 0.5 }}
                                            fullWidth
                                            autoComplete="current-password"
                                            error={!!errors.currentPassword}
                                            helperText={errors?.currentPassword?.message as string}
                                            {...field}
                                        />
                                    }
                                    rules={{ required: 'Campo obligatorio' }}
                                />
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <KeyIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Contraseña Nueva</Typography>
                                    </Box>
                                    <Controller
                                        name="newPassword"
                                        control={control}
                                        render={({ field }) =>
                                            <TextField
                                                type="password"
                                                margin="dense"
                                                fullWidth
                                                autoComplete="content"
                                                error={!!errors.newPassword}
                                                helperText={errors?.newPassword?.message as string}
                                                {...field}
                                            />
                                        }
                                        rules={passwordRules}
                                    />
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <KeyIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Confirmar Contraseña</Typography>
                                    </Box>
                                    <Controller
                                        name="confirmNewPassword"
                                        control={control}
                                        render={({ field }) =>
                                            <TextField
                                                type="password"
                                                margin="dense"
                                                fullWidth
                                                autoComplete="content"
                                                error={!!errors.confirmNewPassword}
                                                helperText={errors?.confirmNewPassword?.message as string}
                                                {...field}
                                            />
                                        }
                                        rules={passwordRules}
                                    />
                                </Box>
                                <Dialog open={openConfirmation}
                                    onClose={() => { setOpenConfirmation(false) }}>
                                    <DialogTitle id="alert-dialog-title">
                                        {"¿Está seguro que quiere realizar el cambio?\n Tendrá que iniciar sesión nuevamente."}
                                    </DialogTitle>
                                    <DialogActions>
                                        <Button
                                            onClick={() => { setOpenConfirmation(false) }}
                                            color='error'
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            form="password-form"
                                            autoFocus
                                            variant='contained'
                                            color='success'
                                        >
                                            Aceptar
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ flexDirection: 'row-reverse', m: '2' }}>
                        <PurpleButton variant="contained" onClick={() => { setOpenConfirmation(true) }}> <AssignmentTurnedInIcon sx={{ mr: 1, my: 0.5 }} /> Guardar cambios</PurpleButton>
                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}