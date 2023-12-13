

export const convertDateToReadable = (date: string): string => {
    const dateObj = new Date(date);
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const newdate = month + '/' + day + '/' + year;
    return newdate


}