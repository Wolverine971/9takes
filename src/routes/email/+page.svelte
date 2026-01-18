<!-- src/routes/email/+page.svelte -->
<script lang="ts">
	import { joinEmail, joinEmail2, signupEmail, forgotPass, emailTemplate } from '../../emails';
	import { notifications } from '$lib/components/molecules/notifications';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/atoms/Modal2.svelte';
	import { getModal } from '$lib/components/atoms/Modal2.svelte';

	// Email form states
	let templateEmail: string = '';
	let customEmail: string = '';
	let subject: string = '';
	let header: string = '';
	let emailBody: string = '';
	let validationError: string = '';
	let selectedTemplate: string = 'joinEmail';

	// Editor instance
	let editor: any = null;

	onMount(() => {
		// Initialize the rich text editor
		if (typeof MediumEditor !== 'undefined') {
			const elements = document.querySelectorAll('.editable');
			editor = new MediumEditor(elements, {
				toolbar: {
					buttons: [
						'bold',
						'italic',
						'underline',
						'anchor',
						'h2',
						'h3',
						'quote',
						'unorderedlist',
						'orderedlist'
					]
				},
				placeholder: {
					text: 'Type your email content here...'
				}
			});

			// Set up event listener to update the emailBody when content changes
			editor.subscribe('editableInput', () => {
				refreshEmailContent();
			});
		}
	});

	// Refresh email content from editor
	const refreshEmailContent = () => {
		if (editor) {
			const elems = editor.serialize();
			emailBody = Object.values(elems).map((elem: any) => elem.value)[0] || '';
		}
	};

	// Validate email format
	const isValidEmail = (email: string): boolean => {
		return /\S+@\S+\.\S+/.test(email);
	};

	// Send email using selected template
	const sendEmailFromTemplate = async () => {
		if (!isValidEmail(templateEmail)) {
			validationError = 'Please enter a valid email address';
			return;
		}

		if (!selectedTemplate || !templateEmail || !subject) {
			notifications.danger('Please fill out all required fields', 3000);
			return;
		}

		const formData = new FormData();
		formData.append('email', templateEmail);
		formData.append('emailType', selectedTemplate);
		formData.append('subject', subject);

		try {
			const response = await fetch(`/email?/emailTemplate`, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.data) {
				notifications.success('Email sent successfully', 3000);
				templateEmail = '';
			} else {
				if (result.error?.message === 'Email already exists') {
					notifications.warning('Email already exists', 3000);
				} else {
					notifications.danger(
						'Failed to send email: ' + (result.error?.message || 'Unknown error'),
						3000
					);
				}
			}
		} catch (err) {
			notifications.danger('Error sending email', 3000);
		}

		validationError = '';
	};

	// Send custom email to one recipient
	const sendCustomEmail = async () => {
		if (!isValidEmail(customEmail)) {
			validationError = 'Please enter a valid email address';
			return;
		}

		if (!customEmail || !subject || !header || !emailBody) {
			notifications.danger('Please fill out all required fields', 3000);
			return;
		}

		refreshEmailContent();

		const formData = new FormData();
		formData.append('email', customEmail);
		formData.append('subject', subject);
		formData.append('emailToSend', emailTemplate(subject, header, emailBody));

		try {
			const response = await fetch(`/email?/singleCustomEmail`, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.data) {
				notifications.success('Custom email sent successfully', 3000);
				customEmail = '';
			} else {
				notifications.danger(
					'Failed to send email: ' + (result.error?.message || 'Unknown error'),
					3000
				);
			}
		} catch (err) {
			notifications.danger('Error sending email', 3000);
		}

		validationError = '';
	};

	// Send custom email to all subscribers
	const sendCustomEmailToEveryone = async () => {
		if (!subject || !header || !emailBody) {
			notifications.danger('Please fill out all required fields', 3000);
			return;
		}

		refreshEmailContent();

		const formData = new FormData();
		formData.append('subject', subject);
		formData.append('emailToSend', emailTemplate(subject, header, emailBody));

		try {
			const response = await fetch(`/email?/sendCustomEmailToEveryone`, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.data) {
				notifications.success('Mass email sent successfully', 3000);
			} else {
				notifications.danger(
					'Failed to send emails: ' + (result.error?.message || 'Unknown error'),
					3000
				);
			}
		} catch (err) {
			notifications.danger('Error sending emails', 3000);
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
	<link
		rel="stylesheet"
		href="//cdn.jsdelivr.net/npm/medium-editor@latest/dist/css/themes/default.min.css"
		type="text/css"
		media="screen"
		charset="utf-8"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold text-primary-700">Email Administration</h1>

	<!-- Custom Email Creator Section -->
	<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold text-neutral-800">Custom Email Creator</h2>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Email Builder -->
			<div class="space-y-4">
				<div class="space-y-2">
					<label for="customEmail" class="block text-sm font-medium text-neutral-700"
						>Recipient Email</label
					>
					<input
						type="email"
						id="customEmail"
						bind:value={customEmail}
						placeholder="recipient@example.com"
						class="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				<div class="space-y-2">
					<label for="subject" class="block text-sm font-medium text-neutral-700"
						>Email Subject</label
					>
					<input
						type="text"
						id="subject"
						bind:value={subject}
						placeholder="Enter email subject"
						class="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				<div class="space-y-2">
					<label for="header" class="block text-sm font-medium text-neutral-700">Email Header</label
					>
					<input
						type="text"
						id="header"
						bind:value={header}
						placeholder="Enter email header"
						class="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				<div class="space-y-2">
					<label for="emailContent" class="block text-sm font-medium text-neutral-700"
						>Email Content</label
					>
					<div
						class="editable min-h-[200px] w-full rounded-md border border-neutral-300 p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
						id="emailContent"
					></div>
				</div>

				<div class="flex space-x-4 pt-4">
					<button
						on:click={refreshEmailContent}
						class="rounded-md bg-neutral-600 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
					>
						Refresh Preview
					</button>

					<button
						on:click={sendCustomEmail}
						class="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					>
						Send Custom Email
					</button>

					<button
						on:click={() => getModal('send-email-to-everyone').open()}
						class="hover:bg-error-600 rounded-md bg-error-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
					>
						Send to All Subscribers
					</button>
				</div>

				{#if validationError}
					<p class="mt-2 text-error-700">{validationError}</p>
				{/if}
			</div>

			<!-- Email Preview -->
			<div class="email-preview-container">
				<h3 class="mb-3 text-lg font-medium text-neutral-700">Email Preview</h3>
				<div
					class="email-preview h-[500px] overflow-hidden overflow-y-auto rounded border border-neutral-200"
				>
					{#if subject && header && emailBody}
						<iframe
							title="Email Preview"
							srcdoc={emailTemplate(subject, header, emailBody)}
							class="h-full w-full"
							sandbox="allow-same-origin"
						></iframe>
					{:else}
						<div class="flex h-full items-center justify-center bg-neutral-50 text-neutral-500">
							<p>Complete the form to see the email preview</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Template Emails Section -->
	<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold text-neutral-800">Send Template Email</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div class="space-y-2">
					<label for="templateEmail" class="block text-sm font-medium text-neutral-700"
						>Recipient Email</label
					>
					<input
						type="email"
						id="templateEmail"
						bind:value={templateEmail}
						placeholder="recipient@example.com"
						class="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				<div class="space-y-2">
					<label for="templateSubject" class="block text-sm font-medium text-neutral-700"
						>Email Subject</label
					>
					<input
						type="text"
						id="templateSubject"
						bind:value={subject}
						placeholder="Enter email subject"
						class="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				<div class="space-y-2">
					<p class="block text-sm font-medium text-neutral-700">Select Template</p>
					<div class="grid grid-cols-2 gap-3">
						<label
							class="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-neutral-50"
						>
							<input
								type="radio"
								bind:group={selectedTemplate}
								value="joinEmail"
								class="text-primary-600 focus:ring-primary-500"
							/>
							<span>Waitlist Join</span>
						</label>

						<label
							class="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-neutral-50"
						>
							<input
								type="radio"
								bind:group={selectedTemplate}
								value="joinEmail2"
								class="text-primary-600 focus:ring-primary-500"
							/>
							<span>Waitlist Join Alt</span>
						</label>

						<label
							class="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-neutral-50"
						>
							<input
								type="radio"
								bind:group={selectedTemplate}
								value="signupEmail"
								class="text-primary-600 focus:ring-primary-500"
							/>
							<span>Email Verification</span>
						</label>

						<label
							class="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-neutral-50"
						>
							<input
								type="radio"
								bind:group={selectedTemplate}
								value="forgotPass"
								class="text-primary-600 focus:ring-primary-500"
							/>
							<span>Password Reset</span>
						</label>
					</div>
				</div>

				<button
					on:click={sendEmailFromTemplate}
					disabled={!templateEmail || !subject || !selectedTemplate}
					class="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Send Template Email
				</button>
			</div>

			<div>
				<h3 class="mb-3 text-lg font-medium text-neutral-700">Template Preview</h3>
				<div
					class="email-preview-container h-[400px] overflow-hidden overflow-y-auto rounded border border-neutral-200"
				>
					{#if selectedTemplate}
						<iframe
							title="Template Preview"
							srcdoc={selectedTemplate === 'joinEmail'
								? joinEmail()
								: selectedTemplate === 'joinEmail2'
									? joinEmail2()
									: selectedTemplate === 'signupEmail'
										? signupEmail()
										: selectedTemplate === 'forgotPass'
											? forgotPass('https://9takes.com/reset-password?token=sample')
											: ''}
							class="h-full w-full"
							sandbox="allow-same-origin"
						></iframe>
					{:else}
						<div class="flex h-full items-center justify-center bg-neutral-50 text-neutral-500">
							<p>Select a template to see the preview</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Template Gallery -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold text-neutral-800">Email Template Gallery</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each [{ name: 'joinEmail', title: 'Waitlist Join', render: joinEmail }, { name: 'joinEmail2', title: 'Waitlist Join Alt', render: joinEmail2 }, { name: 'signupEmail', title: 'Email Verification', render: signupEmail }, { name: 'forgotPass', title: 'Password Reset', render: () => forgotPass('https://9takes.com/reset-password?token=sample') }] as template}
				<div class="overflow-hidden rounded-lg border">
					<div class="border-b bg-neutral-100 p-3">
						<h3 class="font-medium">{template.title}</h3>
					</div>
					<div class="email-preview-container h-[400px] overflow-y-auto">
						<iframe
							title={template.title}
							srcdoc={template.render()}
							class="h-full w-full"
							sandbox="allow-same-origin"
						></iframe>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<Modal id="send-email-to-everyone">
	<div class="p-6">
		<h2 class="mb-4 text-2xl font-bold text-error-700">⚠️ Confirmation Required</h2>
		<p class="mb-6 text-neutral-700">
			Are you absolutely sure you want to send this email to <strong>all subscribers</strong>? This
			action cannot be undone.
		</p>
		<div class="flex justify-end space-x-4">
			<button
				on:click={() => getModal('send-email-to-everyone').close()}
				class="rounded-md bg-neutral-200 px-4 py-2 font-medium text-neutral-800 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
			>
				Cancel
			</button>
			<button
				on:click={sendCustomEmailToEveryone}
				class="bg-error-600 rounded-md px-4 py-2 font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
			>
				Yes, Send to Everyone
			</button>
		</div>
	</div>
</Modal>

<style lang="scss">
	/* Ensure email previews are isolated from page styles */
	.email-preview-container {
		background: #f9f9ff;
		position: relative;

		iframe {
			border: 0;
			background: #f9f9ff;
		}
	}

	/* Ensure editor content is properly isolated */
	:global(.editable) {
		font-family: inherit !important;
		min-height: 200px;
		padding: 1rem;
		background-color: white;

		&:focus {
			outline: none;
		}
	}

	/* Override any conflicting medium-editor styles */
	:global(.medium-editor-element) {
		word-break: break-word;
		min-height: 200px;
	}

	:global(.medium-editor-placeholder) {
		position: absolute;
		color: #999;
	}
</style>
