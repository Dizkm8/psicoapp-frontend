import * as React from 'react';
import {
    TextField,
    Link,
    Box,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Typography,
    Button,
    DialogActions, CardActions, CardHeader, CardContent
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import ArticleIcon from '@mui/icons-material/Article';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LabelIcon from '@mui/icons-material/Label';
import { PurpleButton } from '../../app/components/PurpleButton';
import { purple } from '@mui/material/colors';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom";
import agent from '../../app/api/agent';
import Grid from "@mui/material/Grid";

export default function FeedPostForm()
{
    const { control, handleSubmit, formState: { isSubmitting, errors, isValid } } = useForm({mode: 'onTouched'});
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    return (
        <>
        <Dialog open={openConfirmation}
                onClose={()=>{setOpenConfirmation(false)}}>
            <DialogTitle id="alert-dialog-title">
                {"¿Está seguro que quiere agregar la noticia?"}
            </DialogTitle>
            <DialogActions>
                <Button onClick={()=>{setOpenConfirmation(false)}}>Cancelar</Button>
                <Button onClick={()=>{setOpenConfirmation(false)}} autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
        <Grid container component="main"
              spacing={0}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '100vh' }}>
            <Card sx={{width: '75%'}}>
                <CardContent>
                    <Card sx={{color: 'white', bgcolor: 'gray', my: 2}}>
                        <Typography align="center" sx={{my: 2, fontWeight: 'bold' }} variant="h4">Nueva Noticia</Typography>
                    </Card>
                    <Stack>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <TitleIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Título</Typography>
                            </Box>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) =>
                                    <TextField margin="dense"
                                               sx={{mt: 0.5 }}
                                               fullWidth
                                               autoComplete="title"
                                               error={!!errors.title}
                                               helperText={errors?.title?.message as string}
                                               {...field} />}
                                rules={{required: 'Campo obligatorio'}}
                            />
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <ArticleIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Contenido</Typography>
                                </Box>
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="dense"
                                                   fullWidth
                                                   multiline
                                                   rows={7}
                                                   autoComplete="content"
                                                   error={!!errors.content}
                                                   helperText={errors?.content?.message as string}
                                                   {...field} />}
                                    rules={{required: 'Campo obligatorio',
                                        maxLength: {value: 255,
                                            message: 'El largo del contenido no puede exceder los 255 caractéres'}}}
                                />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <LabelIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Etiqueta</Typography>
                                </Box>
                                <Controller
                                    name="tags"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="dense"
                                                   fullWidth
                                                   autoComplete="tags"
                                                   error={!!errors.tags}
                                                   helperText={errors?.tags?.message as string}
                                                   {...field} />}
                                    rules={{required: 'Campo obligatorio'}}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
                <CardActions sx={{ flexDirection: 'row-reverse', m: '2' }}>
                    <Button variant="contained" onClick={()=>{setOpenConfirmation(true)}}> <AddToPhotosIcon sx={{ mr: 1, my: 0.5 }} /> Agregar Noticia</Button>
                </CardActions>
            </Card>
        </Grid>
        </>
    )
}