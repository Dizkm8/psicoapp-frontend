import Typography from "@mui/material/Typography";
import {Box, Grid, Tab, Tabs} from '@mui/material';
import * as React from "react";
import ChangePassword from "./ChangePassword";
import PermanentDrawerLeft from "../../app/components/Layout";
import UpdateProfile from "./UpdateProfile";

export default function Profile()
{
    const [value, setValue] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%' }} >
                <Grid container component="main"
                      spacing={0}
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                >
                    <Box sx={{ width: '75%', bgcolor: 'background.paper', mt: 3}}>
                        <Tabs value={value} onChange={handleTabChange}>
                            <Tab label="Perfil" />
                            <Tab label="Contraseña" />
                        </Tabs>
                    </Box>
                </Grid>
                <Box role="tabpanel" hidden={value !== 0}>
                    <UpdateProfile/>
                </Box>
                <Box role="tabpanel" hidden={value !== 1}>
                    <ChangePassword/>
                </Box>
            </Box>
        </>
    )
}