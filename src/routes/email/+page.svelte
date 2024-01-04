<script lang="ts">
	import { joinEmail, joinEmail2, signupEmail, forgotPass, emailTemplate } from '../../emails';
	import { notifications } from '$lib/components/molecules/notifications';
	// import { MediumEditor } from 'medium-editor';
	import { onMount } from 'svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	let email: string = '';
	let singularEmail: string = '';
	let error: string = '';
	let group: any = null;
	let subject: string = '';
	let header: string = '';
	let emailToSend: string = '';
	let editor: any = null;
	let emailBody: string = '';

	onMount(() => {
		var elements = document.querySelectorAll('.editable');
		editor = new MediumEditor(elements);
		console.log(editor);
	});

	const sendEmailFromTemplate = async () => {
		if (!/\S+@\S+\.\S+/.test(email)) {
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}
		if (!group || !email || !subject) {
			notifications.danger('Please fill out all fields', 3000);
			return;
		}

		let body = new FormData();
		body.append('email', email);
		body.append('emailType', group);
		body.append('subject', subject);

		const { data, error: emailError } = await (
			await fetch(`/email?/emailTemplate`, {
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

	const refreshEmail = () => {
		const elems = editor.serialize();
		emailBody = Object.keys(elems).map((key) => {
			return elems[key]?.value;
		})[0];
	};

	const sendCustomEmail = async () => {
		if (!/\S+@\S+\.\S+/.test(singularEmail)) {
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}

		if (!group || !singularEmail || !subject || !emailBody) {
			notifications.danger('Please fill out all fields', 3000);
			return;
		}

		let body = new FormData();
		body.append('email', singularEmail);
		body.append('emailType', group);
		body.append('subject', subject);
		body.append('emailToSend', emailTemplate(subject, header, emailBody));

		const { data, error: emailError } = await (
			await fetch(`/email?/singleCustomEmail`, {
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
	const sendCustomEmailToEveryone = async () => {
		if (!/\S+@\S+\.\S+/.test(email)) {
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}

		let body = new FormData();
		body.append('subject', subject);
		body.append('emailToSend', emailTemplate(subject, header, emailBody));

		const { data, error: emailError } = await (
			await fetch(`/email?/sendCustomEmailToEveryone`, {
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
		getModal('send-email-to-everyone').close();
	};
</script>

<svelte:head>
	<script src="//cdn.jsdelivr.net/npm/medium-editor@latest/dist/js/medium-editor.min.js"></script>
	<link
		rel="stylesheet"
		href="//cdn.jsdelivr.net/npm/medium-editor@latest/dist/css/medium-editor.min.css"
		type="text/css"
		media="screen"
		charset="utf-8"
	/>
</svelte:head>

<div class="send-email-div">
	<div class="side-display">
		<div>
			<h2>Create Email</h2>
			<div class="flex-center">
				<input
					type="email"
					id="email"
					name="email"
					bind:value={singularEmail}
					placeholder="you@example.com"
				/>
				<input
					type="text"
					id="subject"
					name="subject"
					bind:value={subject}
					placeholder="Subject of the email"
				/>
				<input
					type="text"
					id="header"
					name="header"
					bind:value={header}
					placeholder="Header of the email"
				/>

				<textarea class="editable editor" bind:value={emailToSend} />
			</div>
		</div>
		<!-- disabled={email.length ? false : true} -->

		<div>
			<h2>Email Template</h2>
			<div>{@html emailTemplate(subject, header, emailBody)}</div>
		</div>
	</div>
	<div style="margin: 1rem;">
		<button
			type="button"
			value="Send"
			on:click={refreshEmail}
			class:form-send={true}
			class=" btn btn-primary">Refresh Email</button
		>
		<button
			type="button"
			value="Send"
			on:click={sendCustomEmail}
			class:form-send={true}
			class="btn btn-primary">Send One Custom Email</button
		>
		<button
			type="button"
			value="Send"
			on:click={() => {
				getModal('send-email-to-everyone').open();
			}}
			class:form-send={true}
			class="btn btn-primary">Send Custom Email To Everyone</button
		>
	</div>
</div>

<hr />
<div class="send-email-div">
	<h2>Email from template</h2>
	<h3>Email Template: {group}</h3>
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
				bind:value={singularEmail}
				placeholder="you@example.com"
			/>
			<button
				type="button"
				value="Send"
				on:click={sendEmailFromTemplate}
				disabled={singularEmail.length ? false : true}
				class:form-send={true}
				class="{singularEmail.length ? 'regular' : 'disabled'} btn btn-primary">Send Email</button
			>
		</div>
	</form>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

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

	<hr />
	<br />
	<hr />
</div>

<Modal2 id={'send-email-to-everyone'}>
	<h1>Are you sure?</h1>
	<button
		type="button"
		value="Send"
		on:click={sendCustomEmailToEveryone}
		class:form-send={true}
		class="btn btn-primary">Send Custom Email To Everyone</button
	>
</Modal2>

<style lang="scss">
	.send-email-div {
		margin: 1rem;
		padding: 1rem;
		align-items: center;
		border: var(--classic-border);
	}
	.editor {
		width: 100%;
		height: 100%;
		min-width: 200px;
		min-height: 200px;
		margin: 0.5rem;
		padding: 0.5rem;
		border: var(--classic-border);
	}
	.side-display {
		display: flex;
		align-items: start;
		justify-content: space-between;
	}

	@media (max-width: 800px) {
		.side-display {
			flex-direction: column;
		}
	}
</style>
