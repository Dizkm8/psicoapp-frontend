import WeekPicker from "../../../app/components/WeekPicker";
import {useState} from "react";
import {getDayOfWeek, getTimeZone} from "../../../app/utils/dateHelper";

interface Props {
    startDate: Date,
    availableDates: string[],
    selection: string[],
    onClick: (date: Date, select: boolean) => void
}

export default function AppointmentPicker({startDate, availableDates, selection, onClick}: Props) {
    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate())

    function defaultSelectedDate(): boolean[][] {
        let result: boolean[][] = new Array(24);
        for(let i=1; i<24; i++){
            result[i] = new Array(7).fill(false);
        }

        for (const selectedDate of selection) {
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

    const isAble = (date: Date) : boolean => {
        let dateOnTimeZone: Date = new Date(date);
        const dateTimeZone = getTimeZone(date);
        dateOnTimeZone.setHours(date.getHours() + dateTimeZone);
        return !availableDates.includes(dateOnTimeZone.toISOString().split('.')[0]);
    };

    const handleClick = (day: number, hour: number, date: Date)=> {
        let newSelection: boolean[][] = [...selectedDate.slice(0,day),
            [...selectedDate[hour]],
            ...selectedDate.slice(day+1)
        ];

        if(selection[0] === date.toISOString()){
            newSelection[hour][day] = false;
            onClick(date, false);
        }
        else if(selection.length===0)
        {
            newSelection[hour][day] = true;
            onClick(date, true);
        }

        setSelectedDate(newSelection);
    };

    return (
        <WeekPicker
            startDate={startDate}
            isAble={isAble}
            selectedDates={selectedDate}
            onClick={handleClick}
        />
    );
}