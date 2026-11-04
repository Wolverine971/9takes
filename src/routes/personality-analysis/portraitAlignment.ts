import portraitAlignment from '$lib/generated/personalityPortraitAlignment.json';

// The authoring template places the eye line at y=490 on a 1080px canvas.
const EYE_LINE = 490 / 1080;
const eyePositions: Record<string, number> = portraitAlignment;

export function portraitAlignmentStyle(imagePath: string): string {
	const eyeY = eyePositions[imagePath.split('?')[0]] ?? EYE_LINE;
	// Use the smallest zoom that still fills the frame after moving the eyes.
	// Both top and bottom stay covered, including portraits with opaque backdrops.
	const scale = Math.max(EYE_LINE / eyeY, (1 - EYE_LINE) / (1 - eyeY));
	return `--portrait-eye-y: ${eyeY * 100}%; --portrait-offset-y: ${(EYE_LINE - eyeY) * 100}%; --portrait-scale: ${scale}`;
}
