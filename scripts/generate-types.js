// scripts/generate-types.js

import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import dotenv from 'dotenv';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const defaultProjectId = 'nhjjzcsnmyotyhykbajc';

dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local'), override: true });

async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function resolveSupabaseBin() {
	const binName = process.platform === 'win32' ? 'supabase.cmd' : 'supabase';
	const packageBinName = process.platform === 'win32' ? 'supabase.exe' : 'supabase';
	const candidates = [
		path.join(rootDir, 'node_modules', '.bin', binName),
		path.join(rootDir, 'node_modules', 'supabase', 'bin', packageBinName)
	];

	for (const candidate of candidates) {
		if (await fileExists(candidate)) return candidate;
	}

	throw new Error(
		'Supabase CLI binary not found. Run "pnpm install", then "pnpm rebuild supabase".'
	);
}

async function dockerIsAvailable() {
	try {
		await execFileAsync('docker', ['info'], {
			env: process.env,
			timeout: 5000,
			maxBuffer: 1024 * 1024
		});
		return true;
	} catch {
		return false;
	}
}

async function existingTypesAreUsable(typesPath) {
	try {
		const content = await fs.readFile(typesPath, 'utf-8');
		return content.includes('export type Database');
	} catch {
		return false;
	}
}

function getProjectId() {
	if (process.env.SUPABASE_PROJECT_ID) return process.env.SUPABASE_PROJECT_ID;

	const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
	if (supabaseUrl) {
		try {
			const host = new URL(supabaseUrl).hostname;
			const [projectRef] = host.split('.');
			if (projectRef) return projectRef;
		} catch {
			// Fall back to the project ref this repo already used.
		}
	}

	return defaultProjectId;
}

function safelyEncodeUriComponent(value) {
	try {
		return encodeURIComponent(decodeURIComponent(value));
	} catch {
		return encodeURIComponent(value);
	}
}

function parsePostgresAuth(value = '') {
	const schemeMatch = value.match(/^(postgres(?:ql)?:\/\/)(.+)$/i);
	if (!schemeMatch) return null;

	const [, scheme, rest] = schemeMatch;
	const atIndex = rest.lastIndexOf('@');
	if (atIndex === -1) return null;

	const auth = rest.slice(0, atIndex);
	const hostAndPath = rest.slice(atIndex + 1);
	const colonIndex = auth.indexOf(':');

	if (colonIndex === -1) {
		return { scheme, username: auth, password: '', hostAndPath };
	}

	return {
		scheme,
		username: auth.slice(0, colonIndex),
		password: auth.slice(colonIndex + 1),
		hostAndPath
	};
}

function normalizePostgresUrl(value) {
	const parsed = parsePostgresAuth(value);
	if (!parsed) return value;

	const username = safelyEncodeUriComponent(parsed.username);
	const password = parsed.password ? `:${safelyEncodeUriComponent(parsed.password)}` : '';
	return `${parsed.scheme}${username}${password}@${parsed.hostAndPath}`;
}

function redactSecrets(value = '') {
	let redacted = String(value);
	for (const secret of [process.env.SUPABASE_ACCESS_TOKEN, process.env.SUPABASE_DB_URL]) {
		if (secret) redacted = redacted.split(secret).join('[redacted]');
	}

	const postgresAuth = parsePostgresAuth(process.env.SUPABASE_DB_URL);
	if (postgresAuth?.password) {
		redacted = redacted
			.split(postgresAuth.password)
			.join('[redacted]')
			.split(safelyEncodeUriComponent(postgresAuth.password))
			.join('[redacted]');
	}

	return redacted
		.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://[redacted]')
		.replace(/invalid port ":[^"]+"/gi, 'invalid port ":[redacted]"');
}

async function generateTypes() {
	console.log('🔧 Generating Supabase database types...');

	try {
		const supabaseBin = await resolveSupabaseBin();
		const args = ['gen', 'types', 'typescript', '--schema', 'public'];
		const typesPath = path.join(rootDir, 'database.types.ts');

		if (process.env.SUPABASE_ACCESS_TOKEN) {
			args.push('--project-id', getProjectId());
		} else if (process.env.SUPABASE_DB_URL) {
			if (!(await dockerIsAvailable())) {
				if (await existingTypesAreUsable(typesPath)) {
					console.warn(
						'⚠️  Skipping database type regeneration: SUPABASE_DB_URL requires Docker and SUPABASE_ACCESS_TOKEN is not set. Keeping existing database.types.ts.'
					);
					return;
				}

				throw new Error(
					'SUPABASE_DB_URL generation requires Docker, and no usable database.types.ts file exists. Start Docker or set SUPABASE_ACCESS_TOKEN.'
				);
			}

			args.push('--db-url', normalizePostgresUrl(process.env.SUPABASE_DB_URL));
		} else {
			throw new Error(
				'No Supabase credentials found. Set SUPABASE_ACCESS_TOKEN or SUPABASE_DB_URL in .env.local.'
			);
		}

		const { stdout, stderr } = await execFileAsync(supabaseBin, args, {
			env: process.env,
			maxBuffer: 20 * 1024 * 1024
		});

		if (stderr && !stderr.includes('warning')) {
			console.error('⚠️  Warnings during type generation:', redactSecrets(stderr));
		}

		// Write the types to database.types.ts
		await fs.writeFile(typesPath, stdout, 'utf-8');

		console.log('✅ Database types generated successfully');

		// Check if the file is UTF-16 encoded (common with some Windows tools)
		const fileContent = await fs.readFile(typesPath);

		// Check for UTF-16 BOM
		if (fileContent[0] === 0xff && fileContent[1] === 0xfe) {
			console.log('🔄 Converting UTF-16 to UTF-8...');

			// Convert UTF-16LE to UTF-8
			const utf16String = fileContent.toString('utf16le');
			await fs.writeFile(typesPath, utf16String, 'utf-8');

			console.log('✅ Converted to UTF-8');
		} else if (fileContent[0] === 0xfe && fileContent[1] === 0xff) {
			console.log('🔄 Converting UTF-16BE to UTF-8...');

			// Convert UTF-16BE to UTF-8
			const decoder = new TextDecoder('utf-16be');
			const utf16String = decoder.decode(fileContent);
			await fs.writeFile(typesPath, utf16String, 'utf-8');

			console.log('✅ Converted to UTF-8');
		}

		// Verify the file is readable
		const finalContent = await fs.readFile(typesPath, 'utf-8');
		if (finalContent.includes('export type Database')) {
			console.log('✅ Database types are valid and readable');
		} else {
			console.warn('⚠️  Database types may not be properly formatted');
		}
	} catch (error) {
		const message = error.stderr || error.message || String(error);
		console.error('❌ Error generating types:', redactSecrets(message));

		if (message.includes('Docker daemon') && !process.env.SUPABASE_ACCESS_TOKEN) {
			console.error(
				'\n⚠️  The SUPABASE_DB_URL fallback requires Docker. Start Docker, or set SUPABASE_ACCESS_TOKEN to use the project-id path instead.'
			);
		}

		process.exit(1);
	}
}

// Run the script
generateTypes();
