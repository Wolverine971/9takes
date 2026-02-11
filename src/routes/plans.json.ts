// src/routes/plans.json.ts
const plans: unknown[] = [];

export async function get() {
	return {
		status: 200,
		body: plans
	};
}
