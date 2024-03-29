import { useEffect, useState } from "react";
import AppointmentPicker from "./AppointmentPicker";
import {Box, Button, Card, Dialog, DialogActions, DialogTitle, IconButton, Paper} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import * as React from "react";
import { getWeekStartDay } from "../../../app/utils/dateHelper";
import agent from "../../../app/api/agent";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";
import { PurpleButton } from "../../../app/components/PurpleButton";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import Typography from "@mui/material/Typography";
import AvailabilitySlot from "../../../app/models/AvailabilitySlot";
import SpecialistInfo from "../../../app/models/SpecialistInfo";
import {purple} from "@mui/material/colors";

const getDefaultStartDate = () => {
    let date = new Date(Date.now());
    return getWeekStartDay(date);
};

const getAvailableSlots = (availabilitySlots: AvailabilitySlot[]) => {
    let result = new Array<string>();
    for (const slot of availabilitySlots) {
        if(slot.isAvailable)
            result = [...result, slot.startTime];
    }
    return result;
};

export default function BookAppointmentPage() {
    const [selection, setSelection] = useState(new Array<string>());
    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [availableDates, setAvailableDates] = useState(new Array<string>());
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const specialistId: string = id ? id : '';
    const [specialistInfo, setSpecialistInfo] = useState<SpecialistInfo>({
        specialityName: "",
        userFullName: "",
        userIsEnabled: false
    });

    useEffect(() => {
        setLoading(true);
        agent.Users.getSpecialist(specialistId).then((response) => {
            if(!response.userIsEnabled){
                toast.error('El especialista no está disponible', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
                navigate('/home');
            }
            setSpecialistInfo(response);
        })
            .catch((err) =>{
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
            navigate('/home');
        }).then( () =>
        agent.Specialists.getAvailability(specialistId).then((response) => {
            const result = getAvailableSlots(response);
            setAvailableDates(result);
            })
            .catch((err) =>{
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
                navigate('/home');
            })
    ).finally(() => setLoading(false));
    }, [specialistId]);

    if (loading) return <LoadingComponent message='Cargando disponibilidad...' />

    const handleUpdate = (date: Date, select: boolean) => {
        if (select) {
            const newSelection = [date.toISOString()];
            setSelection(newSelection);
        }
        else {
            setSelection(new Array<string>());
        }
    };

    const handleNextWeek = () => {
        let newDate: Date = new Date(startDate);
        newDate.setDate(startDate.getDate() + 7);
        setStartDate(newDate);
    };
    const handlePrevWeek = () => {
        let newDate: Date = new Date(startDate);
        newDate.setDate(startDate.getDate() - 7);
        setStartDate(newDate);
    };

    const handleSubmit = () => {
        setOpenConfirmation(false);
        if(selection.length === 0)
            return;
        console.log(selection);
        agent.Clients.addAppointment(specialistId, selection[0])
            .then(() => navigate("/home"))
            .catch((err) => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        error = "La hora ya ha sido agendada o se encuentra fuera del rango válido."
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
            <Dialog open={openConfirmation}
                onClose={() => {setOpenConfirmation(false)}}>
                <DialogTitle id="alert-dialog-title">
                    {"¿Está seguro que quiere realizar la agendar?"}
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={() => {setOpenConfirmation(false)}}
                        color='error'
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        autoFocus
                        variant='contained'
                        color='success'
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(1, 1fr)',
                    justifyItems: 'center',
                    m: 4
                }}
            >
                <Paper sx={{width: '50%', height: '10em', mb: 2}}>
                    <Card sx={{color: 'white', bgcolor: purple[400], m: 3}}>
                        <Typography
                            align="center"
                            sx={{m: 2}}
                            variant="h6"
                            noWrap
                        >
                            {specialistInfo.userFullName}
                        </Typography>
                    </Card>
                    <Typography sx={{m: 3}} align="right">
                        Especialidad: {specialistInfo.specialityName}
                    </Typography>
                </Paper>
                <AppointmentPicker
                    key={startDate.toISOString()}
                    startDate={startDate}
                    availableDates={availableDates}
                    selection={selection}
                    onClick={handleUpdate}
                />
                <Box sx={{ m: 2 }}>
                    <IconButton onClick={handlePrevWeek}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton onClick={handleNextWeek}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
                <PurpleButton
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    sx={{ justifySelf: 'end' }}
                    onClick={() => {setOpenConfirmation(true)}}
                >
                    Confirmar cambios
                </PurpleButton>
            </Box>
        </>
    );
}