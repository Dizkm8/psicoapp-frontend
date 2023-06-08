import * as React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PurpleButton } from '../../app/components/PurpleButton';
import { purple } from '@mui/material/colors';
import { Button } from '@mui/material';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {useNavigate, Link } from "react-router-dom";
import agent from '../../app/api/agent';
import axios from 'axios';
import {useDispatch} from "react-redux";
import {login} from "./accountSlice";
import {store} from "../../app/store/store";
import {toast} from "react-toastify";

type LoginFormValues = {
    userId: string;
    password: string;
};

export default function LoginPage() {

    const { control, handleSubmit, formState: { isSubmitting, errors, isValid }, reset, setError } = useForm({ mode: 'onTouched' });
    const navigate = useNavigate();
    const dispatch = useDispatch<typeof store.dispatch>()

    const handleSubmitButton: SubmitHandler<FieldValues> = (data: FieldValues) => {
        agent.Login.login(data.userId, data.password)
            .then(response => {
                dispatch(login(response.token));
                navigate("/home");
            })
            .catch(err => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status)
                {
                    case 400:
                        error = 'Las credenciales son incorrectas o su usuario esta deshabilitado.'
                        break;
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
            .finally(() => {
                reset();
            });
    };



    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid item md={12} lg={6} xl={6} component={Paper} elevation={6} square
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
                        Iniciar sesión
                    </Typography>
                    <Typography variant='h6' >¿No tienes cuenta? <Link to="/register">
                        {"Registrarse"}
                    </Link></Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(handleSubmitButton)} sx={{ mt: 1 }}>
                        <Controller
                            name="userId"
                            control={control}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Identificación"
                                    autoFocus
                                    error={!!errors.userId}
                                    helperText={errors.userId?.message as string}
                                    {...field} />}
                            rules={{ required: 'Campo obligatorio' }}
                        />
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({ field }) =>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Contraseña"
                                    autoComplete="current-password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message as string}
                                    {...field} />}
                            rules={{ required: 'Campo obligatorio' }}
                        />
                        <PurpleButton
                            disabled={!isValid}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Iniciar sesión
                        </PurpleButton>
                    </Box>
                    <Button variant="text" onClick={() => navigate('/home')} fullWidth>Ingresar como invitado</Button>
                </Box>
            </Grid>
            <Grid
                item
                xs={false}
                sm={false}
                md={false}
                lg={6}
                xl={6}
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