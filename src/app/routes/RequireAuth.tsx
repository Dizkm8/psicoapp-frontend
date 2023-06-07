import {Outlet, Navigate} from 'react-router-dom'
import User from "../models/User";
import {useSelector} from "react-redux";
import {selectUser} from "../../features/account/accountSlice";
interface Props {
    role?: number;
}

export default function RequireAuth({role}: Props)
{
    const user: User = useSelector(selectUser);
    if(!user.id)
        return <Navigate to={"/login"}/>
    if(!role || (role && role === user.role))
        return <Outlet/>
    return <Navigate to={"/home"}/>
}