// src/lib/email/base-template.ts
// Minimal/Clean Email Template for Email Dashboard

// This template prioritizes deliverability and readability
import { env } from '$env/dynamic/private';

interface TemplateOptions {
	subject: string;
	content: string;
	preheader?: string;
	recipientName?: string;
	trackingPixelUrl?: string;
	unsubscribeUrl?: string;
	includeFooter?: boolean;
}

/**
 * Generates a clean, minimal email template optimized for deliverability.
 * Uses inline styles for maximum email client compatibility.
 */
export function generateEmailHtml(options: TemplateOptions): string {
	const {
		subject,
		content,
		preheader = '',
		recipientName,
		trackingPixelUrl,
		unsubscribeUrl,
		includeFooter = true
	} = options;

	const year = new Date().getFullYear();
	const footerAddress = env.EMAIL_FOOTER_ADDRESS?.trim();

	// Process content to replace placeholders
	// Always replace {{name}} - use actual name or fallback to "there"
	let processedContent = content;
	const nameReplacement = escapeHtml(recipientName?.trim() || 'there');
	processedContent = processedContent.replace(/\{\{\s*name\s*\}\}/gi, nameReplacement);

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f6f7f9; }

    /* Content */
    .email-body { background-color: #ffffff; }
    .email-content { color: #22252b; font-size: 16px; line-height: 1.62; }
    .email-content h1 { font-size: 24px; font-weight: 650; margin: 0 0 20px; color: #121417; }
    .email-content h2 { font-size: 20px; font-weight: 650; margin: 20px 0 15px; color: #121417; }
    .email-content p { margin: 0 0 16px; }
    .email-content a { color: #0f766e; text-decoration: underline; }
    .email-content ul, .email-content ol { margin: 0 0 16px; padding-left: 24px; }
    .email-content li { margin-bottom: 8px; }

    /* Button */
    .button { display: inline-block; padding: 12px 20px; background-color: #121417; color: #ffffff !important; text-decoration: none !important; border-radius: 6px; font-weight: 650; }

    /* Responsive */
    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 16px !important; }
      .email-body-inner { padding: 24px !important; }
      .email-footer { padding: 20px 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f7f9;">
  <!-- Preheader -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; opacity: 0; color: transparent; font-size: 1px; line-height: 1px;">
    ${preheader ? escapeHtml(preheader) : ''}
    ${'&nbsp;'.repeat(100)}
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f6f7f9;">
    <tr>
      <td class="email-wrapper" style="padding: 30px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center" style="max-width: 600px; margin: 0 auto;">

          <!-- Brand -->
          <tr>
            <td style="padding: 0 0 16px; text-align: left;">
              <a href="https://9takes.com" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121417; font-size: 18px; font-weight: 700; letter-spacing: 0; text-decoration: none;">
                9takes
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td class="email-body-inner" style="padding: 40px;">
                    <div class="email-content" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333;">
                      ${processedContent}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
						includeFooter
							? `<!-- Footer -->
          <tr>
            <td class="email-footer" style="padding: 22px 4px 0; text-align: left;">
              <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.5; color: #69707a;">
                9takes - See the emotions behind every take
              </p>
              ${
								unsubscribeUrl
									? `<p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.5; color: #69707a;">
                You are receiving this because you signed up for 9takes. <a href="${escapeHtml(unsubscribeUrl)}" style="color: #69707a; text-decoration: underline;">Unsubscribe</a>.
              </p>`
									: ''
							}
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.5; color: #69707a;">
                &copy; ${year} 9takes. All rights reserved.
              </p>
              ${
								footerAddress
									? `<p style="margin: 8px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.5; color: #69707a;">
                ${escapeHtml(footerAddress)}
              </p>`
									: ''
							}
            </td>
          </tr>`
							: ''
					}

        </table>
      </td>
    </tr>
  </table>

  <!-- Tracking Pixel -->
  ${trackingPixelUrl ? `<img src="${escapeHtml(trackingPixelUrl)}" width="1" height="1" style="display:block;width:1px;height:1px;border:0;" alt="">` : ''}
</body>
</html>`;
}

/**
 * Converts HTML content to plain text for email fallback
 */
export function htmlToPlainText(html: string): string {
	return html
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/p>/gi, '\n\n')
		.replace(/<\/h[1-6]>/gi, '\n\n')
		.replace(/<li>/gi, '- ')
		.replace(/<\/li>/gi, '\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export function appendEmailFooterToPlainText(text: string, unsubscribeUrl?: string): string {
	const cleanText = text.trim();
	const footerAddress = env.EMAIL_FOOTER_ADDRESS?.trim();
	const footerLines = [
		'',
		'--',
		'9takes - See the emotions behind every take',
		unsubscribeUrl
			? `You are receiving this because you signed up for 9takes. Unsubscribe: ${unsubscribeUrl}`
			: null,
		footerAddress || null
	].filter((line): line is string => line !== null);

	return `${cleanText}\n${footerLines.join('\n')}`.trim();
}

/**
 * Escapes HTML special characters for safe insertion
 */
function escapeHtml(text: string): string {
	const htmlEntities: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	};
	return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

/**
 * Rewrites links in HTML content to go through click tracking
 */
export function rewriteLinksForTracking(html: string, trackingId: string, baseUrl: string): string {
	// Match href attributes with http/https URLs
	return html.replace(/href="(https?:\/\/[^"]+)"/g, (match, url) => {
		// Don't rewrite unsubscribe links or tracking links
		if (url.includes('/track/unsubscribe') || url.includes('/track/click')) {
			return match;
		}

		// Encode the URL for the redirect
		const encodedUrl = Buffer.from(encodeURIComponent(url)).toString('base64url');
		return `href="${baseUrl}/api/track/click/${trackingId}/${encodedUrl}"`;
	});
}

/**
 * Generates the tracking pixel URL
 */
export function getTrackingPixelUrl(trackingId: string, baseUrl: string): string {
	return `${baseUrl}/api/track/open/${trackingId}`;
}

/**
 * Generates the unsubscribe URL
 */
export function getUnsubscribeUrl(trackingId: string, baseUrl: string): string {
	return `${baseUrl}/api/track/unsubscribe/${trackingId}`;
}
