import {Outlet, Navigate} from 'react-router-dom'
import {useSelector} from "react-redux";
import {selectName, selectRole} from "../../features/account/accountSlice";
interface Props {
    role?: number | number[];
}
export default function RequireAuth({role}: Props)
{
    const userRole: number | null = useSelector(selectRole);
    if(!userRole)
        return <Navigate to={"/login"}/>
    if (!role || (Array.isArray(role) && role.includes(userRole)) || role === userRole)
        return <Outlet/>
    return <Navigate to={"/home"}/>
}