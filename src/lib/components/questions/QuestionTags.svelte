<!-- src/lib/components/questions/QuestionTags.svelte -->
<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { convertDateToReadable } from '../../../utils/conversions';

	export let questionData: any;

	const newdate = convertDateToReadable(questionData.created_at);
</script>

<a href="/questions/{questionData.url}" style="" class="question-card">
	<p class="question-display">
		{questionData.question_formatted}
	</p>
	<div class="question-meta">
		<span class="comment-span-display">
			{#if questionData.comment_count}
				{questionData.comment_count}
			{/if}
			<MasterCommentIcon
				iconStyle={'margin-left: .5rem'}
				height={'1.5rem'}
				fill={questionData.comment_count ? 'var(--primary)' : ''}
				type={questionData.comment_count ? 'multiple' : 'empty'}
			/>
		</span>
		<span class="date-span">
			{newdate}
		</span>
	</div>
</a>

<style lang="scss">
	// Component uses global question card styles from components.scss
	// No additional styles needed
</style>
