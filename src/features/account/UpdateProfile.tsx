import * as React from 'react';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
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
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


export default function RegisterPage() {

    const { control, handleSubmit, formState: { isSubmitting, errors, isValid }, setError} = useForm({mode: 'onTouched', defaultValues: async () => await agent.Users.getProfileInformation()});
    const navigate = useNavigate();

    const handleSubmitButton: SubmitHandler<FieldValues> = (data: FieldValues) => {
        const completeData: User = {...data}; // Patch while the models aren't updated
        console.log(completeData);
        agent.Users.updateProfileInformation(completeData)
            .then(response => {
                navigate("/");
            })
            .catch((err) => {
            let error: string = "Ha habido un error. Intente nuevamente.";
            switch (err.status)
            {
                case 400:
                    if(err.data.errors.Name)
                        setError('name',{type: 'minLength', message: 'El nombre debe tener al menos 2 caracteres.'});
                    if(err.data.errors.FirstLastName)
                        setError('firstLastName',{type: 'minLength', message: 'El primer apellido debe tener al menos 2 caracteres.'});
                    if(err.data.errors.SecondLastName)
                        setError('secondLastName',{type: 'minLength', message: 'El segundo apellido debe tener al menos 2 caracteres.'});
                    if(err.data.errors.Phone)
                        setError('phone',{type: 'maxLength', message: 'El número de telefono debe tener 8 dígitos.'});
                    if(err.data.errors.Gender)
                        setError('gender',{type: 'required', message: 'El género es obligatorio.'});
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
                        Editar Perfil
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(handleSubmitButton)} sx={{ mt: 1 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) =>
                                <TextField margin="normal"
                                           fullWidth
                                           label="Nombre"
                                           InputLabelProps={{ shrink: true }}
                                           autoComplete="name"
                                           error={!!errors.name}
                                           helperText={errors?.name?.message as string}
                                           {...field} />}
                            
                        />
                        <Grid container item spacing={1}>
                            <Grid item>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="normal"
                                                   fullWidth
                                                   label="Género"
                                                   InputLabelProps={{ shrink: true }}
                                                   error={!!errors.gender}
                                                   helperText={errors?.gender?.message as string}
                                                   {...field} />}
                                    
                                />
                            </Grid>
                            <Grid item>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="normal"
                                                   fullWidth
                                                   label="Número móvil"
                                                   type="tel"
                                                   error={!!errors.phone}
                                                   helperText={errors?.phone?.message as string}
                                                   InputProps={{
                                                       startAdornment: <InputAdornment position="start">+56 9</InputAdornment>,
                                                   }}
                                                   {...field} />}
                                    rules={{pattern: {
                                            value: /^\d{8}$/,
                                            message: 'El número debe ser de 8 dígitos'
                                        }
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
                                           InputLabelProps={{ shrink: true }}
                                           autoComplete="email"
                                           error={!!errors.email}
                                           helperText={errors?.email?.message as string}
                                           {...field} />}
                            rules={{pattern: {
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
                            
                        />
                        <PurpleButton
                            disabled={!isValid}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Actualizar
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