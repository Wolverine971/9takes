import { env } from '$env/dynamic/private';

export const DEFAULT_HOST_USER_ID = '9ce7ff91-d7f8-4397-b00d-8716e335aaee';
export function resolveHostUserId(): string {
	return env.PRIVATE_HOST_USER_ID?.trim() || DEFAULT_HOST_USER_ID;
}
