import {PurpleButton} from "../../app/components/PurpleButton";
import GroupIcon from '@mui/icons-material/Group';
import * as React from "react";
import {useNavigate} from "react-router-dom";

export default function AdministratorPage(){
    const navigate = useNavigate();
    const handleAddSpecialist = () => navigate('/administrator/manage-users');
    return(
        <>
            <PurpleButton
                variant="contained"
                startIcon={<GroupIcon />}
                sx={{justifySelf: 'end'}}
                onClick={handleAddSpecialist}
            >
                Administrar usuarios
            </PurpleButton>
        </>
    );
}