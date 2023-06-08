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
    DialogActions, CardActions, CardHeader, CardContent, Select, FormControl, MenuItem, FormHelperText
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import ArticleIcon from '@mui/icons-material/Article';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LabelIcon from '@mui/icons-material/Label';
import { PurpleButton } from '../../app/components/PurpleButton';
import { grey, purple } from '@mui/material/colors';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom";
import agent from '../../app/api/agent';
import Grid from "@mui/material/Grid";

import { login } from "../account/accountSlice";
import FeedPost from "../../app/models/FeedPost";
import { toast } from "react-toastify";
import {useEffect, useState} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import User from "../../app/models/User";

export default function FeedPostForm() {
    const { control, handleSubmit, setError, formState: { isSubmitting, errors, isValid }, reset } = useForm<FeedPost>({ mode: 'onTouched' });
    const [tags, setTags] = useState([]);
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        agent.Tags.getTags()
            .then((response) => {
                setLoading(true);
                setTags(response);
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

    const handleSubmitButton: SubmitHandler<FeedPost> = (data: FeedPost) => {
        setOpenConfirmation(false)
        agent.Feed.createPost(data)
            .then(response => {
                navigate("/home");
            })
            .catch(err => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        error = 'El título y/o contenido no cumple con las reglas de publicación.';
                        break;
                    case 404:
                        setError('tagId', { type: 'custom', message: 'Se ha seleccionado una etiqueta inválida.' });
                        return;
                    case 500:
                        error = 'Ha ocurrido un problema interno. Intente nuevamente.'
                        break;
                    default:
                        break;

                }
                toast.error(error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                });
            });
    };

    return (
        <>
            <Grid container component="main"
                spacing={0}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    mt: 3,
                }}>
                <Card sx={{ width: '75%', backgroundColor: grey[50], }}>
                    <CardContent>
                        <Card sx={{ color: 'white', bgcolor: purple[400], my: 2 }}>
                            <Typography align="center" sx={{ my: 2, fontWeight: 'bold' }} variant="h4">Nueva Noticia</Typography>
                        </Card>
                        <Stack>
                            <Box component="form"
                                id="post-form"
                                noValidate
                                onSubmit={handleSubmit(handleSubmitButton)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <TitleIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Título</Typography>
                                </Box>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField margin="dense"
                                            sx={{
                                                mt: 0.5,
                                                backgroundColor: 'white',
                                            }}
                                            fullWidth
                                            autoComplete="title"
                                            error={!!errors.title}
                                            helperText={errors?.title?.message as string}
                                            {...field} />}
                                    rules={{ required: 'Campo obligatorio' }}
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
                                                sx={{
                                                    backgroundColor: 'white',
                                                }}
                                                fullWidth
                                                multiline
                                                rows={7}
                                                autoComplete="content"
                                                error={!!errors.content}
                                                helperText={errors?.content?.message as string}
                                                {...field} />}
                                        rules={{
                                            required: 'Campo obligatorio',
                                            maxLength: {
                                                value: 255,
                                                message: 'El largo del contenido no puede exceder los 255 caractéres'
                                            }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <LabelIcon sx={{ mr: 1, my: 0.5 }} /> <Typography variant="h6">Etiqueta</Typography>
                                    </Box>
                                    <FormControl fullWidth error={!!errors.tagId} sx={{
                                                backgroundColor: 'white',
                                            }}>
                                        <Controller
                                            name="tagId"
                                            control={control}
                                            defaultValue={1}
                                            render={({ field }) =>
                                                <Select {...field}>
                                                    { tags.map(({id, name}) => {
                                                    return <MenuItem value={id}>{name}</MenuItem> })
                                                    }
                                                </Select>
                                            }
                                            rules={{ required: 'Campo obligatorio' }}
                                        />
                                        <FormHelperText>{errors?.tagId?.message as string}</FormHelperText>
                                    </FormControl>
                                </Box>
                                <Dialog open={openConfirmation}
                                    onClose={() => { setOpenConfirmation(false) }}>
                                    <DialogTitle id="alert-dialog-title">
                                        {"¿Está seguro que quiere agregar la noticia?"}
                                    </DialogTitle>
                                    <DialogActions>
                                        <Button onClick={() => { setOpenConfirmation(false) }}>Cancelar</Button>
                                        <Button type="submit" form="post-form" autoFocus>
                                            Aceptar
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ flexDirection: 'row-reverse', m: '2' }}>
                        <PurpleButton variant="contained" onClick={() => { setOpenConfirmation(true) }}> <AddToPhotosIcon sx={{ mr: 1, my: 0.5 }} /> Agregar Noticia</PurpleButton>
                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}