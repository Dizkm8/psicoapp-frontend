import * as React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PurpleButton } from '../../app/components/PurpleButton';
import { purple } from '@mui/material/colors';
import { Button, InputAdornment } from '@mui/material';
import {useForm, Controller, SubmitHandler, FieldValues} from "react-hook-form";
import User from "../../app/models/User";
import agent from "../../app/api/agent";
import {useNavigate, Link } from "react-router-dom";
import {toast} from "react-toastify";
import { setGlobalUserId } from './UserContext';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

export default function RegisterPage() {
    
    const { control, handleSubmit, formState: { isSubmitting, errors, isValid }, setError, reset } = useForm({mode: 'onTouched'});
    const navigate = useNavigate();
    const [passwordMismatch, setPasswordMismatch] = React.useState(false);

    const handleSubmitButton: SubmitHandler<FieldValues> = (data: FieldValues) => {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', { type: 'validate', message: 'Las contraseñas no coinciden' });
            reset({ ...data, password: '', confirmPassword: '' });
            setPasswordMismatch(true);
            return;
        }
        
        const completeData: User = {...data, isEnabled: true, role: 1, id: data.id};// Patch while the models aren't updated
        console.log(completeData);
        agent.Login.register(completeData)
            .then(response => {
                setGlobalUserId(data.userId); // Set userId globally
                navigate("/home");
            })
            .catch(err => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                console.log(err)
                switch (err.status)
                {
                    case 400:
                        if(err.data.errors?.Name)
                            setError('name',{type: 'minLength', message: 'El nombre debe tener al menos 2 caracteres.'});
                        if(err.data.errors?.FirstLastName)
                            setError('firstLastName',{type: 'minLength', message: 'El primer apellido debe tener al menos 2 caracteres.'});
                        if(err.data.errors?.SecondLastName)
                            setError('secondLastName',{type: 'minLength', message: 'El segundo apellido debe tener al menos 2 caracteres.'});
                        if(err.data.errors?.Gender)
                            setError('gender',{type: 'required', message: 'El género es obligatorio.'});
                        if(err.data.errors?.Email)
                        {
                            if (err.data.errors.Email.includes('Email is required'))
                                setError('email', {type: 'required'});
                            else if (err.data.errors.Email.includes('Invalid email format'))
                                setError('email', { type: 'pattern'});

                        } else if (err.data.Email)
                            setError('email', { type: 'custom', message: "El correo ingresado ya existe."});
                        if(err.data.Id)
                            setError('id',{type: 'required', message: 'El número de identificación ya se encuentra registrado.'});
                        if(err.data.errors?.Password)
                            setError('password',{type: 'maxLength', message: 'La contraseña debe tener un largo entre 10 a 15 caracteres.'});
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
            })
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square
                sx={{
                    display: 'flex',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}>
                    <Typography component='h2' variant='h3'>
                        Registrarse
                    </Typography>
                    <Typography variant='h6' >¿Ya tienes cuenta? <Link to="/login" >
                        {"Iniciar sesión"}
                    </Link></Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(handleSubmitButton)} sx={{ mt: 1 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) =>
                                <TextField margin="normal"
                                           fullWidth
                                           label="Nombre"
                                           autoComplete="name"
                                           error={!!errors.name}
                                           helperText={errors?.name?.message as string}
                                           {...field} />}
                            rules={{required: 'Campo obligatorio'}}
                        />
                        <Grid container item spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    name="firstLastName"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="normal"
                                                   fullWidth
                                                   label="Primer Apellido"
                                                   autoComplete="name"
                                                   error={!!errors.firstLastName}
                                                   helperText={errors?.firstLastName?.message as string}
                                                   {...field} />}
                                    rules={{required: 'Campo obligatorio'}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="secondLastName"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="normal"
                                                   fullWidth
                                                   label="Segundo Apellido"
                                                   autoComplete="name"
                                                   error={!!errors.secondLastName}
                                                   helperText={errors?.secondLastName?.message as string}
                                                   {...field} />}
                                    rules={{required: 'Campo obligatorio'}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2}>
                            <Grid item>
                                <Controller
                                    name="id"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="normal"
                                                   fullWidth
                                                   label="RUT/Pasaporte"
                                                   error={!!errors.id}
                                                   helperText={errors?.id?.message as string}
                                                   {...field} />}
                                    rules={{required: 'Campo obligatorio'}}
                                />
                            </Grid>
                            <Grid item>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="normal"
                                                   fullWidth
                                                   label="Género"
                                                   error={!!errors.gender}
                                                   helperText={errors?.gender?.message as string}
                                                   {...field} />}
                                    rules={{required: 'Campo obligatorio'}}
                                />
                            </Grid>
                            <Grid item>
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
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) =>
                                <TextField margin="normal"
                                           fullWidth
                                           label="Correo electrónico"
                                           autoComplete="email"
                                           error={!!errors.email}
                                           helperText={errors?.email?.message as string}
                                           {...field} />}
                            rules={{required: 'Campo obligatorio',
                                pattern: {
                                    value: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
                                    message: 'Correo inválido'
                                }}}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) =>
                                <TextField margin="normal"
                                           fullWidth
                                           label="Contraseña"
                                           type="password"
                                           autoComplete="current-password"
                                           error={!!errors.password}
                                           helperText={errors?.password?.message as string}
                                           {...field} />}
                            rules={{required: 'Campo obligatorio'}}
                        />
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) =>
                                <TextField margin="normal"
                                            fullWidth
                                            label="Confirmar Contraseña"
                                            type="password"
                                            autoComplete="current-password"
                                            error={!!errors.confirmPassword}
                                            helperText={errors?.confirmPassword?.message as string}
                                            {...field} />}
                            rules={{ required: 'Campo obligatorio' }}
                        />
                        {passwordMismatch && (
                            <Typography color="error" variant="body2">
                                Las contraseñas no coinciden
                            </Typography>
                        )}
                        <PurpleButton
                            disabled={!isValid}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrarse
                        </PurpleButton>
                    </Box>
                </Box>
            </Grid>
            <Grid
                item
                xs={false}
                sm={6}
                md={6}
                sx={{
                    bgcolor: purple[500],
                    display: 'flex',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'white',
                    p: 2,
                    borderRadius: 2,
                }}>
                    <Typography component="h1" variant="h1" sx={{ fontWeight: 'bold' }}>PsicoApp</Typography>
                </Box>
            </Grid>
        </Grid >
    );
}