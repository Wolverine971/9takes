// src/lib/data/djPersonalityReads.ts
// Editorial source of truth for DJ's observations, interpretations, competing
// explanations, and source trail. Public articles should integrate this
// reasoning into their subject-led narrative rather than render it as a second
// standalone summary card.
export type DJReadConfidence = 'low' | 'medium' | 'high';

export type DJReadSource = {
	label: string;
	url: string;
};

export type DJReadClaim = {
	label: string;
	compactConnection: string;
	observation: string;
	djInterpretation: string;
	typeConnection: string;
	alternativeExplanation: string;
	confidence: DJReadConfidence;
	sources: DJReadSource[];
};

export type DJPersonalityRead = {
	id: string;
	person: string;
	proposedType: string;
	confidence: DJReadConfidence;
	thesis: string;
	strongestAlternative: string;
	compactHesitation: string;
	holisticRead: string;
	claims: DJReadClaim[];
	counterevidence: string[];
	whatWouldChangeDJsMind: string[];
	aiAssistance: {
		sourceDiscovery: boolean;
		transcriptSearch: boolean;
		evidenceClustering: boolean;
		counterargumentGeneration: boolean;
		proseCleanup: boolean;
	};
	djReviewedSources: DJReadSource[];
	unresolvedGaps: string[];
	reasoningAnchor: string;
};

const djPersonalityReads: Record<string, DJPersonalityRead> = {
	'elon-musk': {
		id: 'elon-musk',
		person: 'Elon Musk',
		proposedType: 'Type 5w6',
		confidence: 'high',
		thesis:
			'My read is that Elon does not pursue knowledge only because he is intelligent. He uses understanding as shelter: make the uncertainty specific, build a map, then act once the world feels legible again.',
		strongestAlternative: 'Type 8, amplified by the demands and power of the founder role',
		compactHesitation:
			'Type 8 and the founder role explain some of his command. His long-term company focus also means that expansion alone cannot prove a stress pattern.',
		holisticRead:
			'When I watch Elon listen, pause, and work through a question, he seems to retreat inward before he responds. The awkwardness, the depth, and the sudden certainty all look connected to the same internal process.',
		claims: [
			{
				label: 'He makes uncertainty specific',
				compactConnection:
					'He asks which claim is wrong, turning a challenge into something his mind can inspect.',
				observation:
					'When challenged, he asks for the exact claim or example and says he wants to minimize being confidently wrong.',
				djInterpretation: 'I read that as converting a threat into a problem his mind can inspect.',
				typeConnection:
					'Type 5 attention moves toward precision and understanding when competence or certainty is at stake.',
				alternativeExplanation:
					'This can also be ordinary engineering discipline or an adversarial debate tactic.',
				confidence: 'high',
				sources: [
					{
						label: 'Lex Fridman interview',
						url: 'https://lexfridman.com/elon-musk-4-transcript'
					},
					{
						label: 'BBC interview transcript',
						url: 'https://www.rev.com/transcripts/elon-musk-interview-with-the-bbc-4-11-23-transcript'
					}
				]
			},
			{
				label: 'He learns until the map becomes usable',
				compactConnection:
					'He immerses himself in books, experts, and factories until a working model restores agency.',
				observation:
					'He entered rocketry through books, expert conversations, and first-principles cost analysis. During the Model 3 crisis, he admitted his automation assumptions were wrong and immersed himself in the factory until he could see a path forward.',
				djInterpretation:
					'The learning is not decorative. A working model restores his ability to move.',
				typeConnection:
					'That is the deeper Type 5 pattern: mastery provides relief from helplessness, dependency, and demands that feel larger than available capacity.',
				alternativeExplanation:
					'High-performing founders in technical fields are also rewarded for learning quickly and taking control during crises.',
				confidence: 'high',
				sources: [
					{
						label: 'Tsinghua University dialogue',
						url: 'https://www.sem.tsinghua.edu.cn/en/info/1135/2367.htm'
					},
					{
						label: 'CBS Model 3 interview',
						url: 'https://www.cbsnews.com/news/elon-musk-tesla-model-3-problems-interview-today-2018-04-13/'
					}
				]
			},
			{
				label: 'He turns feelings into feedback systems',
				compactConnection:
					'He can acknowledge hurt, then quickly convert the feeling into information he can use.',
				observation:
					'He acknowledged that criticism of his Twitter leadership was hurtful, then almost immediately reframed the pain as a feedback loop he should not lose.',
				djInterpretation:
					'I do not think this means he feels nothing. I think his mind makes the feeling manageable by turning it into information.',
				typeConnection:
					'Intellectualization and detachment are more useful clues than intelligence alone when distinguishing a Type 5 pattern.',
				alternativeExplanation:
					'The feedback-loop language may be media-trained founder framing rather than an automatic emotional defense.',
				confidence: 'medium',
				sources: [
					{
						label: 'BBC interview transcript',
						url: 'https://www.rev.com/transcripts/elon-musk-interview-with-the-bbc-4-11-23-transcript'
					}
				]
			},
			{
				label: 'Under strain, his world gets wider',
				compactConnection:
					'Pressure brings more activity, humor, projects, and possible futures, which I read as motion away from helplessness.',
				observation:
					'Periods of pressure repeatedly coincide with more activity, more public play, more projects, and more arenas demanding his attention. In 2026, he said he had become too involved in politics and got carried away.',
				djInterpretation:
					'I read the multiplication, humor, and novelty as ways of staying in motion when remaining with helplessness would be harder.',
				typeConnection:
					'This resembles the restless, possibility-seeking side of Type 7 that Type 5 can move toward under stress.',
				alternativeExplanation:
					'His ventures also converge around a coherent technology thesis, so company count alone cannot prove scattered attention.',
				confidence: 'medium',
				sources: [
					{
						label: 'The Economist interview transcript',
						url: 'https://elonmuskarchive.org/video/economist-elon-musk-2026-07-23'
					},
					{
						label: 'CBS Model 3 interview',
						url: 'https://www.cbsnews.com/news/elon-musk-tesla-model-3-problems-interview-today-2018-04-13/'
					}
				]
			}
		],
		counterevidence: [
			'His confrontational style, appetite for control, and willingness to fire people can read more like Type 8 than Type 5.',
			'His sustained focus on SpaceX and the convergence of several ventures around one infrastructure thesis complicate a simple stress-to-Type-7 scattering story.',
			'Founder role, status, technical training, and media incentives can produce some of the same visible behavior without revealing an Enneagram motive.'
		],
		whatWouldChangeDJsMind: [
			'A sustained pattern showing that he seeks control for its own sake, without first retreating into analysis, threat-mapping, or technical mastery.',
			'Clear first-person evidence that power and resistance to being controlled organize his decisions more consistently than competence, depletion, or self-sufficiency.',
			'Evidence that the reflective pauses and deep dives are primarily performed media behavior rather than a stable pattern across private and earlier contexts.'
		],
		aiAssistance: {
			sourceDiscovery: true,
			transcriptSearch: true,
			evidenceClustering: true,
			counterargumentGeneration: true,
			proseCleanup: true
		},
		djReviewedSources: [],
		unresolvedGaps: [
			"Public evidence cannot establish Elon's private emotional sequence or prove why he starts a project, posts a joke, plays a game, or enters a relationship.",
			'The Zuckerberg fight, gaming, and relationship anecdotes remain mixed evidence and are not used as deciding receipts in the compact card.'
		],
		reasoningAnchor: 'dj-reasoning'
	}
};

export function getDJPersonalityRead(readId: string): DJPersonalityRead | undefined {
	return djPersonalityReads[readId];
}
