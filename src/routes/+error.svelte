<!-- src/routes/+error.svelte -->
<script>
	import { page } from '$app/stores';
</script>

<div>
	<h1>{$page.status} {$page?.error?.message}</h1>

	<h2 style="font-size: 3em">Looking for something else?</h2>
	<ul>
		<!-- <li>
		<a href="/questions" aria-disabled="true" class="disabled">Questions</a>
	</li> -->
		<li>
			<a href="/enneagram-corner">The Enneagram Corner</a>
		</li>
		<li>
			<a href="/personality-analysis">Famous people personality analysis</a>
		</li>
		<li>
			<a href="/questions">The 9takes questions??</a>
		</li>
	</ul>
</div>
