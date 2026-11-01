// src/lib/attachments/clickOutside.ts
import type { Attachment } from 'svelte/attachments';

/**
 * Calls `callback` when a mousedown lands outside the element.
 * Usage: `<div {@attach clickOutside(close)}>`.
 */
export function clickOutside(callback: () => void = () => {}): Attachment<HTMLElement> {
	return (element) => {
		const onMouseDown = (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (!element.contains(target)) {
				callback();
			}
		};

		document.body.addEventListener('mousedown', onMouseDown);

		return () => {
			document.body.removeEventListener('mousedown', onMouseDown);
		};
	};
}
