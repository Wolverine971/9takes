// src/lib/components/atoms/Modal.spec.ts
// @vitest-environment jsdom

import { render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import Modal, { getModal } from './Modal.svelte';

describe('Modal', () => {
	beforeEach(() => {
		document.body.innerHTML = '<main></main>';
		document.body.style.overflow = '';
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.body.style.overflow = '';
	});

	it('removes the modal overlay when the component unmounts while open', () => {
		const { unmount } = render(Modal, {
			props: {
				id: 'question-create',
				name: 'create question'
			}
		});

		const modal = getModal('question-create');
		expect(modal).toBeDefined();

		modal?.open();

		expect(document.querySelector('[role="dialog"]')).not.toBeNull();
		expect(document.body.style.overflow).toBe('hidden');

		unmount();

		expect(document.querySelector('[role="dialog"]')).toBeNull();
		expect(document.body.style.overflow).toBe('');
		expect(getModal('question-create')).toBeUndefined();
	});

	it('keeps body scroll locked until every open modal has closed', () => {
		const firstRender = render(Modal, {
			props: {
				id: 'first-modal',
				name: 'first modal'
			}
		});
		const secondRender = render(Modal, {
			props: {
				id: 'second-modal',
				name: 'second modal'
			}
		});

		const firstModal = getModal('first-modal');
		const secondModal = getModal('second-modal');

		firstModal?.open();
		secondModal?.open();

		expect(document.body.style.overflow).toBe('hidden');

		firstModal?.close(null);

		expect(document.body.style.overflow).toBe('hidden');

		secondModal?.close(null);

		expect(document.body.style.overflow).toBe('');

		firstRender.unmount();
		secondRender.unmount();
	});
});
