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
});
