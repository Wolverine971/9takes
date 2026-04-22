<!-- src/lib/components/molecules/Messages.svelte -->
<script lang="ts">
	let messages: HTMLPreElement | null = null;
	let messageBox: HTMLInputElement | null = null;

	function showMessage(message: string) {
		if (!messages || !messageBox) return;
		messages.textContent += `\n\n${message}`;
		messages.scrollTop = messages.scrollHeight;
		messageBox.value = '';
	}
</script>

<h1>Real Time Messaging</h1>
<pre bind:this={messages} id="messages" style="height: 400px; overflow: scroll"></pre>
<input
	bind:this={messageBox}
	type="text"
	id="messageBox"
	placeholder="Type your message here"
	style="display: block; width: 100%; margin-bottom: 10px; padding: 10px;"
/>
<button id="send" title="Send Message!" style="width: 100%; height: 30px;">Send Message</button>

<style lang="scss">
</style>
