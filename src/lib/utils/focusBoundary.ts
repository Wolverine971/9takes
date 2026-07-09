// src/lib/utils/focusBoundary.ts
const FOCUSABLE_SELECTOR = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'object',
	'embed',
	'[contenteditable="true"]',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

const inertLocks = new Map<HTMLElement, { count: number; wasInert: boolean }>();

function canReceiveFocus(element: HTMLElement): boolean {
	return !element.closest('[hidden], [inert], [aria-hidden="true"]');
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
		canReceiveFocus
	);
}

export function focusInitialElement(container: HTMLElement, selector?: string | null): HTMLElement {
	let target: HTMLElement | null = null;

	if (selector) {
		try {
			target = container.querySelector<HTMLElement>(selector);
		} catch {
			target = null;
		}
	}

	if (!target || !canReceiveFocus(target)) {
		target = getFocusableElements(container)[0] ?? container;
	}

	target.focus({ preventScroll: true });
	return target;
}

export function trapFocus(event: KeyboardEvent, container: HTMLElement): void {
	if (event.key !== 'Tab') return;

	const focusable = getFocusableElements(container);
	if (focusable.length === 0) {
		event.preventDefault();
		container.focus({ preventScroll: true });
		return;
	}

	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	const active = document.activeElement;
	const focusIsOutside = !(active instanceof Node) || !container.contains(active);

	if (event.shiftKey && (active === first || focusIsOutside)) {
		event.preventDefault();
		last.focus({ preventScroll: true });
		return;
	}

	if (!event.shiftKey && (active === last || focusIsOutside)) {
		event.preventDefault();
		first.focus({ preventScroll: true });
	}
}

export function inertBodySiblings(container: HTMLElement): () => void {
	if (typeof document === 'undefined') return () => {};

	const lockedElements: HTMLElement[] = [];
	let restored = false;

	for (const child of Array.from(document.body.children)) {
		if (
			!(child instanceof HTMLElement) ||
			child === container ||
			child.contains(container) ||
			child.getAttribute('role') === 'dialog'
		)
			continue;

		const currentLock = inertLocks.get(child);
		if (currentLock) currentLock.count += 1;
		else inertLocks.set(child, { count: 1, wasInert: child.hasAttribute('inert') });
		lockedElements.push(child);
		child.setAttribute('inert', '');
	}

	return () => {
		if (restored) return;
		restored = true;

		for (const element of lockedElements) {
			const currentLock = inertLocks.get(element);
			if (!currentLock) continue;

			currentLock.count -= 1;
			if (currentLock.count > 0) continue;

			inertLocks.delete(element);
			if (element.isConnected && !currentLock.wasInert) element.removeAttribute('inert');
		}
	};
}

export function restoreFocus(element: HTMLElement | null): void {
	if (!element?.isConnected || element.closest('[inert]')) return;
	element.focus({ preventScroll: true });
}
