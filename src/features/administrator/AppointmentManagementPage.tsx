import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import SpecialistInfo from "../../app/models/SpecialistInfo";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

export default function AppointmentManagementPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [specialists, setSpecialists] = useState<SpecialistInfo[]>([]);

    useEffect(() => {
        setLoading(true);
        agent.Users.getSpecialists()
            .then((response) => {
                setSpecialists([...response]);
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
    }, []);

    if (loading) return <LoadingComponent message='Cargando información...' />

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Especialidad</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell>Teléfono</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {specialists.map((specialist)=>{
                        return (
                            <TableRow
                                key={specialist.userId}
                                hover
                                onClick={() => navigate(`/administrator/manage-appointments/${specialist.userId}`)}
                            >
                                <TableCell>{specialist.userId}</TableCell>
                                <TableCell>{specialist.userFullName}</TableCell>
                                <TableCell>{specialist.specialityName}</TableCell>
                                <TableCell>{specialist.userEmail}</TableCell>
                                <TableCell>{specialist.userPhone}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}