import SpecialistInfo from "../../app/models/SpecialistInfo";
import BentoItemProperties from "../../app/interfaces/BentoItemProperties";
import BentoGrid from "../../app/components/BentoGrid";
import * as React from "react";
import {useNavigate} from "react-router-dom";

export default function SelectSpecialistPage(){
    const navigate = useNavigate();

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
        {id: '29', fullName: 'José Manuel Alcayaga Marín', speciality: 'Clínica'},
        {id: '207676918', fullName: 'David Nahum Araya Cádiz', speciality: 'Judicial'},
        {id: '21', fullName: 'Manuel Vera', speciality: 'Judicial'},
        {id: '22', fullName: 'David Zeballos', speciality: 'Judicial'},
    ];

    const data = rawData.map(entry => convertSpecialistData(entry));

    return(<BentoGrid bentoItems={data} />);
}