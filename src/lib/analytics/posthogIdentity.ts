// src/lib/analytics/posthogIdentity.ts
export type UserIdentity = {
	id: string;
	enneagram?: number | null;
	admin?: boolean;
};

export type IdentityTransition =
	{ kind: 'identify'; identity: UserIdentity } | { kind: 'reset' } | { kind: 'none' };

/**
 * Distinguishes a real logout from an ordinary anonymous page load. PostHog
 * should reset only when an identified browser becomes anonymous; resetting on
 * every anonymous route would mint new device IDs and split the journey.
 */
export function createIdentityTransitionTracker() {
	let identifiedUserId: string | null = null;

	return {
		transition(identity: UserIdentity | null): IdentityTransition {
			if (identity?.id) {
				identifiedUserId = identity.id;
				return { kind: 'identify', identity };
			}

			if (identifiedUserId === null) return { kind: 'none' };
			identifiedUserId = null;
			return { kind: 'reset' };
		}
	};
}

export function buildIdentityProperties(identity: UserIdentity): Record<string, unknown> {
	const properties: Record<string, unknown> = {};
	if (identity.enneagram != null) properties.enneagram_type = identity.enneagram;
	if (identity.admin != null) properties.admin = identity.admin;
	return properties;
}
