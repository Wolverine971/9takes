// src/routes/design-preview/home-reimagined/+server.ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	throw redirect(308, '/');
};
