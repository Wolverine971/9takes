<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="glass-card pretty-div">
	<div class="row">
		<h1 style="">User Enneagram: {data?.user.enneagram}</h1>
	</div>

	{#if data.subscriptions?.length}
		<div>
			<h2>User's subscriptions</h2>

			{#each data.subscriptions as subscription}
				<div class="row" style="justify-content: flex-start;">
					<a href="/questions/{subscription.questions.url}">{subscription.questions.question}</a>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	h1 {
		font-size: 1.5rem;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		gap: 10px;
		margin: 1rem;
		justify-content: center;
		align-items: center;
	}
	.pretty-div {
		margin: 1rem;
		padding: 1rem;
	}
</style>
