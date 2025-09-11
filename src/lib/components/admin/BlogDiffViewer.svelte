<script lang="ts">
	import { onMount } from 'svelte';

	export let leftContent: string = '';
	export let rightContent: string = '';
	export let leftTitle: string = 'Version A';
	export let rightTitle: string = 'Version B';

	interface DiffLine {
		type: 'added' | 'removed' | 'unchanged' | 'modified';
		leftLineNumber?: number;
		rightLineNumber?: number;
		leftText?: string;
		rightText?: string;
	}

	let diffLines: DiffLine[] = [];

	function computeDiff(left: string, right: string): DiffLine[] {
		const leftLines = left.split('\n');
		const rightLines = right.split('\n');
		const result: DiffLine[] = [];

		// Simple line-by-line diff algorithm
		let leftIndex = 0;
		let rightIndex = 0;
		let leftLineNum = 1;
		let rightLineNum = 1;

		while (leftIndex < leftLines.length || rightIndex < rightLines.length) {
			const leftLine = leftLines[leftIndex];
			const rightLine = rightLines[rightIndex];

			if (leftIndex >= leftLines.length) {
				// Only right side has content
				result.push({
					type: 'added',
					rightLineNumber: rightLineNum,
					rightText: rightLine
				});
				rightIndex++;
				rightLineNum++;
			} else if (rightIndex >= rightLines.length) {
				// Only left side has content
				result.push({
					type: 'removed',
					leftLineNumber: leftLineNum,
					leftText: leftLine
				});
				leftIndex++;
				leftLineNum++;
			} else if (leftLine === rightLine) {
				// Lines are identical
				result.push({
					type: 'unchanged',
					leftLineNumber: leftLineNum,
					rightLineNumber: rightLineNum,
					leftText: leftLine,
					rightText: rightLine
				});
				leftIndex++;
				rightIndex++;
				leftLineNum++;
				rightLineNum++;
			} else {
				// Lines are different - look ahead to see if we can find a match
				let foundMatch = false;
				const lookAhead = 3;

				// Check if the left line appears in the next few right lines (addition)
				for (let i = 1; i <= lookAhead && rightIndex + i < rightLines.length; i++) {
					if (leftLine === rightLines[rightIndex + i]) {
						// Found the left line later in right, so right lines before it are additions
						for (let j = 0; j < i; j++) {
							result.push({
								type: 'added',
								rightLineNumber: rightLineNum,
								rightText: rightLines[rightIndex + j]
							});
							rightIndex++;
							rightLineNum++;
						}
						foundMatch = true;
						break;
					}
				}

				if (!foundMatch) {
					// Check if the right line appears in the next few left lines (deletion)
					for (let i = 1; i <= lookAhead && leftIndex + i < leftLines.length; i++) {
						if (rightLine === leftLines[leftIndex + i]) {
							// Found the right line later in left, so left lines before it are deletions
							for (let j = 0; j < i; j++) {
								result.push({
									type: 'removed',
									leftLineNumber: leftLineNum,
									leftText: leftLines[leftIndex + j]
								});
								leftIndex++;
								leftLineNum++;
							}
							foundMatch = true;
							break;
						}
					}
				}

				if (!foundMatch) {
					// Lines are just different (modification)
					result.push({
						type: 'modified',
						leftLineNumber: leftLineNum,
						rightLineNumber: rightLineNum,
						leftText: leftLine,
						rightText: rightLine
					});
					leftIndex++;
					rightIndex++;
					leftLineNum++;
					rightLineNum++;
				}
			}
		}

		return result;
	}

	function updateDiff() {
		diffLines = computeDiff(leftContent, rightContent);
	}

	onMount(() => {
		updateDiff();
	});

	$: {
		// Reactively update diff when content changes
		leftContent, rightContent;
		updateDiff();
	}

	function getLineClass(type: string): string {
		switch (type) {
			case 'added':
				return 'bg-green-50 border-l-4 border-green-500';
			case 'removed':
				return 'bg-red-50 border-l-4 border-red-500';
			case 'modified':
				return 'bg-yellow-50 border-l-4 border-yellow-500';
			default:
				return 'bg-white border-l-4 border-gray-200';
		}
	}

	function getTextClass(type: string): string {
		switch (type) {
			case 'added':
				return 'text-green-800';
			case 'removed':
				return 'text-red-800';
			case 'modified':
				return 'text-yellow-800';
			default:
				return 'text-gray-700';
		}
	}
</script>

<div class="diff-viewer border rounded-lg overflow-hidden">
	<!-- Header -->
	<div class="bg-gray-100 px-4 py-2 border-b">
		<div class="grid grid-cols-2 gap-4">
			<div class="font-medium text-gray-800">{leftTitle}</div>
			<div class="font-medium text-gray-800">{rightTitle}</div>
		</div>
	</div>

	<!-- Diff Content -->
	<div class="diff-content bg-white">
		{#each diffLines as line, index}
			<div class="grid grid-cols-2 gap-0 min-h-[1.5rem] {getLineClass(line.type)}">
				<!-- Left Side -->
				<div class="flex">
					{#if line.leftLineNumber}
						<div class="w-12 bg-gray-50 text-xs text-gray-500 px-2 py-1 border-r flex-shrink-0 text-right">
							{line.leftLineNumber}
						</div>
					{:else}
						<div class="w-12 bg-gray-100 border-r flex-shrink-0"></div>
					{/if}
					<div class="px-3 py-1 flex-1 {getTextClass(line.type)} font-mono text-sm whitespace-pre-wrap">
						{line.leftText || ''}
					</div>
				</div>

				<!-- Right Side -->
				<div class="flex border-l">
					{#if line.rightLineNumber}
						<div class="w-12 bg-gray-50 text-xs text-gray-500 px-2 py-1 border-r flex-shrink-0 text-right">
							{line.rightLineNumber}
						</div>
					{:else}
						<div class="w-12 bg-gray-100 border-r flex-shrink-0"></div>
					{/if}
					<div class="px-3 py-1 flex-1 {getTextClass(line.type)} font-mono text-sm whitespace-pre-wrap">
						{line.rightText || ''}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.diff-viewer {
		max-height: 70vh;
		overflow-y: auto;
	}
	
	.diff-content {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}
</style>