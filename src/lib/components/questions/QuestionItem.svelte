<script lang="ts">
	import CommentsIcon from '../icons/commentsIcon.svelte';

	export let questionData: any;
	console.log(questionData);

	const dateObj = new Date(questionData.created_at);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newdate = month + '/' + day + '/' + year;
</script>

<a href="/questions/{questionData.url}" style="" class="question-card">
	<p class="question-display">
		{questionData.question}
	</p>
	<div class="small-div">
		<span style="display: flex; justify-content: space-between;">
			{questionData.comment_count}
			<CommentsIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
		</span>
		<span class="date-span">
			{newdate}
		</span>
	</div>
</a>

<style lang="scss">
	.question-display {
		align-self: flex-start;
	}
	.date-span {
		// position: absolute;
		// top: -1px;
		// right: -1px;
		// border-radius: 0 0 0 5px;
		text-decoration: none;
		border: var(--classic-border);
		border-radius: 5px;

		padding: 0.3rem;
	}
	.small-div {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.question-card {
		display: flex;
		// flex-direction: column;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		position: relative;
		margin: var(--card-margin);
		padding: var(--card-padding);
		box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
			0 1px 5px 0 rgb(0 0 0 / 12%);
	}
	.question-card:hover {
		background-color: var(--color-theme-purple-v);
	}
</style>
