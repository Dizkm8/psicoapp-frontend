import {Outlet, Navigate} from 'react-router-dom'
import {useSelector} from "react-redux";
import {selectRole} from "../../features/account/accountSlice";
interface Props {
    role?: number;
}

export default function RequireAuth({role}: Props)
{
    const userRole: number | null = useSelector(selectRole);
    if(!userRole)
        return <Navigate to={"/login"}/>
    if(!role || (role && role === userRole))
        return <Outlet/>
    return <Navigate to={"/home"}/>
}