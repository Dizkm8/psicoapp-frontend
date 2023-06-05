import {Box, Button, Card, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";

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
        <Box>
            <Card>
                <Typography>
                    {startDate.toLocaleDateString('es-CL') + ' -> ' +
                    endDate.toLocaleDateString('es-CL')}
                </Typography>
            </Card>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Horario</TableCell>
                        <TableCell>Lunes</TableCell>
                        <TableCell>Martes</TableCell>
                        <TableCell>Miercoles</TableCell>
                        <TableCell>Jueves</TableCell>
                        <TableCell>Viernes</TableCell>
                        <TableCell>Sábado</TableCell>
                        <TableCell>Domingo</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dayHours.map((hour) => {
                        return (
                            <TableRow>
                                <TableCell> {`${hour}:00`} </TableCell>
                                {weekDays.map((day) => {
                                    let cellDate: Date = new Date(startDate);
                                    cellDate.setDate(startDate.getDate() + day);
                                    cellDate.setHours(hour,0,0,0);

                                    let isOnRange: boolean = (new Date(cellDate).setHours(0,0,0) <= Date.now()
                                        || maximumDate.getTime() <= new Date(cellDate).setHours(0,0,0));
                                    return (
                                        <TableCell key={cellDate.toISOString()}>
                                            <Button
                                                onClick={() => onClick(day, hour, cellDate)}
                                                disabled={occupiedDates.includes(cellDate.toISOString()) ||
                                                    isOnRange}
                                                variant="contained"
                                                color={selectedDates[hour][day]? 'success': 'primary'}
                                            />
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