import {useState} from "react";
import AvailabilityPicker from "../../app/components/AvailabilityPicker";
import {Box, Button, Dialog, DialogActions, DialogTitle, IconButton} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import * as React from "react";
export default function DefineAvailability()
{
    const [selection, setSelection] = useState(new Array());
    const occupiedDates: string[] = ['2023-06-04T13:00:00.000Z'];
    const [startDate, setStartDate] = useState(new Date(2023,4,29));
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    const handleUpdate = (date: Date, select: boolean) =>
    {
        if(select)
        {
            const newSelection = [...selection, date.toISOString()];
            setSelection(newSelection);
        }
        else
        {
            const newSelection = selection.filter((selectedDate) => selectedDate !== date.toISOString());
            setSelection(newSelection);
        }
    };

    const handleNextWeek = () =>
    {
        let newDate: Date = new Date(startDate);
        newDate.setDate(startDate.getDate() + 7);
        setStartDate(newDate);
    };
    const handlePrevWeek = () =>
    {
        let newDate: Date = new Date(startDate);
        newDate.setDate(startDate.getDate() - 7);
        setStartDate(newDate);
    };

    const handleSubmit = () =>
    {
        setOpenConfirmation(false);
        console.log(selection);
    };

    return(
        <>
            <Dialog open={openConfirmation}
                    onClose={()=>{setOpenConfirmation(false)}}>
                <DialogTitle id="alert-dialog-title">
                    {"¿Está seguro que quiere realizar los cambios?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={()=>{setOpenConfirmation(false)}}>Cancelar</Button>
                    <Button onClick={handleSubmit} autoFocus>
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
                <Box sx={{m: 2}}>
                    <IconButton onClick={handlePrevWeek}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton onClick={handleNextWeek}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    sx={{ justifySelf: 'end'}}
                    onClick={()=>{setOpenConfirmation(true)}}
                >
                    Confirmar cambios
                </Button>
            </Box>
        </>
    );
}