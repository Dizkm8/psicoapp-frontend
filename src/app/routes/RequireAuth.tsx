import {Outlet, Navigate} from 'react-router-dom'
interface Props {
    role?: string;
}

export default function RequireAuth({role}: Props)
{
    const token: string | null = localStorage.getItem("token");
    if(!(!!token))
        return <Navigate to={"/login"}/>
    return <Outlet/>
}