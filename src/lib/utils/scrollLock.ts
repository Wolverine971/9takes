// src/lib/utils/scrollLock.ts
let lockCount = 0;
let previousOverflow: string | null = null;

export function lockBodyScroll(): () => void {
	if (typeof document === 'undefined') {
		return () => {};
	}

	let released = false;

	if (lockCount === 0) {
		previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}

	lockCount += 1;

	return () => {
		if (released || typeof document === 'undefined') return;
		released = true;
		lockCount = Math.max(0, lockCount - 1);

		if (lockCount === 0) {
			document.body.style.overflow = previousOverflow ?? '';
			previousOverflow = null;
		}
	};
}
