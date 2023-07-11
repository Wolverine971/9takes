<script lang="ts">
	import CommentsIcon from '../icons/commentsIcon.svelte';

	export let questionData: any;
	console.log(questionData);
</script>

<a
	href="/questions/{questionData.url}"
	style="display: flex; justify-content: space-between; align-items: center;"
	class="card"
>
	<span>
		{questionData.question}
	</span>
	<span style="display: flex; justify-content: space-between;">
		{questionData.comment_count}
		<CommentsIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
	</span>
</a>

<style>
	.card {
		margin: var(--card-margin);
		padding: var(--card-padding);
		box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
			0 1px 5px 0 rgb(0 0 0 / 12%);
	}
	.card:hover {
		background-color: var(--color-theme-purple-v);
	}
</style>
