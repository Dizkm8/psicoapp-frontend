import {PurpleButton} from "../../app/components/PurpleButton";
import StraightenIcon from '@mui/icons-material/Straighten';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import * as React from "react";
import {Link} from "react-router-dom";
import {Stack} from "@mui/material";
import AppointmentStatisticsGraph from "./AppointmentsStatistics/AppointmentStatisticsGraph";

export default function AdministratorPage(){
    return(
        <Stack spacing={2} m={3}>
            <AppointmentStatisticsGraph/>
            <Link to={'/administrator/update-rules'}>
                <PurpleButton
                    fullWidth
                    variant="contained"
                    startIcon={<StraightenIcon />}
                    sx={{justifySelf: 'end'}}
                >
                    Actualizar reglas
                </PurpleButton>
            </Link>
            <Link to={'/administrator/manage-users'}>
                <PurpleButton
                    fullWidth
                    variant="contained"
                    startIcon={<GroupIcon />}
                    sx={{justifySelf: 'end'}}
                >
                    Administrar usuarios
                </PurpleButton>
            </Link>
            <Link to={'/administrator/manage-appointments'}>
                <PurpleButton
                    fullWidth
                    variant="contained"
                    startIcon={<CalendarMonthIcon />}
                    sx={{justifySelf: 'end'}}
                >
                    Administrar citas
                </PurpleButton>
            </Link>
        </Stack>
    );
}