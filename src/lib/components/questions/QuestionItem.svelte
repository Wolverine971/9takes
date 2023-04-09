<script lang="ts">
	export let questionData: any;
</script>

<section class="card">
	<a href="/questions/{questionData.url}">{questionData.question}</a>
</section>

<style>
	.card {
		margin: var(--card-margin);
		padding: var(--card-padding);
		box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
			0 1px 5px 0 rgb(0 0 0 / 12%);
	}
</style>
