import { Button, ButtonProps, styled } from "@mui/material";
import { purple } from "@mui/material/colors";

const color = purple[500];
const onHoverColor = purple[700];

export const PurpleButton = styled(Button)<ButtonProps>(({ theme }) => {
    return ({
        color: theme.palette.getContrastText(color),
        backgroundColor: color,
        '&:hover': {
            backgroundColor: onHoverColor,
        },
    });
});