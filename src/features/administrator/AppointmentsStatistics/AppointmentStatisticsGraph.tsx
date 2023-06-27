import {useEffect, useState} from "react";
import agent from "../../../app/api/agent";
import {toast} from "react-toastify";
import {Chart} from "react-google-charts";
import * as React from "react";
import {Skeleton} from "@mui/material";

export default function AppointmentStatisticsGraph(){
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState([
        ['Estado', 'Cantidad de citas']
    ]);
    const options = {
        title: "Cantidad de Citas en el Sistema",
        colors: ['#ce93d8', '#8e24aa', '#4a148c'],
    };
    useEffect(() => {
        setLoading(true);
        agent.Appointments.getStatistics()
            .then((response) => {
                const result = [
                    ['Estado', 'Cantidad de citas'],
                    ['Realizadas', response.doneAppointmentQuantity],
                    ['Reservadas', response.bookedAppointmentQuantity],
                    ['Canceladas', response.canceledAppointmentQuantity],
                ];
                setStatistics([...result]);
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
    },[]);

    if (loading) return <Skeleton variant="rectangular" width="100%" height="400px" />

    return (
        <Chart
            chartType="PieChart"
            data={statistics}
            options={options}
            width={"100%"}
            height={"400px"}
        />
    );
}