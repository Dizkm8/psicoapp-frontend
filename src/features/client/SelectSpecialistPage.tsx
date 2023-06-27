import SpecialistInfo from "../../app/models/SpecialistInfo";
import BentoItemProperties from "../../app/interfaces/BentoItemProperties";
import BentoGrid from "../../app/components/BentoGrid";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import PaginationBar from "../../app/components/PaginationBar";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Typography from "@mui/material/Typography";

export default function SelectSpecialistPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [specialists, setSpecialists] = useState<SpecialistInfo[]>([]);
    const [itemsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1);

    function convertSpecialistData(specialist: SpecialistInfo){

        let result: BentoItemProperties = {
            key: specialist.userId,
            children: undefined,
            title: specialist.userFullName,
            subtitle: specialist.specialityName,
            onClick: ()=>{navigate(`/client/select/${specialist.userId}`);},
        };
        return result;
    };

    useEffect(() => {
        setLoading(true);
        agent.Users.getSpecialists()
            .then((response) => {
                setSpecialists([...response]);
                console.log(response); // Verifica la estructura de los datos recibidos
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

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const slicedData = specialists.slice(firstItemIndex, lastItemIndex);

    //convert the raw data into the correct format
    const data = slicedData.map(entry => convertSpecialistData(entry));

    const handlePageChange = (currentPage: React.SetStateAction<number>) => {
        setCurrentPage(currentPage);
      };



    return(
        data.length === 0?
            <Typography align="center" mt={3} variant="h3">No hay psicólogos para mostrar</Typography>
        :
        <div>
            <BentoGrid bentoItems={data} />
            <PaginationBar
              itemsPerPage={itemsPerPage}
              TotalPages={Math.ceil(specialists.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
      </div>
    );
}