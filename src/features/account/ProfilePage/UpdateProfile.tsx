import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PurpleButton } from '../../../app/components/PurpleButton';
import { purple } from '@mui/material/colors';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogTitle,
    InputAdornment,
    Stack
} from '@mui/material';
import { useForm, Controller, SubmitHandler, FieldValues } from "react-hook-form";
import User from "../../../app/models/User";
import agent from "../../../app/api/agent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

interface Props {
    user: User | undefined;
}


export default function UpdateProfile({ user }: Props) {
    const { control, handleSubmit, formState: { isSubmitting, errors, isValid }, setError, reset, getValues, setValue } = useForm({ mode: 'onTouched', defaultValues: user });
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmitButton: SubmitHandler<FieldValues> = (data: FieldValues) => {
        setOpenConfirmation(false);
        const completeData: User = { ...data }; // Patch while the models aren't updated
        console.log(completeData);
        agent.Users.updateProfileInformation(completeData)
            .then(response => {
                navigate("/home");
            })
            .catch((err) => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        if (err.data.errors?.Name)
                            setError('name', { type: 'minLength', message: 'El nombre debe tener al menos 2 caracteres.' });
                        if (err.data.errors?.FirstLastName)
                            setError('firstLastName', { type: 'minLength', message: 'El primer apellido debe tener al menos 2 caracteres.' });
                        if (err.data.errors?.SecondLastName)
                            setError('secondLastName', { type: 'minLength', message: 'El segundo apellido debe tener al menos 2 caracteres.' });
                        if (err.data.errors?.Gender)
                            setError('gender', { type: 'required', message: 'El género es obligatorio.' });
                        if (err.data.errors?.Email) {
                            if (err.data.errors.Email.includes('Email is required'))
                                setError('email', { type: 'required' });
                            else if (err.data.errors.Email.includes('Invalid email format'))
                                setError('email', { type: 'pattern' });
                        }
                        else if (err.data.error === "Email already exists")
                            setError('email', { type: 'custom', message: 'El correo ingresado ya existe.' });
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
        <Grid container component="main"
            spacing={0}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Card sx={{ width: '75%' }}>
                <CardContent>
                    <Card sx={{ color: 'white', bgcolor: purple[400], my: 2 }}>
                        <Typography align="center" sx={{ my: 2, fontWeight: 'bold' }} variant="h4">Perfil</Typography>
                    </Card>
                    <Stack>
                        <Box component="form" id="update-profile-form" noValidate onSubmit={handleSubmit(handleSubmitButton)} sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <AccountBoxIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Nombre</Typography>
                            </Box>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) =>
                                    <TextField margin="normal"
                                        fullWidth
                                        autoComplete="name"
                                        error={!!errors.name}
                                        helperText={errors?.name?.message as string}
                                        {...field} />}
                                rules={{ required: 'Campo obligatorio' }}
                            />
                            <Grid container item spacing={2}>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <BadgeIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Primer Apellido</Typography>
                                    </Box>
                                    <Controller
                                        name="firstLastName"
                                        control={control}
                                        render={({ field }) =>
                                            <TextField margin="normal"
                                                fullWidth
                                                autoComplete="lastname"
                                                error={!!errors.firstLastName}
                                                helperText={errors?.firstLastName?.message as string}
                                                {...field} />}
                                        rules={{ required: 'Campo obligatorio' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <BadgeIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Segundo Apellido</Typography>
                                    </Box>
                                    <Controller
                                        name="secondLastName"
                                        control={control}
                                        render={({ field }) =>
                                            <TextField margin="normal"
                                                fullWidth
                                                autoComplete="name"
                                                error={!!errors.secondLastName}
                                                helperText={errors?.secondLastName?.message as string}
                                                {...field} />}
                                        rules={{ required: 'Campo obligatorio' }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2}>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <PermIdentityIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Género</Typography>
                                    </Box>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) =>
                                            <TextField margin="normal"
                                                fullWidth
                                                error={!!errors.gender}
                                                helperText={errors?.gender?.message as string}
                                                {...field}
                                            />}
                                        rules={{ required: 'Campo obligatorio' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <SmartphoneIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Número Móvil</Typography>
                                    </Box>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) =>
                                            <MuiTelInput margin="normal"
                                                {...field}
                                                fullWidth
                                                label="Número móvil"
                                                defaultCountry="CL"
                                                forceCallingCode
                                                value={field.value ? String(field.value) : ''}
                                                onChange={(value) => { field.onChange(value) }}
                                                error={!!errors.phone}
                                                helperText={errors?.phone?.message as string}
                                            />}
                                        rules={{
                                            required: 'Campo obligatorio',
                                            validate: (value) => value && matchIsValidTel(value) ? true : 'Número de teléfono inválido',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <EmailIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Correo Electrónico</Typography>
                            </Box>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) =>
                                    <TextField margin="normal"
                                        fullWidth
                                        autoComplete="email"
                                        error={!!errors.email}
                                        helperText={errors?.email?.message as string}
                                        {...field}
                                    />}
                                rules={{
                                    required: 'Campo obligatorio',
                                    pattern: {
                                        value: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
                                        message: 'Correo inválido'
                                    }
                                }}
                            />
                            <Dialog open={openConfirmation}
                                onClose={() => { setOpenConfirmation(false) }}>
                                <DialogTitle id="alert-dialog-title">
                                    {"¿Está seguro que quiere realizar el cambio?"}
                                </DialogTitle>
                                <DialogActions>
                                    <Button
                                        onClick={() => { setOpenConfirmation(false) }}
                                        color='error'
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant='contained'
                                        onClick={() => { setOpenConfirmation(false) }}
                                        color='success'
                                        type="submit"
                                        form="update-profile-form"
                                        autoFocus
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
    );
}