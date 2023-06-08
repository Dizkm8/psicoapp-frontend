import {Box, Button, Card, Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import CheckIcon from '@mui/icons-material/Check';

const weekDays = Array.from(Array(7).keys());
const dayHours = Array.from(Array(12).keys()).map((hour) => hour+8);
interface Props
{
    startDate: Date,
    occupiedDates: string[],
    selectedDates: boolean[][],
    onClick: (day: number, hour: number, date: Date) => void
}
export default function WeekPicker({startDate, occupiedDates, selectedDates, onClick}: Props)
{
    let endDate: Date = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    let maximumDate: Date = new Date(Date.now());
    maximumDate.setMonth(maximumDate.getMonth() + 2);

    return (
        <Box
            sx={{
                maxWidth:'70%',
                display: 'grid',
                gridTemplateRows: 'repeat(1, 1fr)',
                justifyItems: 'center'
            }}>
            <Paper
                sx={{
                    maxWidth:'60%',
                    height: 60,
                    m: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'lightgrey'
                }}>
                <Typography align="center" variant="h6" sx={{mx: 2}}>
                    {startDate.toLocaleDateString('es-CL') + ' 🠚 '
                    + endDate.toLocaleDateString('es-CL')}
                </Typography>
            </Paper>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Horario</TableCell>
                        <TableCell align="center">Lunes</TableCell>
                        <TableCell align="center">Martes</TableCell>
                        <TableCell align="center">Miercoles</TableCell>
                        <TableCell align="center">Jueves</TableCell>
                        <TableCell align="center">Viernes</TableCell>
                        <TableCell align="center">Sábado</TableCell>
                        <TableCell align="center">Domingo</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dayHours.map((hour) => {
                        return (
                            <TableRow>
                                <TableCell align="center"> {`${hour}:00`} </TableCell>
                                {weekDays.map((day) => {
                                    let cellDate: Date = new Date(startDate);
                                    cellDate.setDate(startDate.getDate() + day);
                                    cellDate.setHours(hour,0,0,0);

                                    let isOnRange: boolean = (new Date(cellDate).setHours(0,0,0) <= Date.now()
                                        || maximumDate.getTime() <= new Date(cellDate).setHours(0,0,0));
                                    return (
                                        <TableCell align="center" key={cellDate.toISOString()}>
                                            <Button
                                                onClick={() => onClick(day, hour, cellDate)}
                                                disabled={occupiedDates.includes(cellDate.toISOString().split('.')[0]) ||
                                                    isOnRange}
                                                variant="contained"
                                                color={selectedDates[hour][day]? 'success': 'primary'}
                                            >
                                                {selectedDates[hour][day] ? <CheckIcon /> : '‎'}
                                            </Button>
                                        </TableCell>
                                    );}
                                )}
                            </TableRow>
                        );}
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}