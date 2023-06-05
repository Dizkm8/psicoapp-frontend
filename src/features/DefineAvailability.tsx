import {useState} from "react";
import AvailabilityPicker from "../app/components/AvailabilityPicker";
import {Button} from "@mui/material";

export default function DefineAvailability()
{
    const [selection, setSelection] = useState(new Array());
    const occupiedDates: string[] = ['2023-06-04T13:00:00.000Z'];
    const [startDate, setStartDate] = useState(new Date(2023,4,29));

    const handleUpdate = (date: Date, select: boolean) =>
    {
        if(select)
        {
            const newSelection = [...selection, date.toString()];
            setSelection(newSelection);
        }
        else
        {
            const newSelection = selection.filter((selectedDate) => selectedDate !== date.toString());
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

    return(
        <>
            <Button onClick={handlePrevWeek}>Atras</Button>
            <Button onClick={handleNextWeek}>Siguiente</Button>
            <AvailabilityPicker
                key={startDate.toISOString()}
                startDate={startDate}
                occupiedDates={occupiedDates}
                selection={selection}
                onClick={handleUpdate}
            />
        </>
    );
}