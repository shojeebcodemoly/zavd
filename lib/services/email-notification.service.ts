import nodemailer from "nodemailer";
import { siteSettingsRepository } from "@/lib/repositories/site-settings.repository";
import { logger } from "@/lib/utils/logger";

interface SubmissionData {
	type: string;
	fullName?: string;
	email?: string;
	phone?: string;
	message?: string;
	subject?: string;
	productName?: string;
	preferredDate?: Date | string;
	preferredTime?: string;
	createdAt?: Date | string;
	_id?: { toString(): string };
}

const TYPE_LABELS: Record<string, string> = {
	contact: "Contact Form",
	product_inquiry: "Product Inquiry",
	training_inquiry: "Training Inquiry",
	callback_request: "Callback Request",
	tour_request: "Tour Request",
	quote_request: "Quote Request",
	reseller_application: "Reseller Application",
	subscriber: "Newsletter Subscriber",
};

function buildEmailHtml(submission: SubmissionData): string {
	const typeLabel = TYPE_LABELS[submission.type] ?? submission.type;
	const submittedAt = submission.createdAt
		? new Date(submission.createdAt).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
		: new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });

	const rows: string[] = [
		`<tr><td style="padding:8px 12px;font-weight:600;color:#555;width:160px;vertical-align:top">Form Type</td><td style="padding:8px 12px;color:#222">${typeLabel}</td></tr>`,
	];

	if (submission.fullName) rows.push(`<tr style="background:#fafafa"><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Name</td><td style="padding:8px 12px;color:#222">${submission.fullName}</td></tr>`);
	if (submission.email) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Email</td><td style="padding:8px 12px;color:#222">${submission.email}</td></tr>`);
	if (submission.phone) rows.push(`<tr style="background:#fafafa"><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Phone</td><td style="padding:8px 12px;color:#222">${submission.phone}</td></tr>`);
	if (submission.subject) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Subject</td><td style="padding:8px 12px;color:#222">${submission.subject}</td></tr>`);
	if (submission.productName) rows.push(`<tr style="background:#fafafa"><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Product</td><td style="padding:8px 12px;color:#222">${submission.productName}</td></tr>`);
	if (submission.preferredDate) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Preferred Date</td><td style="padding:8px 12px;color:#222">${String(submission.preferredDate).split("T")[0]}</td></tr>`);
	if (submission.preferredTime) rows.push(`<tr style="background:#fafafa"><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Preferred Time</td><td style="padding:8px 12px;color:#222">${submission.preferredTime}</td></tr>`);
	if (submission.message) rows.push(`<tr><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Message</td><td style="padding:8px 12px;color:#222;white-space:pre-wrap">${submission.message}</td></tr>`);
	rows.push(`<tr style="background:#fafafa"><td style="padding:8px 12px;font-weight:600;color:#555;vertical-align:top">Submitted</td><td style="padding:8px 12px;color:#222">${submittedAt}</td></tr>`);

	return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:#1a2e4a;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px">New Form Submission</h1>
      <p style="margin:4px 0 0;color:#a0b4cc;font-size:14px">${typeLabel}</p>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0 0 16px;color:#444;font-size:15px">
        A new submission has been received on your website.
      </p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden">
        ${rows.join("")}
      </table>
    </div>
    <div style="padding:16px 32px;background:#f8f8f8;border-top:1px solid #eee">
      <p style="margin:0;color:#999;font-size:12px">
        This is an automated notification. Do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send admin notification email for a new form submission.
 * Fails silently — never throws, never blocks form submission.
 */
export async function sendSubmissionNotification(submission: SubmissionData): Promise<void> {
	try {
		const settings = await siteSettingsRepository.get();
		const smtp = settings.smtp;

		// Skip if SMTP is not configured or disabled
		if (!smtp?.enabled || !smtp.host || !smtp.adminNotificationEmail) {
			logger.debug("SMTP not configured or disabled — skipping email notification");
			return;
		}

		const typeLabel = TYPE_LABELS[submission.type] ?? submission.type;
		const senderName = smtp.fromName || settings.companyName || "Website";
		const senderEmail = smtp.fromEmail || settings.noreplyEmail || smtp.username || "";

		if (!senderEmail) {
			logger.warn("SMTP fromEmail not configured — skipping email notification");
			return;
		}

		// Build transporter
		const isSecure = smtp.encryption === "ssl";
		const transporter = nodemailer.createTransport({
			host: smtp.host,
			port: smtp.port ?? 587,
			secure: isSecure,
			...(smtp.encryption === "tls" && { requireTLS: true }),
			auth: smtp.username
				? { user: smtp.username, pass: smtp.password ?? "" }
				: undefined,
		});

		const submitterName = submission.fullName || submission.email || "Anonymous";
		const subject = `New ${typeLabel} from ${submitterName}`;

		await transporter.sendMail({
			from: `"${senderName}" <${senderEmail}>`,
			to: smtp.adminNotificationEmail,
			subject,
			html: buildEmailHtml(submission),
		});

		logger.info(`Admin notification email sent for ${submission.type} submission`);
	} catch (error) {
		// Always fail silently — email errors must never break form submissions
		logger.error("Failed to send admin notification email", error);
	}
}
