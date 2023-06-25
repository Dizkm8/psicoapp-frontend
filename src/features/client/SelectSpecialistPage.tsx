import SpecialistInfo from "../../app/models/SpecialistInfo";
import BentoItemProperties from "../../app/interfaces/BentoItemProperties";
import BentoGrid from "../../app/components/BentoGrid";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import PaginationBar from "../../app/components/PaginationBar";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function SelectSpecialistPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [specialists, setSpecialists] = useState<SpecialistInfo[]>([]);
    const [itemsPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1);

    function convertSpecialistData(specialist: SpecialistInfo){

        let result: BentoItemProperties = {
            key: specialist.id,
            children: undefined,
            title: specialist.fullName,
            subtitle: specialist.speciality,
            onClick: ()=>{navigate(`/client/select/${specialist.id}`);},
        };
        return result;
    };

    const rawData = [
        { id: '29', fullName: 'José Manuel Alcayaga Marín', speciality: 'Clínica' },
        { id: '207676918', fullName: 'David Nahum Araya Cádiz', speciality: 'Judicial' },
        { id: '21', fullName: 'Manuel Vera', speciality: 'Judicial' },
        { id: '22', fullName: 'David Zeballos', speciality: 'Judicial' },
        { id: '39', fullName: 'José Manuel Alcayaga Marín', speciality: 'Clínica' },
        { id: '30', fullName: 'David Nahum Araya Cádiz', speciality: 'Judicial' },
        { id: '31', fullName: 'Manuel Vera', speciality: 'Judicial' },
        { id: '32', fullName: 'David Zeballos', speciality: 'Judicial' },
        { id: '49', fullName: 'José Manuel Alcayaga Marín', speciality: 'Clínica' },
        { id: '40', fullName: 'David Nahum Araya Cádiz', speciality: 'Judicial' },
        { id: '41', fullName: 'Manuel Vera', speciality: 'Judicial' },
        { id: '42', fullName: 'David Zeballos', speciality: 'Judicial' },
      ];

    if (loading) return <LoadingComponent message='Cargando información...' />

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const slicedData = rawData.slice(firstItemIndex, lastItemIndex);

    //convert the raw data into the correct format
    const data = slicedData.map(entry => convertSpecialistData(entry));

    const handlePageChange = (currentPage: React.SetStateAction<number>) => {
        setCurrentPage(currentPage);
      };



    return(
        <div>
        <PaginationBar
          itemsPerPage={itemsPerPage}
          TotalPages={Math.ceil(rawData.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
        <BentoGrid bentoItems={data} />
      </div>
    );
}