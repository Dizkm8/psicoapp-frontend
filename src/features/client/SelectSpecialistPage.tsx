import Specialist from "../../app/models/Specialist";
import BentoItemProperties from "../../app/interfaces/BentoItemProperties";
import BentoGrid from "../../app/components/BentoGrid";
import * as React from "react";
import {useNavigate} from "react-router-dom";

export default function SelectSpecialistPage(){
    const navigate = useNavigate();

    function convertSpecialistData(specialist: Specialist){

        let result: BentoItemProperties = {
            key: specialist.id,
            children: undefined,
            title: specialist.fullName,
            subtitle: specialist.speciality,
            onClick: ()=>{console.log(result.title); navigate('/home');}
        };
        return result;
    };

    const rawData = [
        {id: '29', fullName: 'José Manuel Alcayaga Marín', speciality: 'Clínica'},
        {id: '20', fullName: 'David Nahum Araya Cádiz', speciality: 'Judicial'},
        {id: '21', fullName: 'Manuel Vera', speciality: 'Judicial'},
        {id: '22', fullName: 'David Zeballos', speciality: 'Judicial'},
    ];

    const data = rawData.map(entry => convertSpecialistData(entry));

    return(<BentoGrid bentoItems={data} />);
}