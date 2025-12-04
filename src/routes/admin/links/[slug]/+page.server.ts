// src/routes/admin/links/[slug]/+page.server.ts
import { PRIVATE_GOOGLE_MAPS_API_KEY } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

	let user = null;
	if (session?.user?.id) {
		const { data: userResp, error: findUserError } = await supabase
			.from('profiles')
			.select('id, admin, external_id')
			.eq('id', session?.user?.id)
			.single();

		if (findUserError) {
			console.log('findUserError', findUserError);
		}
		user = userResp;
	}

	const { data: linkDrop, error: linkDropError } = await supabase
		.from('link_drops')
		.select('*,  addresses(*), questions(*)')
		.eq('external_id', event.params.slug)
		.single();

	if (linkDropError) {
		console.log('linkDropError', linkDropError);
	}

	if (!user?.admin) {
		if (linkDrop) {
			const { data: question, error: questionError } = await supabase
				.from('questions')
				.select('*')
				.eq('id', linkDrop.question_id)
				.single();

			if (questionError) {
				console.log(questionError);
				throw redirect(307, '/questions');
			} else {
				await supabase.rpc('increment_link_hit', {
					link_id: linkDrop.id
				});
				throw redirect(301, `/questions/${question.url}`);
			}
		} else {
			throw redirect(307, '/questions');
		}
	} else {
		// need to create link find question via elastic search
		if (!linkDrop) {
			return {
				linkDrop
			};
		} else {
			const { data: question, error: questionError } = await supabase
				.from('questions')
				.select('*')
				.eq('id', linkDrop.question_id)
				.single();

			if (questionError) {
				console.log(questionError);
			} else {
				return {
					linkDrop,
					question,
					linkError: questionError
				};
			}
		}
	}
};

export const actions: Actions = {
	submitLinkDrop: async ({ request, params, locals }) => {
		try {
			const session = locals.session;
			const supabase = locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			if (session?.user?.id) {
				const { data: userResp, error: findUserError } = await supabase
					.from('profiles')
					.select('id, admin, external_id')
					.eq('id', session?.user?.id)
					.single();

				if (findUserError || !userResp?.admin) {
					throw error(400, 'unauthorized');
				}
			}

			const body = Object.fromEntries(await request.formData());
			const lat = body.lat;
			const lng = body.lng;
			const selectedQuestionURL = body.selectedQuestionURL;

			const resp = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${PRIVATE_GOOGLE_MAPS_API_KEY}`
			);

			const jsonResp = await resp.json();

			const extraInfo = jsonResp.results[0].address_components;
			const { data: address, error: addressError } = await supabase
				.from('addresses')
				.upsert(
					{
						address_line_1: jsonResp.results[0].address_components
							.filter(
								(item: any) => item.types.includes('street_number') || item.types.includes('route')
							)
							.map((item: any) => item?.long_name || item?.short_name)
							.join(' '),
						address_line_2: jsonResp.results[0].address_components.filter((item: any) =>
							item.types.includes('subpremise')
						)[0]?.long_name,
						city: jsonResp.results[0].address_components.filter((item: any) =>
							item.types.includes('locality')
						)[0]?.long_name,
						state: jsonResp.results[0].address_components.filter((item: any) =>
							item.types.includes('administrative_area_level_1')
						)[0]?.long_name,
						postal_code: jsonResp.results[0].address_components.filter((item: any) =>
							item.types.includes('postal_code')
						)[0]?.long_name,
						country: jsonResp.results[0].address_components.filter((item: any) =>
							item.types.includes('country')
						)[0].short_name,
						latitude: body.lat,
						longitude: body.lng,
						name: jsonResp.results[0].formatted_address,
						extra_details: extraInfo
					},
					{ onConflict: 'name' }
				)
				.select()
				.single();

			if (addressError) {
				console.log('addy error', addressError);
			}

			const { data: question, error: questionError } = await supabase
				.from('questions')
				.select('*')
				.eq('url', selectedQuestionURL)
				.single();

			if (questionError || !question) {
				console.log('questionError', questionError);
			}

			const { data: linkDrop, error: linkDropError } = await supabase
				.from('link_drops')
				.upsert({ external_id: params.slug, question_id: question?.id, address_id: address?.id })
				.select()
				.single();

			if (linkDropError) {
				console.log(linkDropError);
			}

			return linkDrop;
		} catch (e) {
			console.log(e);
			return null;
		}
	},

	updateLinkDrop: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const supabase = locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			if (session?.user?.id) {
				const { data: userResp, error: findUserError } = await supabase
					.from('profiles')
					.select('id, admin, external_id')
					.eq('id', session?.user?.id)
					.single();

				if (findUserError || !userResp?.admin) {
					throw error(400, 'unauthorized');
				}
			}

			const body = Object.fromEntries(await request.formData());
			const selectedQuestionURL = body.selectedQuestionURL;
			const linkDropExternalId = body.linkDropExternalId;

			const { data: question, error: questionError } = await supabase
				.from('questions')
				.select('*')
				.eq('url', selectedQuestionURL)
				.single();

			if (questionError || !question) {
				console.log('questionError', questionError);
			}

			const { data: linkDrop, error: linkDropError } = await supabase
				.from('link_drops')
				.update({ question_id: question?.id })
				.eq('external_id', linkDropExternalId)
				.select()
				.single();

			if (linkDropError) {
				console.log('linkDropError', linkDropError);
			}

			return linkDrop;
		} catch (e) {
			console.log(e);
			return null;
		}
	}
};
