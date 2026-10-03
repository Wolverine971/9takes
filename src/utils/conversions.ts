// src/utils/conversions.ts
// Keep this module free of the browser Supabase client: it is imported by page
// components only for date formatting, and a client import here pulled all of
// supabase-js (~219KB) into every page that formats a date.

export const convertDateToReadable = (date: string): string => {
	const dateObj = new Date(date);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newdate = month + '/' + day + '/' + year;
	return newdate;
};
