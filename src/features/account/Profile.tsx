import Typography from "@mui/material/Typography";
import * as React from "react";
import ChangePassword from "./ChangePassword";
import PermanentDrawerLeft from "../../app/components/Layout";

export default function Profile()
{
    return (
        <>
            <PermanentDrawerLeft />
            <ChangePassword/>
        </>
    )
}