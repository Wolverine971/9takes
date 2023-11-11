import { supabase } from '$lib/supabase';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const body = Object.fromEntries(await request.formData());
		const fingerprint = body.fingerprint as string;

		const { data: addedVisitor, error: addedVisitorsError } = await supabase
			.from('visitors')
			.upsert({ fingerprint, updated_at: new Date() }, { onConflict: 'fingerprint' })
			.select()

		if (addedVisitorsError) {
			console.log(addedVisitorsError);
		}

		return json(addedVisitor);

	} catch (e) {
		throw error(400, {
			message: `encountered error`
		});
	}
}



