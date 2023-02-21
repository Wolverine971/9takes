<script lang="ts">
	import { deserialize } from '$app/forms';
	import { notifications } from './notifications';

	export let cta: string = '';
	let email: string = '';
	let error: string = '';

	const submit = async () => {
		console.log('submit email');

		if (!/\S+@\S+\.\S+/.test(email)) {
			//!/.+@.+/.test(email) ||
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}

		let body = new FormData();
		body.append('email', email);

		const { data } = await (
			await fetch(`/email?/submit`, {
				method: 'POST',
				body
			})
		).json();

		if (data) {
			notifications.info('Email Submitted', 3000);
			email = '';
		} else {
			notifications.warning('Email Failed', 3000);
		}
	};
</script>

<div class="form">
	<h3>{cta}</h3>
	<div class="form-row" style="margin-bottom: 5px;">
		<input
			type="text"
			name="email"
			bind:value={email}
			placeholder="Email"
			style="margin-bottom: 0;"
		/>

		<input
			type="button"
			value="Send"
			on:click={submit}
			disabled={email.length ? false : true}
			class:form-send={true}
			class={email.length ? 'regular' : 'disabled'}
		/>
	</div>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style lang="scss">
	@media (max-width: 535px) {
		.form-row {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.form-send {
			margin: 5px;
		}
	}
	.form-send {
		margin-left: 5px;
		margin-bottom: 0;
	}
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20px;
		justify-content: center;
		margin-bottom: 1rem;
	}
	.form-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem 1rem 0 1rem;
	}
	.form-row > * {
		margin-right: 0.5rem;
	}
	.hidden {
		visibility: hidden;
	}
	.disabled {
		border: pink 2px solid;
		// color: pink;
	}
	.error {
		border: #ff2c50 2px solid;
		border-radius: 3px;
		margin: 3px;
		padding: 3px;
		color: #ff2c50;
	}
</style>
