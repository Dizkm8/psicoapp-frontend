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
    DialogActions
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import ArticleIcon from '@mui/icons-material/Article';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LabelIcon from '@mui/icons-material/Label';
import { PurpleButton } from '../../app/models/PurpleButton';
import { purple } from '@mui/material/colors';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom";
import agent from '../../app/api/agent';

export default function FeedPostForm()
{
    const { control, handleSubmit, formState: { isSubmitting, errors, isValid } } = useForm({mode: 'onTouched'});

    return (
        <>
            <Dialog open={true} fullWidth sx={{m: 2}}>
                <DialogTitle>
                    <Card sx={{bgcolor: 'gray'}}>
                        <Typography align="center" sx={{my: 2, fontWeight: 'bold' }} variant="h4">Nueva Noticia</Typography>
                    </Card>
                </DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button variant="contained"> <AddToPhotosIcon sx={{ mr: 1, my: 0.5 }} /> Agregar Noticia</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}