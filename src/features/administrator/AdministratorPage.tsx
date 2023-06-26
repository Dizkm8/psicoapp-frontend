import {PurpleButton} from "../../app/components/PurpleButton";
import StraightenIcon from '@mui/icons-material/Straighten';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import * as React from "react";
import {Link} from "react-router-dom";

export default function AdministratorPage(){
    return(
        <>
            <Link to={'/administrator/update-rules'}>
                <PurpleButton
                    variant="contained"
                    startIcon={<StraightenIcon />}
                    sx={{justifySelf: 'end'}}
                >
                    Actualizar reglas
                </PurpleButton>
            </Link>
            <Link to={'/administrator/manage-users'}>
                <PurpleButton
                    variant="contained"
                    startIcon={<GroupIcon />}
                    sx={{justifySelf: 'end'}}
                >
                    Administrar usuarios
                </PurpleButton>
            </Link>
            <Link to={'/administrator/manage-appointments'}>
                <PurpleButton
                    variant="contained"
                    startIcon={<CalendarMonthIcon />}
                    sx={{justifySelf: 'end'}}
                >
                    Administrar citas
                </PurpleButton>
            </Link>
        </>
    );
}