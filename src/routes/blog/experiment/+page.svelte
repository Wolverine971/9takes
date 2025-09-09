<!-- src/routes/blog/experiment/+page.svelte -->
<script lang="ts">
	import { stemmer } from 'stemmer';
	import { supabase } from '$lib/supabase';
	// https://www.youtube.com/watch?v=ngekIXiFN3s

	let emotionList: string = '';
	// emotions synonyms
	// how to control your emotions
	// first you need to name your emotion
	import { onMount, tick } from 'svelte';

	onMount(() => {
		let textAreas = document.getElementsByTagName('textarea');

		Array.prototype.forEach.call(textAreas, function (elem) {
			elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
		});
	});

	let formattedListOfEmotions: string[] = [];

	let inserts = 0;

	let emotionsMap: any = {
		abash: {
			root: 'shame',
			name: 'abashment',
			rootWord: 'abash'
		},
		acrimoni: {
			root: 'anger',
			name: 'acrimony',
			rootWord: 'acrimoni'
		},
		affront: {
			root: 'anger',
			name: 'affronted',
			rootWord: 'affront'
		},
		afraid: {
			root: 'fear',
			name: 'afraid',
			rootWord: 'afraid'
		},
		aghast: {
			root: 'fear',
			name: 'aghast',
			rootWord: 'aghast'
		},
		alarm: {
			root: 'fear',
			name: 'alarmed',
			rootWord: 'alarm'
		},
		anger: {
			root: 'anger',
			name: 'anger',
			rootWord: 'anger'
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
		annoi: {
			root: 'anger',
			name: 'annoyed',
			rootWord: 'annoi'
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
		antsi: {
			root: 'fear',
			name: 'antsy',
			rootWord: 'antsi'
		},
		anxieti: {
			name: 'anxiety',
			root: 'fear',
			rootWord: 'anxieti'
		},
		anxiou: {
			root: 'fear',
			name: 'anxious',
			rootWord: 'anxiou'
		},
		apologet: {
			root: 'shame',
			name: 'apologetic',
			rootWord: 'apologet'
		},
		apprehens: {
			root: 'fear',
			name: 'apprehensive',
			rootWord: 'apprehens'
		},
		arous: {
			root: 'fear',
			name: 'aroused',
			rootWord: 'arous'
		},
		bash: {
			root: 'shame',
			name: 'bashful',
			rootWord: 'bash'
		},
		bitter: {
			root: 'anger',
			name: 'bitter',
			rootWord: 'bitter'
		},
		blanch: {
			root: 'fear',
			name: 'blanched',
			rootWord: 'blanch'
		},
		blot: {
			root: 'shame',
			name: 'blot',
			rootWord: 'blot'
		},
		blush: {
			root: 'shame',
			name: 'blushing',
			rootWord: 'blush'
		},
		bug: {
			root: 'fear',
			name: 'bugged',
			rootWord: 'bug'
		},
		care: {
			root: 'fear',
			name: 'careful',
			rootWord: 'care'
		},
		carnal: {
			root: 'shame',
			name: 'carnal',
			rootWord: 'carnal'
		},
		chafe: {
			root: 'anger',
			name: 'chafed',
			rootWord: 'chafe'
		},
		chagrin: {
			root: 'anger',
			name: 'chagrin',
			rootWord: 'chagrin'
		},
		choke: {
			root: 'fear',
			name: 'choked',
			rootWord: 'choke'
		},
		choler: {
			root: 'anger',
			name: 'choler',
			rootWord: 'choler'
		},
		clutch: {
			root: 'fear',
			name: 'clutched',
			rootWord: 'clutch'
		},
		compunct: {
			name: 'compunction',
			root: 'shame',
			rootWord: 'compunct'
		},
		compuncti: {
			root: 'shame',
			name: 'compunctious',
			rootWord: 'compuncti'
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
		connipt: {
			root: 'anger',
			name: 'conniption',
			rootWord: 'connipt'
		},
		conscienc: {
			root: 'shame',
			name: 'conscience',
			rootWord: 'conscienc'
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
		corrupt: {
			root: 'shame',
			name: 'corrupt',
			rootWord: 'corrupt'
		},
		cow: {
			root: 'fear',
			name: 'cowed',
			rootWord: 'cow'
		},
		cowardli: {
			root: 'fear',
			name: 'cowardly',
			rootWord: 'cowardli'
		},
		crestfallen: {
			root: 'shame',
			name: 'crestfallen',
			rootWord: 'crestfallen'
		},
		cross: {
			root: 'anger',
			name: 'cross',
			rootWord: 'cross'
		},
		dander: {
			root: 'anger',
			name: 'dander',
			rootWord: 'dander'
		},
		dastardli: {
			root: 'shame',
			name: 'dastardly',
			rootWord: 'dastardli'
		},
		daunt: {
			root: 'fear',
			name: 'daunted',
			rootWord: 'daunt'
		},
		debas: {
			root: 'shame',
			name: 'debased',
			rootWord: 'debas'
		},
		debauch: {
			root: 'shame',
			name: 'debauched',
			rootWord: 'debauch'
		},
		degrad: {
			root: 'shame',
			name: 'degraded',
			rootWord: 'degrad'
		},
		demean: {
			root: 'shame',
			name: 'demeaned',
			rootWord: 'demean'
		},
		deris: {
			root: 'shame',
			name: 'derision',
			rootWord: 'deris'
		},
		despair: {
			name: 'despair',
			root: 'fear',
			rootWord: 'despair'
		},
		desper: {
			name: 'desperation',
			root: 'fear',
			rootWord: 'desper'
		},
		diabol: {
			root: 'shame',
			name: 'diabolical',
			rootWord: 'diabol'
		},
		disapprob: {
			root: 'anger',
			name: 'disapprobation',
			rootWord: 'disapprob'
		},
		discomfit: {
			root: 'shame',
			name: 'discomfited',
			rootWord: 'discomfit'
		},
		discomposur: {
			root: 'shame',
			name: 'discomposure',
			rootWord: 'discomposur'
		},
		disconcert: {
			root: 'shame',
			name: 'disconcerted',
			rootWord: 'disconcert'
		},
		discourag: {
			root: 'fear',
			name: 'discouraged',
			rootWord: 'discourag'
		},
		discredit: {
			root: 'shame',
			name: 'discredited',
			rootWord: 'discredit'
		},
		disesteem: {
			root: 'shame',
			name: 'disesteem',
			rootWord: 'disesteem'
		},
		disgrac: {
			root: 'shame',
			name: 'disgraceful',
			rootWord: 'disgrac'
		},
		disgust: {
			root: 'shame',
			name: 'disgusted',
			rootWord: 'disgust'
		},
		dishearten: {
			root: 'fear',
			name: 'disheartened',
			rootWord: 'dishearten'
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
		displeas: {
			root: 'anger',
			name: 'displeased',
			rootWord: 'displeas'
		},
		displeasur: {
			root: 'anger',
			name: 'displeasure',
			rootWord: 'displeasur'
		},
		disquiet: {
			root: 'fear',
			name: 'disquieted',
			rootWord: 'disquiet'
		},
		disreput: {
			root: 'shame',
			name: 'disrepute',
			rootWord: 'disreput'
		},
		distemp: {
			root: 'anger',
			name: 'distemper',
			rootWord: 'distemp'
		},
		distraught: {
			root: 'fear',
			name: 'distraught',
			rootWord: 'distraught'
		},
		distress: {
			root: 'shame',
			name: 'distressed',
			rootWord: 'distress'
		},
		disturb: {
			root: 'fear',
			name: 'disturbed',
			rootWord: 'disturb'
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
		drunken: {
			root: 'shame',
			name: 'drunken',
			rootWord: 'drunken'
		},
		embarrass: {
			root: 'shame',
			name: 'embarrassing',
			rootWord: 'embarrass'
		},
		enmiti: {
			root: 'anger',
			name: 'enmity',
			rootWord: 'enmiti'
		},
		enrag: {
			root: 'anger',
			name: 'enraged',
			rootWord: 'enrag'
		},
		exacerb: {
			root: 'anger',
			name: 'exacerbated',
			rootWord: 'exacerb'
		},
		exasper: {
			root: 'anger',
			name: 'exasperation',
			rootWord: 'exasper'
		},
		fear: {
			root: 'fear',
			name: 'fearful',
			rootWord: 'fear'
		},
		feroci: {
			root: 'anger',
			name: 'ferocious',
			rootWord: 'feroci'
		},
		fidgeti: {
			root: 'fear',
			name: 'fidgety',
			rootWord: 'fidgeti'
		},
		fierc: {
			root: 'anger',
			name: 'fierce',
			rootWord: 'fierc'
		},
		fieri: {
			root: 'anger',
			name: 'fiery',
			rootWord: 'fieri'
		},
		flagrant: {
			root: 'shame',
			name: 'flagrant',
			rootWord: 'flagrant'
		},
		fluster: {
			root: 'shame',
			name: 'flustered',
			rootWord: 'fluster'
		},
		fret: {
			root: 'fear',
			name: 'fretful',
			rootWord: 'fret'
		},
		fright: {
			name: 'fright',
			root: 'fear',
			rootWord: 'fright'
		},
		frighten: {
			root: 'fear',
			name: 'frightened',
			rootWord: 'frighten'
		},
		frozen: {
			root: 'fear',
			name: 'frozen',
			rootWord: 'frozen'
		},
		frustrat: {
			root: 'anger',
			name: 'frustration',
			rootWord: 'frustrat'
		},
		fume: {
			root: 'anger',
			name: 'fuming',
			rootWord: 'fume'
		},
		furi: {
			root: 'anger',
			name: 'fury',
			rootWord: 'furi'
		},
		furiou: {
			root: 'anger',
			name: 'furious',
			rootWord: 'furiou'
		},
		gall: {
			root: 'anger',
			name: 'gall',
			rootWord: 'gall'
		},
		guilt: {
			root: 'shame',
			name: 'guilt',
			rootWord: 'guilt'
		},
		greedi: {
			root: 'fear',
			name: 'greedy',
			rootWord: 'greedi'
		},
		guilti: {
			name: 'guiltiness',
			root: 'shame',
			rootWord: 'guilti'
		},
		hate: {
			root: 'anger',
			name: 'hateful',
			rootWord: 'hate'
		},
		hatr: {
			root: 'anger',
			name: 'hatred',
			rootWord: 'hatr'
		},
		heinou: {
			root: 'shame',
			name: 'heinous',
			rootWord: 'heinou'
		},
		hesit: {
			root: 'fear',
			name: 'hesitant',
			rootWord: 'hesit'
		},
		hopeless: {
			root: 'fear',
			name: 'hopeless',
			rootWord: 'hopeless'
		},

		horrifi: {
			root: 'fear',
			name: 'horrified',
			rootWord: 'horrifi'
		},
		horror: {
			name: 'horror',
			root: 'fear',
			rootWord: 'horror'
		},
		huff: {
			root: 'anger',
			name: 'huffy',
			rootWord: 'huff'
		},
		huffi: {
			root: 'anger',
			name: 'huffy',
			rootWord: 'huffi'
		},
		humbl: {
			root: 'shame',
			name: 'humble',
			rootWord: 'humbl'
		},
		humili: {
			root: 'shame',
			name: 'humiliation',
			rootWord: 'humili'
		},
		ignomini: {
			root: 'shame',
			name: 'ignominy',
			rootWord: 'ignomini'
		},
		immodest: {
			root: 'shame',
			name: 'immodest',
			rootWord: 'immodest'
		},
		immor: {
			root: 'shame',
			name: 'immoral',
			rootWord: 'immor'
		},
		impass: {
			root: 'anger',
			name: 'impassioned',
			rootWord: 'impass'
		},
		impati: {
			root: 'anger',
			name: 'impatience',
			rootWord: 'impati'
		},
		impur: {
			root: 'shame',
			name: 'impure',
			rootWord: 'impur'
		},
		incens: {
			root: 'anger',
			name: 'incensed',
			rootWord: 'incens'
		},
		indec: {
			root: 'shame',
			name: 'indecent',
			rootWord: 'indec'
		},
		indign: {
			root: 'anger',
			name: 'indignation',
			rootWord: 'indign'
		},
		infam: {
			root: 'shame',
			name: 'infamous',
			rootWord: 'infam'
		},
		infami: {
			root: 'shame',
			name: 'infamy',
			rootWord: 'infami'
		},
		inflam: {
			root: 'anger',
			name: 'inflamed',
			rootWord: 'inflam'
		},
		infuri: {
			root: 'anger',
			name: 'infuriation',
			rootWord: 'infuri'
		},
		intemper: {
			root: 'shame',
			name: 'intemperate',
			rootWord: 'intemper'
		},
		intimid: {
			root: 'fear',
			name: 'intimidated',
			rootWord: 'intimid'
		},
		ir: {
			root: 'anger',
			name: 'ire',
			rootWord: 'ir'
		},
		irasc: {
			root: 'anger',
			name: 'irascibility',
			rootWord: 'irasc'
		},
		irat: {
			root: 'anger',
			name: 'irate',
			rootWord: 'irat'
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
		jitteri: {
			root: 'fear',
			name: 'jittery',
			rootWord: 'jitteri'
		},
		jumpi: {
			root: 'fear',
			name: 'jumpy',
			rootWord: 'jumpi'
		},
		lewd: {
			root: 'shame',
			name: 'lewd',
			rootWord: 'lewd'
		},
		lone: {
			root: 'shame',
			name: 'lonely',
			rootWord: 'lone'
		},
		mad: {
			root: 'anger',
			name: 'mad',
			rootWord: 'mad'
		},
		madden: {
			root: 'anger',
			name: 'maddened',
			rootWord: 'madden'
		},
		mean: {
			root: 'shame',
			name: 'mean',
			rootWord: 'mean'
		},
		meek: {
			root: 'shame',
			name: 'meek',
			rootWord: 'meek'
		},
		mif: {
			root: 'anger',
			name: 'miffed',
			rootWord: 'mif'
		},
		miff: {
			root: 'anger',
			name: 'miff',
			rootWord: 'miff'
		},
		mortif: {
			root: 'shame',
			name: 'mortification',
			rootWord: 'mortif'
		},
		mortifi: {
			root: 'shame',
			name: 'mortified',
			rootWord: 'mortifi'
		},
		muddl: {
			root: 'shame',
			name: 'muddled',
			rootWord: 'muddl'
		},
		nervi: {
			root: 'fear',
			name: 'nervy',
			rootWord: 'nervi'
		},
		nervou: {
			root: 'fear',
			name: 'nervous',
			rootWord: 'nervou'
		},
		nettl: {
			root: 'anger',
			name: 'nettled',
			rootWord: 'nettl'
		},
		notori: {
			root: 'shame',
			name: 'notorious',
			rootWord: 'notori'
		},
		obloqui: {
			root: 'shame',
			name: 'obloquy',
			rootWord: 'obloqui'
		},
		obscen: {
			root: 'shame',
			name: 'obscene',
			rootWord: 'obscen'
		},
		odium: {
			root: 'shame',
			name: 'odium',
			rootWord: 'odium'
		},
		offend: {
			root: 'anger',
			name: 'offended',
			rootWord: 'offend'
		},
		opprobri: {
			root: 'shame',
			name: 'opprobrious',
			rootWord: 'opprobri'
		},
		opprobrium: {
			root: 'shame',
			name: 'opprobrium',
			rootWord: 'opprobrium'
		},
		outrag: {
			root: 'anger',
			name: 'outrage',
			rootWord: 'outrag'
		},
		overwrought: {
			root: 'fear',
			name: 'overwrought',
			rootWord: 'overwrought'
		},
		panic: {
			name: 'panic',
			root: 'fear',
			rootWord: 'panic'
		},
		peevish: {
			root: 'anger',
			name: 'peevishness',
			rootWord: 'peevish'
		},
		penit: {
			root: 'shame',
			name: 'penitent',
			rootWord: 'penit'
		},
		perplex: {
			name: 'perplexed',
			root: 'fear',
			rootWord: 'perplex'
		},
		perturb: {
			root: 'fear',
			name: 'perturbed',
			rootWord: 'perturb'
		},
		petrifi: {
			root: 'fear',
			name: 'petrified',
			rootWord: 'petrifi'
		},
		petul: {
			root: 'anger',
			name: 'petulance',
			rootWord: 'petul'
		},
		piqu: {
			root: 'anger',
			name: 'pique',
			rootWord: 'piqu'
		},
		'piss-off': {
			root: 'anger',
			name: 'pissed',
			rootWord: 'piss'
		},
		proflig: {
			root: 'shame',
			name: 'profligate',
			rootWord: 'proflig'
		},
		provok: {
			root: 'anger',
			name: 'provoked',
			rootWord: 'provok'
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
		rankl: {
			root: 'anger',
			name: 'rankling',
			rootWord: 'rankl'
		},
		rattl: {
			root: 'fear',
			name: 'rattled',
			rootWord: 'rattl'
		},
		regret: {
			name: 'regret',
			root: 'shame',
			rootWord: 'regret'
		},
		reluct: {
			root: 'fear',
			name: 'reluctant',
			rootWord: 'reluct'
		},
		remors: {
			root: 'shame',
			name: 'remorse',
			rootWord: 'remors'
		},
		repent: {
			root: 'shame',
			name: 'repentant',
			rootWord: 'repent'
		},
		reprehens: {
			root: 'shame',
			name: 'reprehensible',
			rootWord: 'reprehens'
		},
		reproach: {
			root: 'shame',
			name: 'reproach',
			rootWord: 'reproach'
		},
		reprob: {
			root: 'shame',
			name: 'reprobate',
			rootWord: 'reprob'
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
		restless: {
			root: 'fear',
			name: 'restless',
			rootWord: 'restless'
		},
		ribald: {
			root: 'shame',
			name: 'ribald',
			rootWord: 'ribald'
		},
		rile: {
			root: 'anger',
			name: 'riled',
			rootWord: 'rile'
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
		shake: {
			root: 'fear',
			name: 'shaking',
			rootWord: 'shake'
		},
		shaki: {
			root: 'fear',
			name: 'shaky',
			rootWord: 'shaki'
		},
		shame: {
			root: 'shame',
			name: 'shaming',
			rootWord: 'shame'
		},
		shamefac: {
			root: 'shame',
			name: 'shamefaced',
			rootWord: 'shamefac'
		},
		shamefaced: {
			root: 'shame',
			name: 'shamefacedness',
			rootWord: 'shamefaced'
		},
		sheepish: {
			root: 'shame',
			name: 'sheepish',
			rootWord: 'sheepish'
		},
		shiveri: {
			root: 'fear',
			name: 'shivery',
			rootWord: 'shiveri'
		},
		shock: {
			root: 'fear',
			name: 'shocking',
			rootWord: 'shock'
		},
		shy: {
			root: 'fear',
			name: 'shy',
			rootWord: 'shy'
		},
		sin: {
			root: 'shame',
			name: 'sinful',
			rootWord: 'sin'
		},
		smear: {
			root: 'shame',
			name: 'smear',
			rootWord: 'smear'
		},
		solicit: {
			root: 'fear',
			name: 'solicitous',
			rootWord: 'solicit'
		},
		sore: {
			root: 'anger',
			name: 'soreness',
			rootWord: 'sore'
		},
		sorri: {
			root: 'shame',
			name: 'sorry',
			rootWord: 'sorri'
		},
		sorrow: {
			root: 'shame',
			name: 'sorrowful',
			rootWord: 'sorrow'
		},
		splenet: {
			root: 'shame',
			name: 'splenetic',
			rootWord: 'splenet'
		},
		spook: {
			root: 'fear',
			name: 'spooked',
			rootWord: 'spook'
		},
		startl: {
			root: 'fear',
			name: 'startled',
			rootWord: 'startl'
		},
		stew: {
			root: 'anger',
			name: 'stew',
			rootWord: 'stew'
		},
		stress: {
			root: 'fear',
			name: 'stress',
			rootWord: 'stress'
		},
		stigma: {
			root: 'shame',
			name: 'stigma',
			rootWord: 'stigma'
		},
		stigmat: {
			root: 'shame',
			name: 'stigmatize',
			rootWord: 'stigmat'
		},
		stricken: {
			root: 'shame',
			name: 'stricken',
			rootWord: 'stricken'
		},
		stun: {
			root: 'fear',
			name: 'stunned',
			rootWord: 'stun'
		},
		submiss: {
			root: 'shame',
			name: 'submissive',
			rootWord: 'submiss'
		},
		sullen: {
			root: 'anger',
			name: 'sullen',
			rootWord: 'sullen'
		},
		suspici: {
			name: 'suspicious',
			root: 'fear',
			rootWord: 'suspici'
		},
		suspicion: {
			name: 'suspicion',
			root: 'fear',
			rootWord: 'suspicion'
		},
		tantrum: {
			root: 'anger',
			name: 'tantrum',
			rootWord: 'tantrum'
		},
		temper: {
			root: 'anger',
			name: 'temper',
			rootWord: 'temper'
		},
		terrifi: {
			root: 'fear',
			name: 'terrified',
			rootWord: 'terrifi'
		},
		terror: {
			name: 'terror',
			root: 'fear',
			rootWord: 'terror'
		},
		tiff: {
			root: 'anger',
			name: 'tiff',
			rootWord: 'tiff'
		},
		timid: {
			root: 'fear',
			name: 'timid',
			rootWord: 'timid'
		},
		timor: {
			root: 'fear',
			name: 'timorous',
			rootWord: 'timor'
		},
		trembl: {
			root: 'fear',
			name: 'trembling',
			rootWord: 'trembl'
		},
		troubl: {
			root: 'fear',
			name: 'troubled',
			rootWord: 'troubl'
		},
		umbrag: {
			root: 'anger',
			name: 'umbrage',
			rootWord: 'umbrag'
		},
		unbecom: {
			root: 'shame',
			name: 'unbecoming',
			rootWord: 'unbecom'
		},
		unclean: {
			root: 'shame',
			name: 'unclean',
			rootWord: 'unclean'
		},
		uneas: {
			name: 'unease',
			root: 'fear',
			rootWord: 'uneas'
		},
		uneasi: {
			root: 'fear',
			name: 'uneasy',
			rootWord: 'uneasi'
		},
		unglu: {
			root: 'fear',
			name: 'unglued',
			rootWord: 'unglu'
		},
		unquiet: {
			root: 'fear',
			name: 'unquiet',
			rootWord: 'unquiet'
		},
		unsettl: {
			name: 'unsettled',
			root: 'fear',
			rootWord: 'unsettl'
		},
		unsur: {
			name: 'unsure',
			root: 'fear',
			rootWord: 'unsur'
		},
		unworthi: {
			root: 'shame',
			name: 'unworthy',
			rootWord: 'unworthi'
		},
		upset: {
			root: 'fear',
			name: 'upset',
			rootWord: 'upset'
		},
		uptight: {
			root: 'anger',
			name: 'uptight',
			rootWord: 'uptight'
		},
		vex: {
			root: 'anger',
			name: 'vexed',
			rootWord: 'vex'
		},
		vexat: {
			root: 'anger',
			name: 'vexation',
			rootWord: 'vexat'
		},
		vile: {
			root: 'shame',
			name: 'vile',
			rootWord: 'vile'
		},
		villain: {
			root: 'shame',
			name: 'villainous',
			rootWord: 'villain'
		},
		violenc: {
			root: 'anger',
			name: 'violence',
			rootWord: 'violenc'
		},
		vulgar: {
			root: 'shame',
			name: 'vulgar',
			rootWord: 'vulgar'
		},
		watch: {
			root: 'fear',
			name: 'watchful',
			rootWord: 'watch'
		},
		wick: {
			root: 'shame',
			name: 'wicked',
			rootWord: 'wick'
		},
		wire: {
			root: 'fear',
			name: 'wired',
			rootWord: 'wire'
		},
		worri: {
			name: 'worry',
			root: 'fear',
			rootWord: 'worri'
		},
		wrath: {
			root: 'anger',
			name: 'wrathful',
			rootWord: 'wrath'
		},

		//

		disguest: {
			root: 'shame',
			name: 'disguest',
			rootWord: 'disguest'
		},
		nger: {
			root: 'anger',
			name: 'nger',
			rootWord: 'nger'
		},
		exasperati: {
			root: 'anger',
			name: 'exasperati',
			rootWord: 'exasperati'
		},
		jealou: {
			root: 'anger',
			name: 'jealous',
			rootWord: 'jealou'
		},
		envi: {
			root: 'anger',
			name: 'envy',
			rootWord: 'envi'
		},

		covet: {
			root: 'shame',
			name: 'covetous',
			rootWord: 'covet'
		},
		helpless: {
			root: 'fear',
			name: 'helpless',
			rootWord: 'helpless'
		},
		alon: {
			root: 'fear',
			name: 'alone',
			rootWord: 'alon'
		},

		grumpi: {
			root: 'anger',
			name: 'grumpy',
			rootWord: 'grumpi'
		},
		moodi: {
			root: 'anger',
			name: 'moody',
			rootWord: 'moodi'
		},
		peur: {
			root: 'fear',
			name: 'peur',
			rootWord: 'peur'
		},
		anxi: {
			root: 'fear',
			name: 'anxi',
			rootWord: 'anxi'
		},
		dout: {
			root: 'fear',
			name: 'doute',
			rootWord: 'dout'
		},
		tristess: {
			root: 'shame',
			name: 'tristesse',
			rootWord: 'tristess'
		},
		jalousi: {
			root: 'shame',
			name: 'jalousie',
			rootWord: 'jalousi'
		},
		hain: {
			root: 'anger',
			name: 'haine',
			rootWord: 'hain'
		},
		culpabilit: {
			root: 'shame',
			name: 'culpabilit',
			rootWord: 'culpabilit'
		},
		hont: {
			root: 'shame',
			name: 'honte',
			rootWord: 'hont'
		},
		discomfort: {
			root: 'fear',
			name: 'discomfort',
			rootWord: 'discomfort'
		},
		pain: {
			root: 'fear',
			name: 'pain',
			rootWord: 'pain'
		},
		melencholi: {
			root: 'shame',
			name: 'melencholy',
			rootWord: 'melencholi'
		},
		sad: {
			root: 'shame',
			name: 'sadness',
			rootWord: 'sad'
		},

		desol: {
			root: 'shame',
			name: 'desolation',
			rootWord: 'desol'
		},
		hollow: {
			root: 'shame',
			name: 'hollowness',
			rootWord: 'hollow'
		},

		grief: {
			root: 'shame',
			name: 'grief',
			rootWord: 'grief'
		},
		depress: {
			root: 'shame',
			name: 'depressed',
			rootWord: 'depress'
		},
		ira: {
			root: 'anger',
			name: 'ira',
			rootWord: 'ira'
		},
		ansiedad: {
			root: 'fear',
			name: 'ansiedad',
			rootWord: 'ansiedad'
		},
		aburrimiento: {
			root: 'shame',
			name: 'aburrimiento',
			rootWord: 'aburrimiento'
		},
		desesperaci: {
			root: 'fear',
			name: 'desesperaci',
			rootWord: 'desesperaci'
		},
		tristeza: {
			root: 'shame',
			name: 'tristeza',
			rootWord: 'tristeza'
		},
		depresi: {
			root: 'shame',
			name: 'depresi',
			rootWord: 'depresi'
		},
		negatividad: {
			root: 'shame',
			name: 'negatividad',
			rootWord: 'negatividad'
		},
		nico: {
			root: 'fear',
			name: 'nico',
			rootWord: 'nico'
		},
		ataqu: {
			root: 'fear',
			name: 'ataques',
			rootWord: 'ataqu'
		},
		entumecimiento: {
			root: 'fear',
			name: 'entumecimiento',
			rootWord: 'entumecimiento'
		},
		myseri: {
			root: 'shame',
			name: 'mysery',
			rootWord: 'myseri'
		},
		feisti: {
			root: 'anger',
			name: 'feisty',
			rootWord: 'feisti'
		},
		disappoint: {
			root: 'shame',
			name: 'disappointment',
			rootWord: 'disappoint'
		},
		fool: {
			root: 'shame',
			name: 'fooled',
			rootWord: 'fool'
		},
		belittl: {
			root: 'shame',
			name: 'belittle',
			rootWord: 'belittl'
		},
		reject: {
			root: 'shame',
			name: 'rejection',
			rootWord: 'reject'
		},
		critic: {
			root: 'shame',
			name: 'criticism',
			rootWord: 'critic'
		},
		empti: {
			root: 'shame',
			name: 'emptiness',
			rootWord: 'empti'
		},
		numb: {
			root: 'shame',
			name: 'numbness',
			rootWord: 'numb'
		},
		overwhelm: {
			root: 'fear',
			name: 'overwhelm',
			rootWord: 'overwhelm'
		},
		jealousi: {
			root: 'anger',
			name: 'jealousy',
			rootWord: 'jealousi'
		},
		lust: {
			root: 'anger',
			name: 'lust',
			rootWord: 'lust'
		},
		isol: {
			root: 'shame',
			name: 'isolation',
			rootWord: 'isol'
		},
		betray: {
			root: 'anger',
			name: 'betrayal',
			rootWord: 'betray'
		}
	};

	let categories: any = {
		fear: [],
		anger: [],
		shame: [],
		other: []
	};

	const getFilteredList = async () => {
		let finalEmotionList = [];
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

		return finalEmotionList;
	};

	// const generateSpans = async () => {
	// 	const box = document.getElementById(`emotions-box`);
	// 	const div = document.createElement('div');
	// 	div.height = box.offsetHeight;
	// 	div.width = box.offsetWidth;
	// 	position;
	// 	formattedListOfEmotions.forEach((emotionIdentified) => {});
	// };

	const filter = async () => {
		let finalEmotionList: string[] = await getFilteredList();

		finalEmotionList.forEach((e: any) => {
			const rootWord = stemmer(e);
			if (!emotionsMap[rootWord]) {
				emotionsMap[rootWord] = {
					root: '',
					name: e,
					rootWord: rootWord
				};
			}
		});
		let newEmotionsMap: any = {};
		let keys = Object.keys(emotionsMap);

		const sortedEmotions = keys.sort(function (a, b) {
			var textA = a.toUpperCase();
			var textB = b.toUpperCase();
			return textA < textB ? -1 : textA > textB ? 1 : 0;
		});
		sortedEmotions.forEach((e: any) => {
			newEmotionsMap[e] = emotionsMap[e];
		});

		formattedListOfEmotions = finalEmotionList;

		// console.log(sortedEmotions);
		// console.log(newEmotionsMap);
	};

	const submit = async () => {
		let finalEmotionList: string[] = await getFilteredList();

		// let definitions: string[] = [];
		let others: any[] = [];
		const map = {};
		finalEmotionList.forEach((e) => {
			if (map[e]) {
				emotionList = emotionList.replace(e, '');
			} else {
				map[e] = 1;
			}
			const stem = stemmer(e);
			if (emotionsMap[stem]) {
				categories[emotionsMap[stem].root].push(e);
			} else {
				categories.other.push(e);
				others.push({ word: e, stem: stem });
			}
		});
		formattedListOfEmotions = finalEmotionList;

		if (inserts < 3 && others.length) {
			inserts++;
			for await (const otherword of others) {
				await supabase.from('new-words').insert([{ word: otherword.word, stem: otherword.stem }]);
			}
		}
		swap = false;
		if (textArea) {
			const elem = textArea.getBoundingClientRect();
			height = elem.height;
			width = elem.width;
			submitBox = true;

			await tick();
		} else {
			submitBox = false;
		}

		await flip();
	};

	// anger shame fear panic outrage incensed disgust, fidgety exasperation dread dismay derision debased
	const flip = async () => {
		let firstPos: any[] = [];
		formattedListOfEmotions.forEach((emotion, i) => {
			const element = document.getElementById(`${emotion}-${i}`);
			if (element) {
				firstPos.push({ emotion, box: element.getBoundingClientRect() });
			}
		});
		// });
		swap = !swap;
		submitBox = false;

		await tick();

		let secondPos = [];
		formattedListOfEmotions.forEach((emotion, i) => {
			const element = document.getElementById(`${emotion}-${i}`);
			if (element) {
				secondPos.push({ emotion, box: element.getBoundingClientRect() });
			}
		});

		if (swap) {
			firstPos.forEach((e, i) => {
				const invertx = firstPos[i]?.box?.left - secondPos[i]?.box?.left;
				const inverty = firstPos[i]?.box?.bottom - secondPos[i]?.box?.bottom;
				const elem = secondPos.find((el) => el.emotion === e.emotion);
				const id = `${elem.emotion}-${i}`;
				const emotion = document.getElementById(id);
				const animate = emotion.animate(
					[
						{ translate: `${invertx}px ${inverty}px` },
						{ translate: '0px', color: 'var(--primary)' }
					],
					{
						duration: 3000,
						fill: 'forwards',
						easing: 'ease-out'
					}
				);
			});
		} else {
			secondPos.forEach((e, i) => {
				const invertx = firstPos[i]?.box?.left - secondPos[i]?.box?.left;
				const inverty = firstPos[i]?.box?.bottom - secondPos[i]?.box?.bottom;
				const id = `${firstPos[i].emotion}-${i}`;
				const emotion = document.getElementById(id);
				const animate = emotion.animate(
					[{ translate: `${invertx}px ${inverty}px` }, { translate: '0px' }],
					{
						duration: 3000,
						fill: 'forwards',
						easing: 'ease-out'
					}
				);
			});
		}
	};

	let swap = false;
	let submitBox = false;
	let textArea: HTMLDivElement;
	let height: number;
	let width: number;
</script>

<svelte:head>
	<title>One Minute Emotions Experiment | Understand Your Feelings | 9takes</title>
	<meta
		name="description"
		content="Discover your emotional landscape with our 1-minute Emotions Experiment. List, categorize, and understand your feelings using our interactive Emotion Analyzer tool."
	/>
	<meta
		name="keywords"
		content="emotions experiment, emotion analyzer, feelings list, emotional intelligence, personality test, enneagram, 9takes"
	/>
	<meta name="author" content="DJ Wayne" />
	<meta property="og:title" content="One Minute Emotions Experiment | 9takes" />
	<meta
		property="og:description"
		content="Uncover your emotional patterns in just one minute. Try our interactive Emotion Analyzer and gain insights into your personality."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://9takes.com/blog/experiment" />
	<meta property="og:image" content="https://9takes.com/blogs/experiment.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:title" content="One Minute Emotions Experiment | 9takes" />
	<meta
		name="twitter:description"
		content="Explore your emotions in just 60 seconds. Use our Emotion Analyzer to understand your feelings and personality better."
	/>
	<meta name="twitter:image" content="https://9takes.com/blogs/s-experiment.webp" />
	<link rel="canonical" href="https://9takes.com/blog/experiment" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": "https://9takes.com/blog/experiment",
					"url": "https://9takes.com/blog/experiment",
					"name": "One Minute Emotions Experiment | Understand Your Feelings | 9takes",
					"description": "Discover your emotional landscape with our 1-minute Emotions Experiment. List, categorize, and understand your feelings using our interactive Emotion Analyzer tool.",
					"inLanguage": "en-US",
					"isPartOf": {
						"@type": "WebSite",
						"@id": "https://9takes.com",
						"name": "9takes",
						"description": "Personality Insights and Emotional Intelligence",
						"url": "https://9takes.com/"
					},
					"creator": {
						"@type": "Person",
						"name": "DJ Wayne",
						"sameAs": [
							"https://www.instagram.com/djwayne3/",
							"https://www.youtube.com/@djwayne3",
							"https://www.linkedin.com/in/davidtwayne/",
							"https://twitter.com/djwayne3"
						]
					},
					"author": {
						"@type": "Person",
						"name": "DJ Wayne",
						"sameAs": [
							"https://www.instagram.com/djwayne3/",
							"https://www.youtube.com/@djwayne3",
							"https://www.linkedin.com/in/davidtwayne/",
							"https://twitter.com/djwayne3"
						]
					},
					"dateModified": {
						"@type": "Date",
						"@value": "2024-06-11"
					},
					"datePublished": {
						"@type": "Date",
						"@value": "2024-02-01"
					},
					"image": {
						"@type": "ImageObject",
						"height": 900,
						"url": "https://9takes.com/blogs/s-experiment.webp",
						"width": 900
					},
					"headline": "One Minute Emotions Experiment: Analyze and Understand Your Feelings",
					"mainEntityOfPage": {
						"@id": "https://9takes.com/blog/experiment",
						"@type": "WebPage"
					},
					"publisher": {
						"@type": "Organization",
						"name": "9takes",
						"sameAs": [
							"https://www.instagram.com/9takesdotcom/",
							"https://twitter.com/9takesdotcom"
						],
						"logo": {
							"@type": "ImageObject",
							"url": "https://9takes.com/brand/aero.png"
						}
					}
				}
			]
		}
	</script>
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>

<div class="background-area-box-tint">
	<!-- <h1>EXPERIMENT</h1> -->
	<h1 style="margin-bottom: 0;">The one minute experiment for Emotions</h1>
	<h2 style="margin-top: 0; padding-top:0;">
		Demystify emotions and understand what other people are feeling.
	</h2>

	<!-- <h3>Instructions</h3> -->

	<!-- <ol>
	<li> -->
	<div>
		<h3 style="padding: 1rem 0;">Instructions:</h3>
		<p>
			Take one minute and write down all the <span class="underline">negative emotions</span>
			that are one word that you can think of.
		</p>
		<ul>
			<li>Time yourself for 1 minute</li>
			<li>Write all the negative emotions</li>
			<li>Only write emotions that are one word</li>
			<li>Only use English</li>
		</ul>

		<!-- // anger shame fear panic outrage incensed disgust, fidgety exasperation dread dismay derision debased -->
		<div style="position: relative;">
			{#if !submitBox}
				<textarea
					bind:this={textArea}
					align="center"
					name="list emotions"
					cols="30"
					rows="10"
					style="width: 100%;"
					placeholder="emotion 1\nemotion 2\nemotion 3\n..."
					bind:value={emotionList}
				/>
			{:else}
				<div
					on:click={() => (submitBox = false)}
					role="button"
					tabindex="0"
					on:keydown={(e) => e.key === 'Enter' && (submitBox = false)}
					class="emotion-div"
					style={`min-height: ${height}px; max-width: ${width}px;`}
				>
					{#each formattedListOfEmotions as emotion, i}
						<span style="margin: .3rem;" id={`${emotion}-${i}`}>{emotion}</span>
					{/each}
				</div>
			{/if}
		</div>
		<input
			type="button"
			name="Submit"
			value="Submit"
			on:click={submit}
			disabled={emotionList.length ? false : true}
			class:form-send={true}
			class="{emotionList.length ? 'regular' : 'disabled'} btn btn-primary"
			style="float:inline-end"
		/>
		<!-- {#if data?.session?.user}
		<input
			type="button"
			name="Filter"
			value="Filter"
			on:click={filter}
			class:form-send={true}
			class={emotionList.length ? 'regular' : 'disabled'}
		/>
	{/if} -->
	</div>
	<!-- </li>
</ol> -->

	{#if formattedListOfEmotions?.length}
		<!-- <input
		type="button"
		name="Swap"
		value="Swap"
		on:click={flip}
		class:form-send={true}
		class="regular"
	/> -->
		<div class="row">
			<!-- <div class="column">
			<h3>Listed Emotions</h3>
			{#if !swap}
				<div class="column" data-layout={layout}>
					{#each formattedListOfEmotions as emotion, i}
						<div class="row circle" id={`${emotion}-${i}`}>{emotion}</div>
					{/each}
				</div>
			{/if}
		</div> -->
			<div class="emotions-box">
				<h3 style="text-align: center;">Enneagram Core Emotions</h3>
				{#if swap}
					<div class="row">
						{#each Object.keys(categories) as rootEmotion}
							<div class="column">
								<h4>{rootEmotion}</h4>
								<div class="row" style="align-items: baseline;">
									<div>
										{#each categories[rootEmotion] as categorizedEmotion}
											<div
												class="circle"
												id={`${categorizedEmotion}-${formattedListOfEmotions.indexOf(
													categorizedEmotion
												)}`}
											>
												{categorizedEmotion}
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<p>
			Most emotions can be grouped into three main buckets: anger, fear, and shame. If we can't
			classify an emotion, we put it into another category.
		</p>
		<p><b>Try to think of an emotion that doesn't fall into one of these buckets.</b></p>
		<hr />

		<p>
			Most positive emotions are derivatives of being happy. And being happy does not shape our
			personality. Everyone wants to be happy. It is the pain and trauma that we have been exposed
			to that shapes our personality.
		</p>

		<ul>
			<li>Which of these core emotions do you experience the most regularly?</li>
			<li>Which one do you relate to the most or is most familiar to you?</li>
		</ul>

		<p>Some emotions might be all too familiar while others might seem foreign.</p>

		<p>
			We experience a range of emotions from time to time and in varying degrees. However, there is
			usually a core emotion that we are most sensitive to and have developed coping mechanisms
			around. Or, as the Enneagram puts it, we develop certain intelligences around our core
			emotions.
		</p>

		<p>
			If you gravitate to one bucket of emotions that may be a clue in <a
				href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
				>determining your personality</a
			>.
		</p>

		<h2>Additional Reading</h2>

		How to regulate your emotions 👇

		<div class="tweet-div">
			<blockquote class="twitter-tweet">
				<p lang="en" dir="ltr">
					Everyone gets stressed, but not everyone acts the same when stressed.<br /><br />How come?<br
					/><br />Well its because everyone makes the same mistake.<br /><br />Its not the situation
					that stressed you out. Its the emotions that come up because of that situation.<br /><br
					/>Let me explain
				</p>
				&mdash; DJocrates (@9takesdotcom)<a
					href="https://twitter.com/9takesdotcom/status/1788777882149425212?ref_src=twsrc%5Etfw"
					>May 10, 2024</a
				>
			</blockquote>
			<blockquote class="twitter-tweet">
				<p lang="en" dir="ltr">
					How To (Actually) Regulate Your Emotions<br /><br />A STEP BY STEP GUIDE:
				</p>
				&mdash; Dr. Nicole LePera (@Theholisticpsyc)<a
					href="https://twitter.com/Theholisticpsyc/status/1717556727510634854?ref_src=twsrc%5Etfw"
					>October 26, 2023</a
				>
			</blockquote>

			<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		</div>
	{/if}
</div>

<!-- acrimony scandalized animosity contempt annoyance degraded antagonism dishonored displeasure
discredited enmity disgusted exasperation guilt humiliation sus hatred mortified
impatience put-down indignation remorseful stigmatized irritation sorrowful mad outrage rage
resentment temper violence -->
<style lang="scss">
	.underline {
		text-decoration: underline;
	}

	.tweet-div {
		display: flex;
		gap: 1rem;
	}

	.twitter-tweet {
		width: 50%;
	}
	.emotions-box {
		border-radius: var(--base-border-radius);
		border: var(--classic-border);
		width: 100%;
	}
	.row {
		display: flex;
		justify-content: space-evenly;
		margin: 1rem 0;
		align-items: baseline;
		width: auto;
	}

	textarea {
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
	}
	.column {
		max-width: 100px;
	}
	.emotion-div {
		border-radius: var(--base-border-radius);
		border: 1px solid var(--primary);
		position: inherit;
		top: 0;
		left: 0;
		box-sizing: border-box;
		padding: 0.3rem 0;
	}
</style>
