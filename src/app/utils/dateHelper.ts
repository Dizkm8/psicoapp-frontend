export function getDayOfWeek(date: Date): number
{
    return date.getDay() === 0? 6: date.getDay() - 1;
}
export function getWeekStartDay(date: Date): Date
{
    let result: Date = new Date(date);
    const dayOfWeek =  getDayOfWeek(result);
    result.setDate(result.getDate() - dayOfWeek);
    return result;
}