<!-- src/lib/components/questions/QuestionItemWrapper.svelte -->
<script lang="ts">
	import QuestionItem from './QuestionItem.svelte';

	let { questionData }: { questionData: any } = $props();
</script>

<QuestionItem {questionData} />
