import * as React from 'react';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PurpleButton } from '../../app/components/PurpleButton';
import { purple } from '@mui/material/colors';
import { Button } from '@mui/material';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom";
import agent from '../../app/api/agent';
import axios from 'axios';
import {useDispatch} from "react-redux";
import { login } from '../accountSlice';
import {store} from "../../app/store/store";

type LoginFormValues = {
    userId: string;
    password: string;
};

export default function LoginPage() {

    const { control, handleSubmit, formState: { isSubmitting, errors, isValid }, reset } = useForm({ mode: 'onTouched' });
    const navigate = useNavigate();
    const dispatch = useDispatch<typeof store.dispatch>()

    const handleSubmitButton: SubmitHandler<FieldValues> = (data: FieldValues) => {
        agent.Login.login(data.userId, data.password)
            .then(response => {
                dispatch(login(response.token));
                navigate("/home");
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                reset();
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
                        Iniciar sesión
                    </Typography>
                    <Typography variant='h6' >¿No tienes cuenta? <Link href="/register" variant="body2">
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
                    <Button variant="text" fullWidth>Ingresar como invitado</Button>
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