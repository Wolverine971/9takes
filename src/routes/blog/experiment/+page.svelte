<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { stemmer } from 'stemmer';
	import { supabase } from '$lib/supabase';

	let emotionList: string = '';
	// let finalEmotionList: string[] = [];

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

	const submit = async () => {
		let finalEmotionList: string[] = await getFilteredList();

		// let definitions: string[] = [];
		let others: any[] = [];
		finalEmotionList.forEach((e) => {
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
	};

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
				// emotions.push({
				// 	root: '',
				// 	name: e,
				// 	rootWord
				// });
				// newemotionsMap[e.rootWord] = e;
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
		console.log(newEmotionsMap);
	};
</script>

<!-- <h1>EXPERIMENT</h1> -->
<h1>One minute experiment</h1>

<!-- <h3>Instructions</h3> -->

<!-- <ol>
	<li> -->
<div>
	<p>
		<b>Instructions</b> Take one minute and write down all the negative emotions that you can think of
		that are one word, then click submit.
	</p>
	<ul>
		<li>Time yourself for 1 minute</li>
		<li>Write all the negative emotions that are one word</li>
	</ul>

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
	{#if data?.session?.user}
		<input
			type="button"
			name="Filter"
			value="Filter"
			on:click={filter}
			class:form-send={true}
			class={emotionList.length ? 'regular' : 'disabled'}
		/>
	{/if}
</div>
<!-- </li>
</ol> -->

{#if formattedListOfEmotions?.length}
	<div class="row">
		<div class="column">
			<h3>Listed Emotions</h3>
			<div class="column">
				{#each formattedListOfEmotions as emotion}
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
	textarea {
		border: 1px solid var(--color-theme-purple);
		border-radius: 5px;
	}
</style>
