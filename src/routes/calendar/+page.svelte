<script lang="ts">
	import type { PageData } from './$types';
	// import { joinEmail, joinEmail2 } from '../../emails';
	import { dev } from '$app/environment';
	export let data: PageData;
</script>

{#if dev}
	<div class="text-column">
		<h1>Content Calendar</h1>
		<div class="flex-center">
			<iframe
				src="https://calendar.google.com/calendar/embed?src=usersup%409takes.com&ctz=America%2FNew_York"
				style="border: 0"
				width="800"
				height="600"
				frameborder="0"
				scrolling="no"
			/>
		</div>
	</div>
{/if}

<style lang="scss">
</style>
