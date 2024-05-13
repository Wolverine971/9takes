<script lang="ts">
</script>

<!-- <Layout> -->
<!-- <div class="app"> -->
<!-- {#if $page.url.pathname === '/blog'}
	<Jumbotron
		image={'/blogs/rome.webp'}
		showIcon={false}
		text={'The Blog'}
		subtext={''}
		aspectRatio={''}
	>
		<h1 class="jumbo-name bold-shadow " data-value={'The Blog'} style:--tag="h-blog">
			{'The Blog'}
		</h1>
	</Jumbotron>
{/if} -->
<slot />
<!-- </div> -->

<!-- </Layout> -->
<style>
	.jumbo-name {
		position: relative;
		font-size: 3.25rem;
		font-weight: 400;
		margin: 1rem;
		color: var(--base-white-outline, var(--white));
		text-align: center;
		text-transform: uppercase;
	}
</style>
