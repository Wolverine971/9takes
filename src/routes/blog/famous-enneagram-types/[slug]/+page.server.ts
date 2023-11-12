import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { supabase } from '$lib/supabase';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
const MAX_POSTS = 20;

export const load: PageServerLoad = async (event: any) => {
	const session = await getServerSession(event);
	const user = session?.user;
	const slug = event.params.slug;
	const cookie = event.cookies.get('9tfingerprint');

	let userHasAnswered = false;

	if (user?.id) {
		const { data: hasUserCommented, error: hasUserCommentedError } = await supabase
			.from('blog_comments')
			.select('id')
			.eq('blog_link', slug)
			.eq('author_id', user?.id);

		userHasAnswered = hasUserCommented?.length ? true : false;
	} else {
		const ipAddress = event.getClientAddress();
		const { data: hasCommented, error: hasCommentedError } = await supabase
			.from('blog_comments')
			.select('id')
			.eq('blog_link', slug)
			.eq('fingerprint', cookie)
			// .eq('ip', ipAddress);

		userHasAnswered = hasCommented?.length ? true : false;
	}

	let comments: any[] = [];
	if (userHasAnswered) {
		const { data: blogComments, error: blogCommentsError } = await supabase
			.from('blog_comments')
			.select('*')
			.eq('blog_link', slug)
			.limit(100);

		if (blogCommentsError) {
			console.log(blogCommentsError);
		}
		comments = blogComments || [];
	}

	return {
		user,
		flags: {
			userHasAnswered: userHasAnswered,
			userSignedIn: event?.locals?.session?.user?.aud
		},
		comments
	};
};
