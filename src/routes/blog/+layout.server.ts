// routes/blog/+layout.server.ts

// /** @type {import('./$types').PageLoad} */
// export async function load({
// 	slug,
// 	locals,
// 	session,
// 	params
// }: {
// 	slug: any;
// 	locals: any;
// 	session: any;
// 	params: any;
// }) {
// 	let { data: questionComments, error: questionError } = await supabase
// 		.from('questions')
// 		.select('id, comments(parent_id)')
// 		.eq('url', params.slug);
// 	console.log(questionComments);

// 	return {
// 		flags: {
// 			userHasAnswered: true,
// 			userSignedIn: locals?.session?.user?.aud
// 		}
// 	};
// }
