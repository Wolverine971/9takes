<script lang="ts">
	import { joinEmail, joinEmail2, signupEmail, forgotPass } from '../../emails';
	import { dev } from '$app/environment';
	import { notifications } from '$lib/components/molecules/notifications';

	let email: string = '';
	let error: string = '';
	let group: any = null;
	let subject: string = 'Test Email';

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
		body.append('emailType', group);
		body.append('subject', subject);

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
			<h2>joinEmail</h2>
			<input type="radio" bind:group value={'joinEmail'} />

			<div>{@html joinEmail()}</div>

			<h2>joinEmail2</h2>
			<input type="radio" bind:group value={'joinEmail2'} />
			<div>{@html joinEmail2()}</div>

			<h2>signupEmail</h2>
			<input type="radio" bind:group value={'signupEmail'} />
			<div>{@html signupEmail()}</div>

			<h2>forgotPass</h2>
			<input type="radio" bind:group value={'forgotPass'} />
			<div>{@html forgotPass('test')}</div>
		</div>
	</div>

	<div class="text-column send-email-div">
		<form class="">
			<input
				type="text"
				id="subject"
				name="subject"
				bind:value={subject}
				placeholder="Subject of the email"
			/>

			<div>
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
					class="{email.length ? 'regular' : 'disabled'} btn btn-primary">Send Email</button
				>
			</div>
		</form>
		{#if error}
			<p class="error">{error}</p>
		{/if}
	</div>
{/if}

<style lang="scss">
	.send-email-div {
		margin: 1rem;
		padding: 1rem;
		align-items: center;
	}
</style>
