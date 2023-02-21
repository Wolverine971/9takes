<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import Comment from './Comment.svelte';

	import { notifications } from './notifications.js';

	let page = 0;

	export let parentData: any;

	/** @type {import('./$types').PageData} */
	// export let data: PageData;

	let comment: string;

	export let parentType: string;

	export async function createComment() {
		var body = new FormData();
		if (parentType === 'comment') {
			body.append('comment', comment);
			body.append('parent_id', parentData.id);
			body.append('author_id', parentData.author_id);
			body.append('parent_type', parentType);
		} else if (parentType === 'question') {
			body.append('comment', comment);
			body.append('parent_id', parentData.question.id);
			body.append('author_id', parentData.question.author_id);
			body.append('parent_type', parentType);
		}

		const resp = await fetch('?/createComment', {
			method: 'POST',
			body
		}).then(async (response) => {
			const data = deserialize(await response.text());

			notifications.info('Comment Added', 3000);
		});
		comment = '';
	}
	const expand = () => {
		console.log('please-expand');
	};
</script>

<div>
	<form>
		<div class="interact-text-container">
			<textarea placeholder="Speak your mind" class="interact-textbox" bind:value={comment} />
		</div>
		<button
			class="btn btn-primary"
			type="button"
			on:click={createComment}
			disabled={comment?.length < 1}
		>
			Submit Answer
		</button>
	</form>
</div>

<style lang="scss">
	.interact-text-container {
		position: relative;
		width: 100%;
		height: 100px;
	}
	.interact-textbox {
		border-radius: 5px;
		box-sizing: border-box;
		padding: 1rem;
		width: 100%;
		/* max-width: 900px; */

		position: relative;
	}
	.interact-expand {
		z-index: 10;
		position: absolute;
		top: 5px;
		left: calc(100% - 73px);
	}
	.interact-button {
	}
</style>
