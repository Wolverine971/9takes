<!-- src/routes/admin/content-board/MarkdownEditor.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		content?: string;
		readonly?: boolean;
		placeholder?: string;
		onchange?: (content: string) => void;
	}

	let {
		content = $bindable(''),
		readonly = false,
		placeholder = 'Enter markdown content...',
		onchange
	}: Props = $props();

	let textarea = $state<HTMLTextAreaElement | undefined>(undefined);
	let lineNumbersEl = $state<HTMLDivElement | undefined>(undefined);

	// Calculate line numbers reactively
	let lineNumbers = $derived.by(() => {
		const lines = (content || '').split('\n');
		return Array.from({ length: Math.max(lines.length, 20) }, (_, i) => i + 1);
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		content = target.value;
		onchange?.(content);
		requestAnimationFrame(handleScroll);
	}

	// Handle Tab key for indentation
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Tab' && textarea) {
			e.preventDefault();
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			if (e.shiftKey) {
				// Unindent: Remove tab at start of line
				const beforeCursor = content.substring(0, start);
				const lineStart = beforeCursor.lastIndexOf('\n') + 1;
				const lineContent = content.substring(lineStart, start);

				if (lineContent.startsWith('\t') || lineContent.startsWith('  ')) {
					const removeChars = lineContent.startsWith('\t') ? 1 : 2;
					content = content.substring(0, lineStart) + content.substring(lineStart + removeChars);
					textarea.selectionStart = textarea.selectionEnd = start - removeChars;
					onchange?.(content);
					requestAnimationFrame(handleScroll);
				}
			} else {
				// Indent: Insert tab
				content = content.substring(0, start) + '\t' + content.substring(end);
				textarea.selectionStart = textarea.selectionEnd = start + 1;
				onchange?.(content);
				requestAnimationFrame(handleScroll);
			}
		}
	}

	// Sync scroll between line numbers and textarea
	function handleScroll() {
		if (lineNumbersEl && textarea) {
			lineNumbersEl.scrollTop = textarea.scrollTop;
		}
	}

	onMount(() => {
		if (textarea) {
			textarea.addEventListener('scroll', handleScroll);
			requestAnimationFrame(handleScroll);
			return () => textarea?.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<div class="markdown-editor" class:readonly>
	<!-- Line Numbers -->
	<div class="line-numbers" bind:this={lineNumbersEl}>
		{#each lineNumbers as num}
			<div class="line-number">{num}</div>
		{/each}
	</div>

	<!-- Editor Area -->
	<textarea
		bind:this={textarea}
		bind:value={content}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onscroll={handleScroll}
		{readonly}
		{placeholder}
		wrap="off"
		spellcheck="false"
		class="editor-textarea"
	></textarea>
</div>

<style lang="scss">
	.markdown-editor {
		--editor-font-size: 13px;
		--editor-line-height: 1.6;
		--editor-padding-y: 16px;
		--editor-padding-x: 16px;
		display: flex;
		flex: 1;
		height: 100%;
		min-height: 0;
		align-items: stretch;
		background: var(--bg-deep);
		border-radius: 8px;
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;

		&.readonly {
			background: var(--bg-elevated);

			.line-numbers {
				background: var(--bg-deep);
				color: var(--text-muted);
			}

			.editor-textarea {
				background: var(--bg-elevated);
				color: var(--text-secondary);

				&::placeholder {
					color: var(--text-muted);
				}
			}
		}

		@media (max-width: 768px) {
			border-radius: 0;
		}
	}

	.line-numbers {
		flex-shrink: 0;
		width: 48px;
		padding: var(--editor-padding-y) 8px var(--editor-padding-y) 0;
		box-sizing: border-box;
		background: var(--bg-base);
		color: var(--text-muted);
		text-align: right;
		font-size: var(--editor-font-size);
		line-height: var(--editor-line-height);
		overflow: hidden;
		user-select: none;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.line-number {
		height: calc(var(--editor-font-size) * var(--editor-line-height));
	}

	.editor-textarea {
		display: block;
		flex: 1 1 auto;
		width: 100%;
		min-width: 0;
		min-height: 100%;
		height: auto;
		box-sizing: border-box;
		padding: var(--editor-padding-y) var(--editor-padding-x);
		background: var(--bg-deep);
		color: var(--text-primary);
		border: none;
		outline: none;
		resize: none;
		overflow-y: auto;
		overflow-x: auto;
		white-space: pre;
		word-break: normal;
		overflow-wrap: normal;
		font-family: inherit;
		font-size: var(--editor-font-size);
		line-height: var(--editor-line-height);
		tab-size: 2;

		&::placeholder {
			color: var(--text-muted);
		}

		&:focus {
			outline: none;
		}

		@media (max-width: 768px) {
			--editor-font-size: 16px;
			--editor-line-height: 1.5;
			--editor-padding-y: 12px;
			--editor-padding-x: 12px;
		}
	}

	/* Scrollbar styling */
	.editor-textarea {
		scrollbar-width: thin;
		scrollbar-color: var(--primary) var(--bg-deep);

		&::-webkit-scrollbar {
			width: 8px;
			height: 8px;
		}

		&::-webkit-scrollbar-track {
			background: var(--bg-deep);
		}

		&::-webkit-scrollbar-thumb {
			background: var(--primary);
			border-radius: 4px;

			&:hover {
				background: var(--primary-light);
			}
		}
	}

	.line-numbers {
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
