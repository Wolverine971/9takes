// src/lib/questionPrint/questionPrintBackgrounds.ts
export interface QuestionPrintBackgroundPreset {
	id: string;
	name: string;
	description: string;
	backgroundImage: string;
	suggestedOpacity: number;
}

export const QUESTION_PRINT_BACKGROUND_PRESETS: readonly QuestionPrintBackgroundPreset[] = [
	{
		id: 'aurora',
		name: 'Aurora Fade',
		description: 'Cool teal glow with a soft studio falloff.',
		backgroundImage:
			'radial-gradient(circle at 18% 18%, rgba(45, 212, 191, 0.52), transparent 0 30%), radial-gradient(circle at 82% 16%, rgba(125, 211, 252, 0.3), transparent 0 24%), linear-gradient(145deg, #05131b 0%, #0c2631 54%, #081015 100%)',
		suggestedOpacity: 0.82
	},
	{
		id: 'ember',
		name: 'Ember Glow',
		description: 'Warm coral lighting for more dramatic prompts.',
		backgroundImage:
			'radial-gradient(circle at 18% 20%, rgba(251, 146, 60, 0.5), transparent 0 24%), radial-gradient(circle at 82% 16%, rgba(244, 114, 182, 0.32), transparent 0 28%), linear-gradient(135deg, #201019 0%, #5f2f25 48%, #140c12 100%)',
		suggestedOpacity: 0.78
	},
	{
		id: 'blueprint',
		name: 'Blueprint Grid',
		description: 'Editorial grid with a cleaner, more graphic feel.',
		backgroundImage:
			'repeating-linear-gradient(0deg, rgba(148, 197, 255, 0.12) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgba(148, 197, 255, 0.12) 0 1px, transparent 1px 48px), radial-gradient(circle at 20% 18%, rgba(96, 165, 250, 0.22), transparent 0 28%), linear-gradient(145deg, #08111d 0%, #10263e 56%, #09111a 100%)',
		suggestedOpacity: 0.76
	},
	{
		id: 'mist',
		name: 'Midnight Mist',
		description: 'Softer atmospheric wash with more breathing room.',
		backgroundImage:
			'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.22), transparent 0 34%), radial-gradient(circle at 16% 72%, rgba(45, 212, 191, 0.24), transparent 0 28%), linear-gradient(145deg, #10131b 0%, #20283b 52%, #0a141e 100%)',
		suggestedOpacity: 0.72
	}
] as const;

export type QuestionPrintBackgroundPresetId =
	(typeof QUESTION_PRINT_BACKGROUND_PRESETS)[number]['id'];

export const getQuestionPrintBackgroundPreset = (
	id: QuestionPrintBackgroundPresetId
): QuestionPrintBackgroundPreset =>
	QUESTION_PRINT_BACKGROUND_PRESETS.find((preset) => preset.id === id) ??
	QUESTION_PRINT_BACKGROUND_PRESETS[0];
