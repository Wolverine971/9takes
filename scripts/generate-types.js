#!/usr/bin/env node

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateTypes() {
	console.log('🔧 Generating Supabase database types...');

	try {
		// Generate types with Supabase CLI
		const command =
			'npx supabase gen types typescript --project-id "nhjjzcsnmyotyhykbajc" --schema public';
		const { stdout, stderr } = await execAsync(command);

		if (stderr && !stderr.includes('warning')) {
			console.error('⚠️  Warnings during type generation:', stderr);
		}

		// Write the types to database.types.ts
		const typesPath = path.join(__dirname, '..', 'database.types.ts');
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
		console.error('❌ Error generating types:', error.message);

		if (
			error.message.includes('command not found') ||
			error.message.includes('is not recognized')
		) {
			console.error('\n⚠️  Make sure Supabase CLI is installed:');
			console.error('    npm install -g supabase');
		}

		process.exit(1);
	}
}

// Run the script
generateTypes();
