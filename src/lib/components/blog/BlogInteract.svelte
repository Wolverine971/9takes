<!-- src/lib/components/blog/BlogInteract.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/atoms';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { formatPersonalityDisplayName } from '$lib/utils/personalityAnalysis';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PublicBlogCommentRow } from '../../../routes/api/personality-analysis/[slug]/discussion/+server';

	let {
		data,
		user,
		onCommentAdded
	}: {
		data: {
			slug: string;
			flags?: {
				userHasAnswered: boolean;
				userSignedIn: boolean;
			};
		};
		user: any;
		onCommentAdded?: (comments: PublicBlogCommentRow[]) => void;
	} = $props();

	let anonymousComment = $state(false);
	let comment = $state('');
	let submitting = $state(false);

	const createComment = async () => {
		const signedIn = Boolean(data?.flags?.userSignedIn || user?.id);
		if (!signedIn && (data?.flags?.userHasAnswered || anonymousComment)) {
			notifications.info('Must register or login to comment multiple times', 3000);
			return;
		}
		if (submitting) return;
		submitting = true;

		try {
			// author_id comes from the session on the server, never from here.
			const resp = await fetch(
				`/api/personality-analysis/${encodeURIComponent(data.slug)}/discussion`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ comment, fingerprint: getOrCreateVisitorId() })
				}
			);
			const payload = (await resp.json().catch(() => null)) as {
				comments?: PublicBlogCommentRow[];
				error?: string;
			} | null;

			if (!resp.ok || !payload?.comments) {
				notifications.danger(payload?.error || 'Error adding comment', 3000);
				return;
			}

			notifications.success('Comment Added', 3000);
			if (!signedIn) anonymousComment = true;
			onCommentAdded?.(payload.comments);
			comment = '';
		} catch (error) {
			console.error('Failed to post personality comment', error);
			notifications.danger('Error adding comment', 3000);
		} finally {
			submitting = false;
		}
	};
</script>

<div class="interact-text-container">
	<textarea
		placeholder="What are your thoughts on {formatPersonalityDisplayName(data.slug)}?"
		aria-label="What are your thoughts on {formatPersonalityDisplayName(data.slug)}?"
		class="interact-textbox"
		bind:value={comment}></textarea>
</div>

<div class="interaction-div-display">
	{#snippet submitIcon()}
		<RightIcon
			iconStyle={'margin-left: .5rem; padding: 0 0.25rem;'}
			height={'1.5rem'}
			fill={'var(--lamp-glow)'}
		/>
	{/snippet}
	<Button
		type="button"
		style={comment?.length > 1
			? 'color: var(--lamp-glow); border: 1px solid var(--lamp-glow);'
			: ''}
		title="You only YOLO once"
		onclick={createComment}
		disabled={comment?.length < 1 || submitting}
		iconRight={comment?.length >= 1 ? submitIcon : undefined}
	>
		Submit Comment
	</Button>
</div>

<style lang="scss">
	.interact-text-container {
		position: relative;
		width: 100%;
		min-height: 100px;
	}

	.interact-textbox {
		box-sizing: border-box;
		display: block;
		position: relative;
		border-radius: var(--base-border-radius);
		padding: 1rem;
		width: 100%;
		min-height: 100px;
		resize: vertical;
		background-color: var(--stone-warm);
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent) !important;
		color: var(--ink-bright);
		caret-color: var(--lamp-glow);
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&::placeholder {
			color: var(--ink-dim);
		}

		&:hover {
			border-color: color-mix(in srgb, var(--lamp-glow) 25%, var(--stone-warm));
		}

		&:focus {
			outline: none !important;
			background-color: var(--stone-warm);
			border-color: color-mix(in srgb, var(--lamp-glow) 60%, var(--stone-warm));
			box-shadow:
				0 0 0 3px color-mix(in srgb, var(--lamp-glow) 14%, transparent),
				0 0 18px color-mix(in srgb, var(--lamp-glow) 20%, transparent);
		}
	}
</style>
