import WeekPicker from "../../../app/components/WeekPicker";
import {useState} from "react";
import {getDayOfWeek} from "../../../app/utils/dateHelper";

interface Props
{
    startDate: Date,
    occupiedDates: string[],
    selection: string[],
    onClick: (date: Date, select: boolean) => void
}

export default function AvailabilityPicker({startDate, occupiedDates, selection, onClick}: Props)
{
    const [selectedDates, setSelectedDates] = useState(defaultSelectedDate())

    function defaultSelectedDate(): boolean[][]  {
        let result: boolean[][] = new Array(24);
        for(let i=1; i<24; i++)
        {
            result[i] = new Array(7).fill(false);
        }

        for (const selectedDate of selection)
        {
            const date = new Date(selectedDate);
            if(date < startDate)
            {continue}

            let endDate: Date = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            if(endDate < date)
            {continue}

            const day = getDayOfWeek(date);
            const hour = date.getHours();
            result[hour][day] = true;
        }
        return result;
    }


    const handleClick = (day: number, hour: number, date: Date)=>
    {
        let newSelection: boolean[][] = [...selectedDates.slice(0,day),
            [...selectedDates[hour]],
            ...selectedDates.slice(day+1)
        ]
        if(selectedDates[hour][day] )
        {
            newSelection[hour][day] = false;
            onClick(date, false);
        }
        else
        {
            newSelection[hour][day] = true;
            onClick(date, true);
        }
        setSelectedDates(newSelection);
    };

    return (
        <WeekPicker
            startDate={startDate}
            occupiedDates={occupiedDates}
            selectedDates={selectedDates}
            onClick={handleClick}
        />
    );
}