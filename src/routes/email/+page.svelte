<script>
	import { joinEmail, joinEmail2 } from '../../emails';
	import { dev } from '$app/environment';
</script>

{#if dev}
	<div class="text-column">
		<h1>Email Preview</h1>
		<div class="display-emails">
			<div>{@html joinEmail()}</div>

			<div>{@html joinEmail2()}</div>
		</div>
	</div>
{/if}

<style>
	.display-emails {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
