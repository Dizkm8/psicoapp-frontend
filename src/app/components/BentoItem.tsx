import React from "react";
import {ButtonBase, Card, Paper, Typography} from "@mui/material";
import BentoItemProperties from "../interfaces/BentoItemProperties";
import {purple} from "@mui/material/colors";

export default function BentoItem({children, title, subtitle, onClick}: BentoItemProperties){
    return(
        <ButtonBase sx={{width: '100%'}} onClick={onClick}>
            <Paper sx={{width: '100%', height: '19em'}}>
                <Card sx={{color: 'white', bgcolor: purple[400], m: 3}}>
                    <Typography
                        align="center"
                        sx={{m: 2}}
                        variant="h6"
                        noWrap
                    >
                        {title}
                    </Typography>
                </Card>
                <Typography sx={{m: 3}} align="right">
                    {subtitle}
                </Typography>
                {children}
            </Paper>
        </ButtonBase>
    );
}