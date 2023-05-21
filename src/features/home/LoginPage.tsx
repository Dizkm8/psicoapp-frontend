import * as React from 'react';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PurpleButton } from '../../app/models/PurpleButton';
import { purple } from '@mui/material/colors';
import { Button } from '@mui/material';

export default function LoginPage() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({ email: data.get('email'), password: data.get('password') });
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
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Identificación"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <PurpleButton
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