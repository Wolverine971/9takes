// src/routes/admin/links/+page.server.ts
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

	if (!session?.user?.id) {
		throw redirect(307, '/questions');
	}
	const { data: userResp, error: findUserError } = await supabase
		.from('profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	if (findUserError) {
		console.log('findUserError', findUserError);
	} else if (userResp?.admin) {
		const { data: link_drops, error: linkDropsError } = await supabase
			.from('link_drops')
			.select('*,  addresses(*), questions(*)');

		if (linkDropsError) {
			console.log('linkDropsError', linkDropsError);
		}
		const linkDrops = link_drops as unknown as LinkDrops;

		return { linkDrops };
	}
	throw redirect(307, '/questions');
};

export const actions: Actions = {};

interface LinkDrops {
	id: number;
	created_at: string;
	question_id: number;
	address_id: number;
	number_of_drops: number;
	number_of_hits: number;
	external_id: string;
	addresses: Addresses;
	questions: Questions;
}

interface Questions {
	id: number;
	question: string;
	created_at: string;
	updated_at: string;
	data?: any;
	name?: any;
	author_id: string;
	context: string;
	url: string;
	img_url: string;
	es_id: string;
	comment_count: number;
	tagged: boolean;
	flagged: boolean;
	question_formatted: string;
	removed: boolean;
}

interface Addresses {
	id: number;
	created_at: string;
	updated_at?: any;
	address_line_1: string;
	address_line_2?: any;
	city: string;
	state: string;
	postal_code: string;
	latitude: number;
	longitude: number;
	name: string;
	extra_details: Extradetail[];
	country: string;
}

interface Extradetail {
	types: string[];
	long_name: string;
	short_name: string;
}
