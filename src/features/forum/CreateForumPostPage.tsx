import * as React from 'react';
import {
    TextField,
    Box,
    Card,
    Dialog,
    DialogTitle,
    Stack,
    Typography,
    Button,
    DialogActions, CardActions, CardContent, Select, FormControl, MenuItem, FormHelperText
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import ArticleIcon from '@mui/icons-material/Article';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LabelIcon from '@mui/icons-material/Label';
import { grey, purple } from '@mui/material/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import agent from '../../app/api/agent';
import Grid from "@mui/material/Grid";

import ForumPost from '../../app/models/ForumPost';
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from '@mui/lab';

export default function CreateForumPostPage() {
    const { control, handleSubmit, setError, formState: { isSubmitting, errors, isValid }, reset } = useForm<ForumPost>({ mode: 'onTouched' });
    const [tags, setTags] = useState([]);
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [isFormError, setIsFormError] = useState(false);
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
        return () => {
            toast.dismiss();
        };
    }, []);

    if (loading) return <LoadingComponent message='Cargando información...' />

    const handleSubmitButton: SubmitHandler<ForumPost> = (data: ForumPost) => {
        setOpenConfirmation(false);
        toast.info('El post se está analizando...', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
            toastId: 'info.createFeedPost',
        });
        agent.Forum.createPost(data)
            .then((response) => {
                toast.dismiss();
                toast.success('Post creado correctamente', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    toastId: 'success.createFeedPost',
                });
            })
            .catch(err => {
                setIsFormError(true);
                toast.dismiss();
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
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    toastId: 'error.createFeedPost',
                });
            })
            .finally(() => {
                setIsFormError(false);
            });
        ;
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
                            <Typography align="center" sx={{ my: 2, fontWeight: 'bold' }} variant="h4">Nuevo Post</Typography>
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
                                    rules={{
                                        required: 'Campo obligatorio',
                                        maxLength: {
                                            value: 200,
                                            message: 'El largo del título no puede exceder los 200 caractéres'
                                        }
                                    }}
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
                                                value: 2500,
                                                message: 'El largo del contenido no puede exceder los 2500 caractéres'
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
                                                    {tags.map(({ id, name }) => {
                                                        return <MenuItem value={id}>{name}</MenuItem>
                                                    })
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
                                        {"¿Está seguro que quiere agregar el post?"}
                                    </DialogTitle>
                                    <DialogActions>
                                        <Button
                                            color='error'
                                            onClick={() => { setOpenConfirmation(false) }}
                                        >Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            form="post-form"
                                            autoFocus
                                            variant='contained'
                                            color='success'
                                            onClick={() => { setOpenConfirmation(false) }}
                                        >
                                            Aceptar
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ flexDirection: 'row-reverse', m: '2' }}>
                        <LoadingButton
                            color="secondary"
                            variant="contained"
                            onClick={() => { setOpenConfirmation(true) }}
                        >
                            <AddToPhotosIcon
                                sx={{ mr: 1, my: 0.5 }}
                            />
                            Agregar Post
                        </LoadingButton>

                        <Button
                            color='error'
                            variant="contained"
                            onClick={() => { navigate('/forum');}}
                            sx={{ marginRight: 'auto' }} // Agrega esta línea
                        >
                            Volver
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}
