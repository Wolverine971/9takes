// src/lib/attachments/portal.ts
import type { Attachment } from 'svelte/attachments';

/**
 * Moves the element to the end of <body> while it is mounted, so fixed overlays
 * escape ancestor stacking contexts and containing blocks (transforms,
 * backdrop-filter, sticky z-index). Usage: `<div {@attach portalToBody}>`.
 */
export const portalToBody: Attachment<HTMLElement> = (node) => {
	document.body.appendChild(node);

	return () => {
		node.remove();
	};
};
