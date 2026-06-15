// src/lib/utils/recaptcha.spec.ts
import { describe, expect, it } from 'vitest';

import { isHoneypotTriggered } from './recaptcha';

describe('isHoneypotTriggered', () => {
	it('only triggers when the hidden field contains non-whitespace text', () => {
		expect(isHoneypotTriggered(null)).toBe(false);
		expect(isHoneypotTriggered(undefined)).toBe(false);
		expect(isHoneypotTriggered('')).toBe(false);
		expect(isHoneypotTriggered('   ')).toBe(false);
		expect(isHoneypotTriggered('bot value')).toBe(true);
	});
});
