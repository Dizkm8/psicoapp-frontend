import {PurpleButton} from "../../../app/components/PurpleButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as React from "react";
import {useNavigate} from "react-router-dom";

export default function UserAdministrationPage(){
    const navigate = useNavigate();
    const handleAddSpecialist = () => navigate('/administrator/manage-users/add-specialist');
    return(
        <>
            <PurpleButton
                variant="contained"
                startIcon={<AddCircleIcon />}
                sx={{justifySelf: 'end'}}
                onClick={handleAddSpecialist}
            >
                Agregar especialista
            </PurpleButton>
        </>
    );
}