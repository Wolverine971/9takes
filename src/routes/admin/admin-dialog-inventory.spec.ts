// src/routes/admin/admin-dialog-inventory.spec.ts
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const adminRoutes = join(process.cwd(), 'src/routes/admin');
const forbiddenDialogMarkup = [
	{ label: 'raw dialog role', pattern: /role\s*=\s*["'](?:alert)?dialog["']/ },
	{
		label: 'route-owned modal overlay',
		pattern: /(?:modal-overlay|modal-backdrop|warning-overlay)/
	}
];

async function collectSvelteFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name);
			if (entry.isDirectory()) return collectSvelteFiles(path);
			return entry.name.endsWith('.svelte') ? [path] : [];
		})
	);

	return files.flat();
}

describe('admin dialog inventory', () => {
	it('keeps dialog lifecycle ownership in the shared Modal primitive', async () => {
		const failures: string[] = [];

		for (const file of await collectSvelteFiles(adminRoutes)) {
			const source = await readFile(file, 'utf8');
			for (const check of forbiddenDialogMarkup) {
				if (check.pattern.test(source)) {
					failures.push(`${relative(process.cwd(), file)}: ${check.label}`);
				}
			}
		}

		expect(failures).toEqual([]);
	});
});
