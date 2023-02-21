import type { Actions, RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
// import { supabase } from '$lib/supabase';
import { stemmer } from 'stemmer';
export const actions: Actions = {
	runExperiment: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		// const { email } = await request.json();
		let emotionsRaw = body.emotions as string;
		let emotions = emotionsRaw.split(',');

		// const { data, error } = await supabase.from('signups').insert([{ email: body.email }]);
		let definitions: string[] = [];
		emotions.forEach((e) => {
			definitions.push(stemmer(e));
		});
		// for await (const emotion of emotions) {
		// 	const def = await wordLookup(emotion);
		// 	definitions.push(def);
		// }
		// if (data) {
		// 	console.log('woot');
		// 	return { success: true };
		// }
		// if (error) {
		// 	console.log(error);
		// 	console.log('fail');
		// }

		return definitions;
		// return new Response(JSON.stringify({ message: 'success', body: JSON.stringify(definitions) }));
		// return {
		// 	body: JSON.stringify({ definitions: definitions })
		// };
	}
};

// import * as natural from 'natural';
// const wordnet = new natural.WordNet(process.env.WORDNET);

// const wordLookup = async (word: string) => {
// 	return wordnet.lookup(word, (results) => {
// 		console.log(word);
// 		const formattedResults = results.map((result) => {
// 			return {
// 				rootWord: word,
// 				synsetOffset: result.synsetOffset,
// 				pos: result.pos,
// 				lemma: result.lemma,
// 				synonyms: result.synonyms,
// 				gloss: result.gloss
// 			};

// 			//   // console.log(synsetOffset)
// 			//   // console.log(result.pos)
// 			//   // console.log(result.lemma)
// 			//   // console.log(result.synonyms)
// 			//   // console.log(result.pos)
// 			//   // console.log(result.gloss)
// 		});
// 		// return goodRes
// 		// resolve(results)
// 		// return formattedResults
// 		res.json(formattedResults);
// 	});
// };
