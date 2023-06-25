import Grid from "@mui/material/Grid";
import {
    Box, Button,
    Card, CardActions,
    CardContent, Dialog, DialogActions, DialogTitle,
    FormControl,
    FormHelperText, InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {grey, purple} from "@mui/material/colors";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import * as React from "react";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {useNavigate} from "react-router-dom";
import agent from "../../../app/api/agent";
import {toast} from "react-toastify";
import {PurpleButton} from "../../../app/components/PurpleButton";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {useEffect, useState} from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import Specialist from "../../../app/models/Specialist";

export default function AddSpecialistPage(){
    const {
        control,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<Specialist>({mode: 'onTouched'});
    const [specialities, setSpecialities] = useState([]);
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        agent.Specialists.getSpecialities()
            .then((response) => {
                setLoading(true);
                setSpecialities(response);
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

    const handleSubmitButton: SubmitHandler<Specialist> = (data: Specialist) => {
        setOpenConfirmation(false);
        console.log(data);
        agent.Admin.addSpecialist(data)
            .then(response => {
                navigate("/home");
            })
            .catch((err) => {
                console.log(err);
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        if (err.data.errors?.Name)
                            setError('name', { type: 'minLength', message: 'El nombre debe tener al menos 2 caracteres.' });
                        if (err.data.errors?.FirstLastName)
                            setError('firstLastName', { type: 'minLength', message: 'El primer apellido debe tener al menos 2 caracteres.' });
                        if (err.data.errors?.SecondLastName)
                            setError('secondLastName', { type: 'minLength', message: 'El segundo apellido debe tener al menos 2 caracteres.' });
                        if (err.data.errors?.Phone)
                            setError('phone', { type: 'maxLength', message: 'El número de telefono debe tener 8 dígitos.' });
                        if (err.data.errors?.Gender)
                            setError('gender', { type: 'required', message: 'El género es obligatorio.' });
                        if (err.data.SpecialityId)
                            setError('specialityId', { type: 'custom', message: 'Se ha seleccionado una especialidad inválida.' });
                        if(err.data.Id)
                            setError('id',{type: 'required', message: 'El número de identificación ya se encuentra registrado.'});
                        if (err.data.errors?.Email) {
                            if (err.data.errors.Email.includes('Email is required'))
                                setError('email', { type: 'required' });
                            else if (err.data.errors.Email.includes('Invalid email format'))
                                setError('email', { type: 'pattern' });
                        }
                        else if (err.data.Email)
                            setError('email', {type: 'custom', message: 'El correo ingresado ya existe.'});
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

    return(
        <>
            <Grid container component="main"
                  spacing={0}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{mt: 3}}>
                <Card sx={{width: '75%', backgroundColor: grey[50]}}>
                    <CardContent>
                        <Card sx={{color: 'white', bgcolor: purple[400], my: 2}}>
                            <Typography align="center" sx={{my: 2, fontWeight: 'bold'}} variant="h4">Agregar Especialista</Typography>
                        </Card>
                        <Box component="form"
                             id="add-specialist-form"
                             noValidate
                             onSubmit={handleSubmit(handleSubmitButton)}
                        >
                            <Grid container item spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <AccountBoxIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">Nombre</Typography>
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
                                        rules={{required: 'Campo obligatorio'}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <BadgeIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">Primer Apellido</Typography>
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
                                        rules={{required: 'Campo obligatorio'}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <BadgeIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">Segundo Apellido</Typography>
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
                                        rules={{required: 'Campo obligatorio'}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <PermIdentityIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">Género</Typography>
                                    </Box>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({field}) =>
                                            <TextField margin="normal"
                                                       fullWidth
                                                       error={!!errors.gender}
                                                       helperText={errors?.gender?.message as string}
                                                       {...field}
                                            />}
                                        rules={{required: 'Campo obligatorio'}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <SmartphoneIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">Número Móvil</Typography>
                                    </Box>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({field}) =>
                                            <TextField margin="normal"
                                                       fullWidth
                                                       type="tel"
                                                       error={!!errors.phone}
                                                       helperText={errors?.phone?.message as string}
                                                       InputProps={{
                                                           startAdornment: <InputAdornment position="start">+56 9</InputAdornment>,
                                                       }}
                                                       {...field} />}
                                        rules={{
                                            required: 'Campo obligatorio',
                                            pattern: {
                                                value: /^\d{8}$/,
                                                message: 'El número debe ser de 8 dígitos'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <FingerprintIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">RUT/Pasaporte</Typography>
                                    </Box>
                                    <Controller
                                        name="id"
                                        control={control}
                                        render={({field}) =>
                                            <TextField margin="normal"
                                                       fullWidth
                                                       autoComplete="rut"
                                                       error={!!errors.id}
                                                       helperText={errors?.id?.message as string}
                                                       {...field}
                                            />}
                                        rules={{required: 'Campo obligatorio'}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <PsychologyIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">Especialidad</Typography>
                                    </Box>
                                    <Controller
                                        name="specialityId"
                                        control={control}
                                        defaultValue={1}
                                        render={({field}) =>
                                            <Select
                                                sx={{mt: 2}}
                                                fullWidth
                                                {...field}
                                            >
                                                {specialities.map(({id, name}) => {
                                                    return <MenuItem value={id}>{name}</MenuItem>
                                                })}
                                            </Select>}
                                        rules={{
                                            required: 'Campo obligatorio',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                                        <EmailIcon sx={{mr: 1, my: 0.5}} /> <Typography variant="h6">Correo Electrónico</Typography>
                                    </Box>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({field}) =>
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
                                </Grid>
                            </Grid>
                            <Dialog open={openConfirmation}
                                    onClose={() => {setOpenConfirmation(false)}}>
                                <DialogTitle id="alert-dialog-title">
                                    {"¿Está seguro que quiere realizar el cambio?"}
                                </DialogTitle>
                                <DialogActions>
                                    <Button
                                        onClick={() => {setOpenConfirmation(false)}}
                                        color='error'
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant='contained'
                                        onClick={() => {setOpenConfirmation(false)}}
                                        color='success'
                                        type="submit"
                                        form="add-specialist-form"
                                    >
                                        Aceptar
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </CardContent>
                    <CardActions sx={{flexDirection: 'row-reverse', m: '2'}}>
                        <PurpleButton
                            variant="contained"
                            onClick={() => {setOpenConfirmation(true)}}
                        >
                            <AssignmentTurnedInIcon sx={{mr: 1, my: 0.5}} />
                            Agregar especialista
                        </PurpleButton>
                    </CardActions>
                </Card>
            </Grid>
        </>
    );
}