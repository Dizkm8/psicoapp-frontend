export function getDayOfWeek(date: Date): number
{
    return date.getDay() === 0? 6: date.getDay() - 1;
}
export function getWeekStartDay(date: Date): Date
{
    let result: Date = new Date(date);
    const dayOfWeek =  getDayOfWeek(result);
    result.setDate(result.getDate() - dayOfWeek);
    result.setHours(0,0,0,0);
    return result;
}
export function getTimeZone(date: Date): number
{
    let result = - date.getTimezoneOffset() / 60;
    return result;
}