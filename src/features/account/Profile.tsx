import Typography from "@mui/material/Typography";
import { Box, Grid, Tab, Tabs } from '@mui/material';
import * as React from "react";
import ChangePassword from "./ChangePassword";
import UpdateProfile from "./UpdateProfile";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import User from "../../app/models/User";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { toast } from "react-toastify";

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User>();
    const [value, setValue] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        setLoading(true);
        agent.Users.getProfileInformation()
            .then((response) => {
                setLoading(true);
                setUser(response);
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


    return (
        <>
            <Box sx={{ width: '100%' }} >
                <Grid container component="main"
                    spacing={0}
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box sx={{ width: '75%', bgcolor: 'background.paper', mt: 3 }}>
                        <Tabs value={value} onChange={handleTabChange}>
                            <Tab label="Perfil" />
                            <Tab label="Contraseña" />
                        </Tabs>
                    </Box>
                </Grid>
                <Box role="tabpanel" hidden={value !== 0}>
                    <UpdateProfile user={user} />
                </Box>
                <Box role="tabpanel" hidden={value !== 1}>
                    <ChangePassword />
                </Box>
            </Box>
        </>
    )
}