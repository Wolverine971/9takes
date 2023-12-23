<script lang="ts">
	import { joinEmail, joinEmail2, signupEmail, forgotPass } from '../../emails';
	import { dev } from '$app/environment';
	import { notifications } from '$lib/components/molecules/notifications';

	let email: string = '';
	let error: string = '';

	const submit = async () => {
		if (!/\S+@\S+\.\S+/.test(email)) {
			//!/.+@.+/.test(email) ||
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}

		let body = new FormData();
		body.append('email', email);

		const { data, error: emailError } = await (
			await fetch(`/email?/emailTest`, {
				method: 'POST',
				body
			})
		).json();

		if (data) {
			notifications.info('Email Submitted', 3000);
			email = '';
		} else {
			if (emailError?.message && emailError?.message === 'Email already exists') {
				notifications.warning('Email already exists', 3000);
			} else {
				notifications.warning('Email Failed', 3000);
			}
		}
	};
</script>

{#if dev}
	<div class="text-column">
		<h1>Email Preview</h1>
		<div class="flex-center">
			<div>{@html joinEmail()}</div>

			<div>{@html joinEmail2()}</div>

			<div>{@html signupEmail()}</div>

			<div>{@html forgotPass('test')}</div>
		</div>
	</div>

	<div>
		<form class="waitlist-form">
			<input
				type="email"
				id="email"
				name="email"
				bind:value={email}
				placeholder="you@example.com"
			/>
			<button
				type="button"
				value="Send"
				on:click={submit}
				disabled={email.length ? false : true}
				class:form-send={true}
				class={email.length ? 'regular' : 'disabled'}>Send Email</button
			>
		</form>
		{#if error}
			<p class="error">{error}</p>
		{/if}
	</div>
{/if}

<style>
	
</style>
