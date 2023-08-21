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
		<a href="/blog/enneagram">Blogs about the Enneagram</a>
	</li>
	<li>
		<a href="/blog/enneagram">Blogs examining famous people</a>
	</li>
</ul>
