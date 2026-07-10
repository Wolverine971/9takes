// src/lib/server/adminDataStatus.ts
export type AdminDataWarning = {
	key: string;
	label: string;
};

export type AdminDataStatus = {
	state: 'complete' | 'degraded';
	generatedAt: string;
	warnings: AdminDataWarning[];
};

type AdminDataSourceCheck = AdminDataWarning & {
	error: unknown;
};

export function buildAdminDataStatus(
	sources: AdminDataSourceCheck[],
	generatedAt = new Date().toISOString()
): AdminDataStatus {
	const warnings = sources
		.filter((source) => Boolean(source.error))
		.map(({ key, label }) => ({ key, label }));

	return {
		state: warnings.length > 0 ? 'degraded' : 'complete',
		generatedAt,
		warnings
	};
}
