import { Grid } from "@mui/material";
import BentoItemProperties from "../interfaces/BentoItemProperties";
import BentoItem from "./BentoItem";

interface Props {
    bentoItems: BentoItemProperties[],
    onShowMore?: () => void
}

export default function BentoGrid({bentoItems, onShowMore}: Props){
    return (
        <Grid
            container
            spacing={4}
            sx={{m: 4, width: 'auto'}}
        >
            {bentoItems.map((entry) => {
                return (
                    <Grid
                        key={entry.key}
                        item
                        zeroMinWidth
                        xs={12}
                        md={6}
                        lg={4}
                    >
                        <BentoItem {...entry} />
                    </Grid>
                );
            })}
    </Grid >
    );
}