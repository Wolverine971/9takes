// src/lib/server/emailSequenceMetrics.ts
type SequenceMetricStep = {
	step_number: number;
	subject: string;
};

type SequenceMetricSend = {
	sequence_step_number: number | null;
	status: string | null;
	opened_at: string | null;
	clicked_at: string | null;
};

export type SequenceStepMetric = {
	step_number: number;
	subject: string;
	total_sent: number;
	total_opened: number;
	total_clicked: number;
	open_rate: number;
	click_rate: number;
};

export function buildSequenceStepMetrics(
	steps: SequenceMetricStep[],
	sends: SequenceMetricSend[]
): SequenceStepMetric[] {
	return steps.map((step) => {
		const stepSends = sends.filter((send) => send.sequence_step_number === step.step_number);
		const delivered = stepSends.filter(
			(send) => send.status === 'sent' || send.status === 'delivered'
		);
		const opened = stepSends.filter((send) => send.opened_at);
		const clicked = stepSends.filter((send) => send.clicked_at);

		return {
			step_number: step.step_number,
			subject: step.subject,
			total_sent: delivered.length,
			total_opened: opened.length,
			total_clicked: clicked.length,
			open_rate: delivered.length > 0 ? Math.round((opened.length / delivered.length) * 100) : 0,
			click_rate: delivered.length > 0 ? Math.round((clicked.length / delivered.length) * 100) : 0
		};
	});
}
