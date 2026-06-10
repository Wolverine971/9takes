// src/routes/auth/login/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	throw redirect(308, `/login${url.search}`);
};
