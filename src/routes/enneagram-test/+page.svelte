<!-- src/routes/enneagram-test/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to main questions page which serves as our personality assessment
		window.location.href = '/questions';
	});
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0;url=/questions" />
	<link rel="canonical" href="https://9takes.com/questions" />
	<title>Enneagram Test - 9takes</title>
	<meta name="description" content="Take our personality-based assessment on 9takes to discover your Enneagram type through authentic questions and discussions." />
</svelte:head>

<main class="mx-auto max-w-4xl px-4 py-8">
	<div class="text-center">
		<h1 class="text-3xl font-bold mb-4">Enneagram Assessment</h1>
		<p class="text-lg text-gray-600 mb-6">
			Redirecting you to our personality-based assessment...
		</p>
		<a href="/questions" class="text-blue-600 underline">
			Click here if you're not redirected automatically
		</a>
	</div>
</main>