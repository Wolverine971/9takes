<script lang="ts">
	import type { Database } from 'src/schema';
	import Card from '../atoms/card.svelte';
	import Comments from './Comments.svelte';
	import Interact from './Interact.svelte';
	export let comment: any; //: Database['public']['Tables']['comments']['Row'];

	let commentComment: any = null;
	if (comment?.id) {
		commentComment = Object.assign({}, comment);

	}

	let comments = [];

	
</script>

<Card>
	<p>Comment: {comment?.comment}</p>
	<p>ParentId: {comment?.parent_id}</p>
	<Interact parentData={commentComment} parentType={'comment'} />

	<div style="margin-left:10px;">
		<Comments parentData={comment} nested={false} parentType={'comment'} />
	</div>
</Card>


<style lang="scss">

	</style>