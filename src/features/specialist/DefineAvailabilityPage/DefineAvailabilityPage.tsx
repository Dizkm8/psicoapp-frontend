import { useEffect, useState } from "react";
import AvailabilityPicker from "./AvailabilityPicker";
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import * as React from "react";
import { getWeekStartDay } from "../../../app/utils/dateHelper";
import agent from "../../../app/api/agent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PurpleButton } from "../../../app/components/PurpleButton";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const getDefaultStartDate = () => {
    let date = new Date(Date.now());
    return getWeekStartDay(date);
};

export default function DefineAvailabilityPage() {
    const [selection, setSelection] = useState(new Array<string>());
    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [occupiedDates, setOccupiedDates] = useState(new Array<string>());
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        agent.Specialists.getAvailability(startDate.toDateString()).then((response) => {
            const result = response.map((slot: { startTime: string; }) => slot.startTime);
            setOccupiedDates(result);
            setLoading(false)
        })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));

    }, [startDate]);

    if (loading) return <LoadingComponent message='Cargando disponibilidad...' />

    const handleUpdate = (date: Date, select: boolean) => {
        if (select) {
            const newSelection = [...selection, date.toISOString()];
            setSelection(newSelection);
        }
        else {
            const newSelection = selection.filter((selectedDate) => selectedDate !== date.toISOString());
            setSelection(newSelection);
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
        agent.Specialists.addAvailability(selection.map((element) => { return { startTime: element } }))
            .then(() => navigate("/home"))
            .catch((err) => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        error = "La fecha ya ha sido ingresada o se encuentra fuera del rango válido."
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
                onClose={() => { setOpenConfirmation(false) }}>
                <DialogTitle id="alert-dialog-title">
                    {"¿Está seguro que quiere realizar los cambios?"}
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={() => { setOpenConfirmation(false) }}
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
                }}>
                <AvailabilityPicker
                    key={startDate.toISOString()}
                    startDate={startDate}
                    occupiedDates={occupiedDates}
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
                    onClick={() => { setOpenConfirmation(true) }}
                >
                    Confirmar cambios
                </PurpleButton>
            </Box>
        </>
    );
}