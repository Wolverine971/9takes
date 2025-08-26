<!-- src/lib/components/molecules/Messages.svelte -->
<script lang="ts">
	const sendBtn = document.querySelector('#send');
	const messages = document.querySelector('#messages');
	const messageBox = document.querySelector('#messageBox');

	let ws;

	function showMessage(message) {
		messages.textContent += `\n\n${message}`;
		messages.scrollTop = messages.scrollHeight;
		messageBox.value = '';
	}
</script>

<svelte:window bind:innerWidth />

<h1>Real Time Messaging</h1>
<pre id="messages" style="height: 400px; overflow: scroll" />
<input
	type="text"
	id="messageBox"
	placeholder="Type your message here"
	style="display: block; width: 100%; margin-bottom: 10px; padding: 10px;"
/>
<button id="send" title="Send Message!" style="width: 100%; height: 30px;">Send Message</button>

<style lang="scss">
</style>
