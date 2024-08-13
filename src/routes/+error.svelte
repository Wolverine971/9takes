<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status} {$page?.error?.message}</h1>

<h2 style="font-size: 3em">Looking something else?</h2>
<ul>
	<!-- <li>
		<a href="/questions" aria-disabled="true" class="disabled">Questions</a>
	</li> -->
	<li>
		<a href="/enneagram-corner">Blogs about the Enneagram</a>
	</li>
	<li>
		<a href="/personality-analysis">Blogs examining famous people</a>
	</li>
</ul>
