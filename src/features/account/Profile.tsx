import Typography from "@mui/material/Typography";
import * as React from "react";
import ChangePassword from "./ChangePassword";
import PermanentDrawerLeft from "../../app/components/Layout";
import UpdateProfile from "./UpdateProfile";

export default function Profile()
{
    return (
        <>
            <PermanentDrawerLeft />
            <UpdateProfile/>
            <ChangePassword/>
        </>
    )
}