<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { stemmer } from 'stemmer';

	let emotionList: string = '';
	let finalEmotionList: string[] = [];

	const emotions: any = [
		{
			root: 'anger',
			name: 'acrimony',
			rootWord: 'acrimoni'
		},
		{
			name: 'angst',
			root: 'fear',
			rootWord: 'angst'
		},
		{
			root: 'anger',
			name: 'animosity',
			rootWord: 'animos'
		},
		{
			root: 'anger',
			name: 'annoyance',
			rootWord: 'annoy'
		},
		{
			root: 'anger',
			name: 'antagonism',
			rootWord: 'antagon'
		},
		{
			name: 'antipathy',
			root: 'anger',
			rootWord: 'antipathi'
		},
		{
			name: 'anxiety',
			root: 'fear',
			rootWord: 'anxieti'
		},
		{
			name: 'compunction',
			root: 'shame',
			rootWord: 'compunct'
		},
		{
			name: 'concerned',
			root: 'fear',
			rootWord: 'concern'
		},
		{
			name: 'confusion',
			root: 'fear',
			rootWord: 'confus'
		},
		{
			root: 'shame',
			name: 'contempt',
			rootWord: 'contempt'
		},
		{
			name: 'contrition',
			root: 'shame',
			rootWord: 'contrit'
		},
		{
			root: 'shame',
			name: 'degraded',
			rootWord: 'degrad'
		},
		{
			name: 'despair',
			root: 'fear',
			rootWord: 'despair'
		},
		{
			root: 'shame',
			name: 'discredited',
			rootWord: 'discredit'
		},
		{
			root: 'shame',
			name: 'disgusted',
			rootWord: 'disgust'
		},
		{
			root: 'shame',
			name: 'dishonored',
			rootWord: 'dishonor'
		},
		{
			name: 'dismay',
			root: 'fear',
			rootWord: 'dismai'
		},
		{
			root: 'anger',
			name: 'displeasure',
			rootWord: 'displeasur'
		},
		{
			name: 'doubt',
			root: 'fear',
			rootWord: 'doubt'
		},
		{
			name: 'doubtful',
			root: 'fear',
			rootWord: 'doubt'
		},
		{
			name: 'dread',
			root: 'fear',
			rootWord: 'dread'
		},
		{
			root: 'anger',
			name: 'enmity',
			rootWord: 'enmiti'
		},
		{
			root: 'anger',
			name: 'exasperation',
			rootWord: 'exasper'
		},
		{
			name: 'fright',
			root: 'fear',
			rootWord: 'fright'
		},
		{
			root: 'anger',
			name: 'fury',
			rootWord: 'furi'
		},
		{
			root: 'shame',
			name: 'guilt',
			rootWord: 'guilt'
		},
		{
			name: 'guiltiness',
			root: 'shame',
			rootWord: 'guilti'
		},
		{
			root: 'anger',
			name: 'hatred',
			rootWord: 'hatr'
		},
		{
			name: 'horror',
			root: 'fear',
			rootWord: 'horror'
		},
		{
			root: 'shame',
			name: 'humiliation',
			rootWord: 'humili'
		},
		{
			root: 'anger',
			name: 'impatience',
			rootWord: 'impati'
		},
		{
			root: 'anger',
			name: 'indignation',
			rootWord: 'indign'
		},
		{
			root: 'anger',
			name: 'ire',
			rootWord: 'ir'
		},
		{
			root: 'anger',
			name: 'irritation',
			rootWord: 'irrit'
		},
		{
			name: 'jitters',
			root: 'fear',
			rootWord: 'jitter'
		},
		{
			root: 'anger',
			name: 'mad',
			rootWord: 'mad'
		},
		{
			root: 'anger',
			name: 'mad',
			rootWord: 'mad'
		},
		{
			root: 'anger',
			name: 'miffed',
			rootWord: 'mif'
		},
		{
			root: 'shame',
			name: 'mortified',
			rootWord: 'mortifi'
		},
		{
			root: 'anger',
			name: 'outrage',
			rootWord: 'outrag'
		},
		{
			name: 'panic',
			root: 'fear',
			rootWord: 'panic'
		},
		{
			name: 'perplexed',
			root: 'fear',
			rootWord: 'perplex'
		},
		{
			root: 'shame',
			name: 'put-down',
			rootWord: 'put-down'
		},
		{
			root: 'anger',
			name: 'rage',
			rootWord: 'rage'
		},
		{
			name: 'regret',
			root: 'shame',
			rootWord: 'regret'
		},
		{
			root: 'shame',
			name: 'remorse',
			rootWord: 'remors'
		},
		{
			name: 'repugnance',
			root: 'fear',
			rootWord: 'repugn'
		},
		{
			root: 'anger',
			name: 'resentment',
			rootWord: 'resent'
		},
		{
			root: 'shame',
			name: 'scandalized',
			rootWord: 'scandal'
		},
		{
			name: 'scared',
			root: 'fear',
			rootWord: 'scare'
		},
		{
			root: 'shame',
			name: 'sorrowful',
			rootWord: 'sorrow'
		},
		{
			root: 'shame',
			name: 'stigmatize',
			rootWord: 'stigmat'
		},
		{
			name: 'suspicion',
			root: 'fear',
			rootWord: 'suspicion'
		},
		{
			name: 'suspicious',
			root: 'fear',
			rootWord: 'suspici'
		},
		{
			root: 'anger',
			name: 'temper',
			rootWord: 'temper'
		},
		{
			name: 'terror',
			root: 'fear',
			rootWord: 'terror'
		},
		{
			name: 'unease',
			root: 'fear',
			rootWord: 'uneas'
		},
		{
			name: 'unsure',
			root: 'fear',
			rootWord: 'unsur'
		},
		{
			root: 'anger',
			name: 'violence',
			rootWord: 'violenc'
		},
		{
			name: 'worry',
			root: 'fear',
			rootWord: 'worri'
		}
	];
	const emotionsMap: any = {
		acrimoni: {
			root: 'anger',
			name: 'acrimony',
			rootWord: 'acrimoni'
		},
		angst: {
			name: 'angst',
			root: 'fear',
			rootWord: 'angst'
		},
		animos: {
			root: 'anger',
			name: 'animosity',
			rootWord: 'animos'
		},
		annoy: {
			root: 'anger',
			name: 'annoyance',
			rootWord: 'annoy'
		},
		antagon: {
			root: 'anger',
			name: 'antagonism',
			rootWord: 'antagon'
		},
		antipathi: {
			name: 'antipathy',
			root: 'anger',
			rootWord: 'antipathi'
		},
		anxieti: {
			name: 'anxiety',
			root: 'fear',
			rootWord: 'anxieti'
		},
		compunct: {
			name: 'compunction',
			root: 'shame',
			rootWord: 'compunct'
		},
		concern: {
			name: 'concerned',
			root: 'fear',
			rootWord: 'concern'
		},
		confus: {
			name: 'confusion',
			root: 'fear',
			rootWord: 'confus'
		},
		contempt: {
			root: 'shame',
			name: 'contempt',
			rootWord: 'contempt'
		},
		contrit: {
			name: 'contrition',
			root: 'shame',
			rootWord: 'contrit'
		},
		degrad: {
			root: 'shame',
			name: 'degraded',
			rootWord: 'degrad'
		},
		despair: {
			name: 'despair',
			root: 'fear',
			rootWord: 'despair'
		},
		discredit: {
			root: 'shame',
			name: 'discredited',
			rootWord: 'discredit'
		},
		disgust: {
			root: 'shame',
			name: 'disgusted',
			rootWord: 'disgust'
		},
		dishonor: {
			root: 'shame',
			name: 'dishonored',
			rootWord: 'dishonor'
		},
		dismai: {
			name: 'dismay',
			root: 'fear',
			rootWord: 'dismai'
		},
		displeasur: {
			root: 'anger',
			name: 'displeasure',
			rootWord: 'displeasur'
		},
		doubt: {
			name: 'doubtful',
			root: 'fear',
			rootWord: 'doubt'
		},
		dread: {
			name: 'dread',
			root: 'fear',
			rootWord: 'dread'
		},
		enmiti: {
			root: 'anger',
			name: 'enmity',
			rootWord: 'enmiti'
		},
		exasper: {
			root: 'anger',
			name: 'exasperation',
			rootWord: 'exasper'
		},
		fright: {
			name: 'fright',
			root: 'fear',
			rootWord: 'fright'
		},
		furi: {
			root: 'anger',
			name: 'fury',
			rootWord: 'furi'
		},
		guilt: {
			root: 'shame',
			name: 'guilt',
			rootWord: 'guilt'
		},
		guilti: {
			name: 'guiltiness',
			root: 'shame',
			rootWord: 'guilti'
		},
		hatr: {
			root: 'anger',
			name: 'hatred',
			rootWord: 'hatr'
		},
		horror: {
			name: 'horror',
			root: 'fear',
			rootWord: 'horror'
		},
		humili: {
			root: 'shame',
			name: 'humiliation',
			rootWord: 'humili'
		},
		impati: {
			root: 'anger',
			name: 'impatience',
			rootWord: 'impati'
		},
		indign: {
			root: 'anger',
			name: 'indignation',
			rootWord: 'indign'
		},
		ir: {
			root: 'anger',
			name: 'ire',
			rootWord: 'ir'
		},
		irrit: {
			root: 'anger',
			name: 'irritation',
			rootWord: 'irrit'
		},
		jitter: {
			name: 'jitters',
			root: 'fear',
			rootWord: 'jitter'
		},
		mad: {
			root: 'anger',
			name: 'mad',
			rootWord: 'mad'
		},
		mif: {
			root: 'anger',
			name: 'miffed',
			rootWord: 'mif'
		},
		mortifi: {
			root: 'shame',
			name: 'mortified',
			rootWord: 'mortifi'
		},
		outrag: {
			root: 'anger',
			name: 'outrage',
			rootWord: 'outrag'
		},
		panic: {
			name: 'panic',
			root: 'fear',
			rootWord: 'panic'
		},
		perplex: {
			name: 'perplexed',
			root: 'fear',
			rootWord: 'perplex'
		},
		'put-down': {
			root: 'shame',
			name: 'put-down',
			rootWord: 'put-down'
		},
		rage: {
			root: 'anger',
			name: 'rage',
			rootWord: 'rage'
		},
		regret: {
			name: 'regret',
			root: 'shame',
			rootWord: 'regret'
		},
		remors: {
			root: 'shame',
			name: 'remorse',
			rootWord: 'remors'
		},
		repugn: {
			name: 'repugnance',
			root: 'fear',
			rootWord: 'repugn'
		},
		resent: {
			root: 'anger',
			name: 'resentment',
			rootWord: 'resent'
		},
		scandal: {
			root: 'shame',
			name: 'scandalized',
			rootWord: 'scandal'
		},
		scare: {
			name: 'scared',
			root: 'fear',
			rootWord: 'scare'
		},
		sorrow: {
			root: 'shame',
			name: 'sorrowful',
			rootWord: 'sorrow'
		},
		stigmat: {
			root: 'shame',
			name: 'stigmatize',
			rootWord: 'stigmat'
		},
		suspicion: {
			name: 'suspicion',
			root: 'fear',
			rootWord: 'suspicion'
		},
		suspici: {
			name: 'suspicious',
			root: 'fear',
			rootWord: 'suspici'
		},
		temper: {
			root: 'anger',
			name: 'temper',
			rootWord: 'temper'
		},
		terror: {
			name: 'terror',
			root: 'fear',
			rootWord: 'terror'
		},
		uneas: {
			name: 'unease',
			root: 'fear',
			rootWord: 'uneas'
		},
		unsur: {
			name: 'unsure',
			root: 'fear',
			rootWord: 'unsur'
		},
		violenc: {
			root: 'anger',
			name: 'violence',
			rootWord: 'violenc'
		},
		worri: {
			name: 'worry',
			root: 'fear',
			rootWord: 'worri'
		}
	};

	let categories: any = {
		fear: [],
		anger: [],
		shame: [],
		other: []
	};

	const submit = async () => {
		categories = {
			fear: [],
			anger: [],
			shame: [],
			other: []
		};
		let separateEmotions = [];
		let secondSeparation: string[] = [];
		const purgedEmotionList = emotionList.replace(/[^\w\s]/i, ' ');
		if (purgedEmotionList.includes(',')) {
			separateEmotions = purgedEmotionList.split(',').map((e) => e.trim());

			separateEmotions.forEach((e) => {
				let supgroup: string[] = [];
				const separate = e.split('\n').map((e) => e.trim());
				separate.forEach((word) => {
					supgroup.push(word.replace(/[^\w\s]/i, ' '));
				});

				supgroup.forEach((e) => {
					const separate = e.split(' ').map((e) => e.trim());
					separate.forEach((word) => {
						secondSeparation.push(word.replace(/[^\w\s]/i, ' '));
					});
				});
			});
		} else if (purgedEmotionList.includes('\n')) {
			separateEmotions = purgedEmotionList.split('\n').map((e) => {
				return e.replace(/\//g, ' ').replace(/\t/g, ' ');
			});
			separateEmotions.forEach((e) => {
				const separate = e
					.replace(/[^\w\s]/i, ' ')
					.replace(/\t/g, ' ')
					.split(' ')
					.map((e) => e.trim());
				separate.forEach((word) => {
					secondSeparation.push(word.replace(/[^\w\s]/i, ' '));
				});
			});
		} else {
			separateEmotions = purgedEmotionList.split(' ');
			separateEmotions.forEach((e) => {
				const separate = e.split(' ').map((e) => e.trim());
				separate.forEach((word) => {
					secondSeparation.push(word.replace(/[^\w\s]/i, ' '));
				});
			});
		}
		finalEmotionList = secondSeparation.filter((e) => e);
		console.log(finalEmotionList);

		let definitions: string[] = [];
		finalEmotionList.forEach((e) => {
			const stem = stemmer(e);
			if (emotionsMap[stem]) {
				categories[emotionsMap[stem].root].push(e);
			} else {
				categories.other.push(e);
			}
		});
		// console.log(categories);

		// let newemotionsMap = {};

		// emotions.forEach((e) => {
		// 	if (!e.rootWord) {
		// 		e['rootWord'] = stemmer(e.name);
		// 		// newemotionsMap[e.rootWord] = e;
		// 	}
		// });

		// const sortedEmotions = emotions.sort(function (a, b) {
		// 	var textA = a.name.toUpperCase();
		// 	var textB = b.name.toUpperCase();
		// 	return textA < textB ? -1 : textA > textB ? 1 : 0;
		// });
		// sortedEmotions.forEach((e) => {
		// 	newemotionsMap[e.rootWord] = e;
		// });

		// console.log(sortedEmotions);
		// console.log(newemotionsMap);
	};
</script>

<h1>EXPERIMENT</h1>
<h2>An simple experiment from first principles</h2>

<h3>Instructions</h3>
<ol>
	<li>
		<p>
			Take one minute and write down all the negative emotions that you can think of, then click
			submit.
		</p>

		<textarea
			name="list emotions"
			id=""
			cols="30"
			rows="10"
			style="width: 100%;"
			bind:value={emotionList}
		/>
		<input
			type="button"
			name="Submit"
			value="Submit"
			on:click={submit}
			disabled={emotionList.length ? false : true}
			class:form-send={true}
			class={emotionList.length ? 'regular' : 'disabled'}
		/>
	</li>
</ol>

{#if finalEmotionList?.length}
	<div class="row">
		<div class="column">
			<h3>Listed Emotions</h3>
			<div class="column">
				{#each finalEmotionList as emotion}
					<div class="row">{emotion}</div>
				{/each}
			</div>
		</div>
		<div class="column">
			<h3>Enneagram Core Emotions</h3>
			<div class="row">
				{#each Object.keys(categories) as rootEmotion}
					<div class="column">
						<h4>{rootEmotion}</h4>
						<div class="row">
							<div>
								{#each categories[rootEmotion] as emotionz}
									<p>{emotionz}</p>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<br />
	<p>
		Most most emotions can be grouped into 3 main buckets. These buckets are anger, fear and shame.
		If we couldn't classify the emotion we put it into the other category. Try to think of an
		emotion that doesn't fall into one of these buckets.
	</p>
	<br />
	<p>
		Most positive emotions are derivatives of being happy. Being happy does not is not what shapes
		our personality, everyone wants to be happy. It is the ways in which we pursue being happy and
		the pain and trauma that we have been exposed to and that we are sensitive to that shapes our
		personality.
	</p>
	<br />

	<p>
		Which of these core emotions do you experience the most on a regular basis or which one do you
		most relate to the most or is most familiar to you? While that emotion might be familiar to you
		it might be foreign to other personalities. It is important to recognize these emotions in
		yourself and others and not overlook them. We experience a range of emotions from time to time
		and to varying degrees, however there is usually a core emotion that we are most sensitive to
		and that we have developed coping mechanisms around. Or as the enneagram puts it we develop
		certain intelligences around or core emotions.
	</p>
{/if}

<!-- acrimony scandalized animosity contempt annoyance degraded antagonism dishonored displeasure
discredited enmity disgusted exasperation guilt humiliation sus hatred mortified
impatience put-down indignation remorseful stigmatized irritation sorrowful mad outrage rage
resentment temper violence -->
<style lang="scss">
	.row {
		display: flex;
		justify-content: space-evenly;

		margin: 1rem;
	}
	.column {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin: 1rem;
	}
</style>
