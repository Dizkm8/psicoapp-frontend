import {Controller, FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";
import LoadingComponent from "../../app/layout/LoadingComponent";
import Grid from "@mui/material/Grid";
import {
    Box, Button,
    Card, CardActions,
    CardContent, Dialog, DialogActions, DialogTitle,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {grey, purple} from "@mui/material/colors";
import {LoadingButton} from "@mui/lab";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

export default function UpdateRulesPage(){
    const {control, handleSubmit, setError, formState: {isSubmitting, errors, isValid}, setValue} = useForm({ mode: 'onTouched' });
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        agent.Admin.getRule()
            .then((response) => {
                setValue('rules', response);
                setLoading(false);
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

    const handleSubmitButton: SubmitHandler<FieldValues> = (data) => {
        setIsSubmittingForm(true);
        setOpenConfirmation(false);
        agent.Admin.updateRule(data.rules)
            .then(() => {
                toast.success('Regla actualizada correctamente', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    toastId: 'success.updateRule',
                });
                navigate('/home');
            })
            .catch(err => {
                let error: string = "Ha habido un error. Intente nuevamente.";
                switch (err.status) {
                    case 400:
                        setError('rules', { type: 'maxLength', message: 'El largo máximo es de 1200 caracteres.' });
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
                });
            })
            .finally(() => {
                setIsSubmittingForm(false);
            });
    };

    return (
        <>
            <Grid container component="main"
                  spacing={0}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  mt={3}
            >
                <Card sx={{width: '75%', backgroundColor: grey[50]}}>
                    <CardContent>
                        <Card sx={{color: 'white', bgcolor: purple[400], my: 2 }}>
                            <Typography align="center" sx={{my: 2, fontWeight: 'bold'}} variant="h4">Actualizar Reglas</Typography>
                        </Card>
                        <Stack>
                            <Box component="form"
                                 id="rules-form"
                                 noValidate
                                 onSubmit={handleSubmit(handleSubmitButton)}
                            >
                                <Controller
                                    name="rules"
                                    control={control}
                                    render={({field}) =>
                                        <TextField margin="dense"
                                                   sx={{
                                                       mt: 0.5,
                                                       backgroundColor: 'white',
                                                   }}
                                                   multiline
                                                   fullWidth
                                                   error={!!errors.rules}
                                                   helperText={errors?.rules?.message as string}
                                                   {...field} />}
                                    rules={{ required: 'Campo obligatorio' }}
                                />
                                <Dialog open={openConfirmation}
                                        onClose={() => {setOpenConfirmation(false)}}>
                                    <DialogTitle id="alert-dialog-title">
                                        {"¿Está seguro que quiere realizar los cambios?"}
                                    </DialogTitle>
                                    <DialogActions>
                                        <Button
                                            color='error'
                                            onClick={() => {setOpenConfirmation(false)}}
                                        >Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            form="rules-form"
                                            autoFocus
                                            variant='contained'
                                            color='success'
                                            onClick={() => {setOpenConfirmation(false)}}
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
                            onClick={() => {setOpenConfirmation(true)}}
                            loading={isSubmittingForm}
                        >
                            <AddToPhotosIcon
                                sx={{ mr: 1, my: 0.5 }}
                            />
                            Aplicar Cambios
                        </LoadingButton>
                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}