#!/usr/bin/env node
// scripts/blog-editorial-check.mjs
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { checkDraft, getEditorialPublishStatus, isV3, errorMessage } from './lib/blogEditorial.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2];
try {
	if (!file)
		throw new Error(
			'Usage: node scripts/blog-editorial-check.mjs <draft-path> [--release | --is-v3]'
		);
	const markdown = await fs.readFile(file, 'utf8');
	if (process.argv.includes('--is-v3')) process.exitCode = isV3(matter(markdown).data) ? 0 : 1;
	else {
		const result = process.argv.includes('--release')
			? await getEditorialPublishStatus(file, root)
			: checkDraft(markdown);
		console.log(JSON.stringify(result, null, 2));
		process.exitCode = 'valid' in result ? (result.valid ? 0 : 1) : result.blockers.length ? 1 : 0;
	}
} catch (error) {
	console.error(errorMessage(error));
	process.exitCode = 2;
}
