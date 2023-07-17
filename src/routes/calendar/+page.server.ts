import { getServerSession } from '@supabase/auth-helpers-sveltekit';

import { PRIVATE_gmail_private_key } from '$env/static/private';

import content from './events.json';

import type { PageServerLoad } from './$types';

import { google } from 'googleapis';

export const load: PageServerLoad = async (event) => {
	try {
		// const { privateKey } = JSON.parse(PRIVATE_gmail_private_key);
		// const authClient = new google.auth.JWT(
		// 	'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
		// 	null,
		// 	privateKey,
		// 	['https://www.googleapis.com/auth/calendar'],
		// 	'usersup@9takes.com'
		// );

		// // await populateEvents(authClient);

		// const calendar = google.calendar({ version: 'v3', auth: authClient });

		// const res = await calendar.events.list({
		// 	calendarId: 'primary' // 'dXNlcnN1cEA5dGFrZXMuY29t'
		// });
		// console.log(res);

		return {
			// events: res.data,
			session: await getServerSession(event)
		};
	} catch (e) {
		console.log(e);
	}
};

import type { Actions } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	addEvent: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const summary: string = body.summary as string;
		const location: string = body.location as string;
		const description: string = body.description as string;
		const start: string = body.start as string;
		const end: string = body.end as string;
		const attendees: string = body.attendees as string;

		const event = {
			summary,
			location,
			description,
			start: {
				dateTime: start,
				timeZone: 'America/Los_Angeles'
			},
			end: {
				dateTime: end,
				timeZone: 'America/Los_Angeles'
			},
			attendees: attendees.split(',').map((e) => {
				return {
					email: e
				};
			})
			// [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }]
		};

		try {
			const { privateKey } = JSON.parse(PRIVATE_gmail_private_key);
			const authClient = new google.auth.JWT(
				'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
				null,
				privateKey,
				['https://www.googleapis.com/auth/calendar'],
				'usersup@9takes.com'
			);

			const calendar = google.calendar({ version: 'v3', auth: authClient });

			const createdEvent = await calendar.events.insert({
				calendarId: 'primary',
				requestBody: event
			});

			console.log('Event created successfully: ', createdEvent.data.htmlLink);
		} catch (e) {
			throw error(404, {
				message: `Failed to insert email, ${JSON.stringify(e)}`
			});
		}
	}
};
const populateEvents = async (auth: any) => {
	// content
	const allContent = [];
	const contentCalendar = content?.contentCalendar;
	for (const [date, info] of Object.entries(contentCalendar)) {
		const eventDate = new Date(date);

		const eventStartTime = new Date(eventDate);
		const eventEndTime = new Date(eventDate);
		eventEndTime.setHours(eventEndTime.getHours() + 1); // assuming event duration is 1 hour

		const eventDescriptions = info.posts
			.map((post, index) => `<a href="${post}">${info.people[index]}</a>`)
			.join(', ');
		const event = {
			summary: `${info.category}: ${info.people.join(', ')}`,
			location: 'Online',
			description: eventDescriptions,
			start: {
				dateTime: eventStartTime.toISOString(),
				timeZone: 'America/Los_Angeles'
			},
			end: {
				dateTime: eventEndTime.toISOString(),
				timeZone: 'America/Los_Angeles'
			}
			// attendees: []
		};
		// await createEvent(event, auth);
	}
};

const createEvent = async (
	event: {
		summary: string;
		location: string;
		description: string;
		start: any;
		end: any;
		// attendees: string[];
	},
	auth: any
) => {
	// const event = {
	// 	summary,
	// 	location,
	// 	description,
	// 	start: {
	// 		dateTime: start,
	// 		timeZone: 'America/Los_Angeles'
	// 	},
	// 	end: {
	// 		dateTime: end,
	// 		timeZone: 'America/Los_Angeles'
	// 	},
	// 	attendees: attendees.split(',').map((e) => {
	// 		return {
	// 			email: e
	// 		};
	// 	})
	// 	// [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }]
	// };

	try {
		const calendar = google.calendar({ version: 'v3', auth: auth });

		const createdEvent = await calendar.events.insert({
			calendarId: 'primary',
			requestBody: event
		});

		console.log('Event created successfully: ', createdEvent.data.htmlLink);
	} catch (e) {
		throw error(404, {
			message: `Failed to insert email, ${JSON.stringify(e)}`
		});
	}
};

const makeBody = ({
	toEmails,
	fromEmail,
	subject,
	message
}: {
	toEmails: string[];
	fromEmail: string;
	subject: string;
	message: string;
}) => {
	const str = [
		'Content-Type: text/html; charset="UTF-8"\n',
		'MIME-Version: 1.0\n',
		'Content-Transfer-Encoding: 7bit\n',
		`to: ${toEmails.join(',')}\n`,
		`from: ${fromEmail}\n`,
		`subject: ${subject}\n\n`,
		message
	].join('');

	return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
};

const sendEmail = async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
	try {
		const { privateKey } = JSON.parse(PRIVATE_gmail_private_key);
		const authClient = new google.auth.JWT(
			'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
			null,
			privateKey,
			['https://www.googleapis.com/auth/gmail.send'],
			'usersup@9takes.com'
		);
		const gmail = google.gmail({
			auth: authClient,
			version: 'v1'
		});

		return await gmail.users.messages.send({
			requestBody: {
				raw: makeBody({ toEmails: [to], fromEmail: 'usersup@9takes.com', subject, message: body })
			},
			userId: 'me'
		});
	} catch (e) {
		throw error(404, {
			message: `Failed send email, ${JSON.stringify(e)}`
		});
	}
};
