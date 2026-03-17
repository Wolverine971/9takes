// src/lib/server/cronAuth.ts
export function isAuthorizedCronRequest(
	authHeader: string | null,
	secrets: Array<string | null | undefined>
) {
	const allowedSecrets = [...new Set(secrets.map((secret) => secret?.trim()).filter(Boolean))];

	if (allowedSecrets.length === 0) {
		return true;
	}

	if (!authHeader?.startsWith('Bearer ')) {
		return false;
	}

	const token = authHeader.slice('Bearer '.length).trim();
	return allowedSecrets.includes(token);
}
