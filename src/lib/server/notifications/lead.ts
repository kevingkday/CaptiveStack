export interface FeasibilityLeadInput {
	name: string;
	associationName: string;
	memberCount: number;
	lineOfCoverage: string;
	annualPremiumSize: string;
	email: string;
	phone?: string;
	notes?: string;
}

export interface LeadNotificationResult {
	notified: boolean;
	targetEmail: string;
	leadId: string;
	channel: 'webhook' | 'audit_log';
	timestamp: string;
}

export const KEVIN_NOTIFICATION_EMAIL = 'kevin@oceanfallsblockchain.com';

/**
 * Dispatches an internal notification to Kevin Day when an association
 * requests a feasibility review.
 * Per compliance guidelines: No automatic outbound email is sent to the lead.
 */
export async function notifyLeadToKevin(
	lead: FeasibilityLeadInput & { id: string },
	env?: { NOTIFICATION_WEBHOOK_URL?: string }
): Promise<LeadNotificationResult> {
	const timestamp = new Date().toISOString();
	const payload = {
		event: 'FEASIBILITY_REVIEW_REQUESTED',
		targetRecipient: KEVIN_NOTIFICATION_EMAIL,
		leadId: lead.id,
		submittedAt: timestamp,
		contact: {
			name: lead.name,
			email: lead.email,
			phone: lead.phone || 'N/A'
		},
		association: {
			name: lead.associationName,
			members: lead.memberCount,
			lineOfCoverage: lead.lineOfCoverage,
			estimatedAnnualPremium: lead.annualPremiumSize
		},
		notes: lead.notes || 'None provided'
	};

	if (env?.NOTIFICATION_WEBHOOK_URL) {
		try {
			const res = await fetch(env.NOTIFICATION_WEBHOOK_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (res.ok) {
				return {
					notified: true,
					targetEmail: KEVIN_NOTIFICATION_EMAIL,
					leadId: lead.id,
					channel: 'webhook',
					timestamp
				};
			}
		} catch (err) {
			console.error('[Lead Notification Webhook Error]', err);
		}
	}

	// Structured fallback logger visible in Cloudflare real-time tail logs
	console.log(`[LEAD_NOTIFICATION_FOR_KEVIN] New Group Feasibility Review Request:`, JSON.stringify(payload));

	return {
		notified: true,
		targetEmail: KEVIN_NOTIFICATION_EMAIL,
		leadId: lead.id,
		channel: 'audit_log',
		timestamp
	};
}
