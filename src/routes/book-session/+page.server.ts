// src/routes/book-session/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

// Common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
	'tempmail.com',
	'temp-mail.org',
	'guerrillamail.com',
	'guerrillamail.org',
	'sharklasers.com',
	'mailinator.com',
	'yopmail.com',
	'throwaway.email',
	'maildrop.cc',
	'dispostable.com',
	'10minutemail.com',
	'10minutemail.net',
	'fakeinbox.com',
	'tempinbox.com',
	'mailnesia.com',
	'trashmail.com',
	'getnada.com',
	'mohmal.com',
	'emailondeck.com',
	'tempr.email',
	'discard.email',
	'spamgourmet.com',
	'mytrashmail.com',
	'mailcatch.com',
	'getairmail.com',
	'mailforspam.com',
	'spam4.me',
	'grr.la',
	'spamex.com',
	'guerrillamailblock.com',
	'pokemail.net',
	'jetable.org',
	'meltmail.com'
]);

// Bot user agent patterns
const BOT_USER_AGENT_PATTERNS = [
	/bot/i,
	/crawl/i,
	/spider/i,
	/scraper/i,
	/curl/i,
	/wget/i,
	/python-requests/i,
	/axios/i,
	/node-fetch/i,
	/headless/i,
	/phantom/i,
	/selenium/i,
	/puppeteer/i,
	/playwright/i
];

// Minimum time (ms) a human would take to fill the form
const MIN_FORM_TIME_MS = 3000; // 3 seconds

// Rate limit: max submissions per IP in time window
const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_HOURS = 1;

export const actions: Actions = {
	/**
	 * Handle waitlist signup form submission
	 */
	coachSub: async ({ request, getClientAddress, url, cookies, locals }) => {
		const formData = await request.formData();
		const ipAddress = getClientAddress();
		const userAgent = request.headers.get('user-agent') || '';

		// Extract form data
		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const enneagramType = formData.get('enneagramType')?.toString() || '';
		const sessionGoal = formData.get('sessionGoal')?.toString().trim() || '';

		// ============ BOT DETECTION CHECKS ============

		// 1. Honeypot check - if the hidden field is filled, it's a bot
		const honeypot = formData.get('website')?.toString() || '';
		if (honeypot) {
			console.log(`[BOT DETECTED] Honeypot triggered from IP: ${ipAddress}`);
			// Return success to fool the bot, but don't actually save
			return { success: true, message: 'You have been added to our waitlist!' };
		}

		// 2. Time-based validation - bots submit too fast
		const timeToken = parseInt(formData.get('_timeToken')?.toString() || '0', 10);
		if (timeToken > 0 && timeToken < MIN_FORM_TIME_MS) {
			console.log(`[BOT DETECTED] Form submitted too fast (${timeToken}ms) from IP: ${ipAddress}`);
			return { success: true, message: 'You have been added to our waitlist!' };
		}

		// 3. User agent validation - block known bot patterns
		if (BOT_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
			console.log(`[BOT DETECTED] Bot user agent: ${userAgent} from IP: ${ipAddress}`);
			return { success: true, message: 'You have been added to our waitlist!' };
		}

		// 4. Check for empty/suspicious user agent
		if (!userAgent || userAgent.length < 20) {
			console.log(`[BOT DETECTED] Missing/short user agent from IP: ${ipAddress}`);
			return { success: true, message: 'You have been added to our waitlist!' };
		}

		// 5. Rate limiting by IP - check recent submissions
		try {
			const cutoffTime = new Date();
			cutoffTime.setHours(cutoffTime.getHours() - RATE_LIMIT_WINDOW_HOURS);

			const { count, error: countError } = await locals.supabase
				.from('coaching_waitlist_metadata')
				.select('*', { count: 'exact', head: true })
				.eq('ip_address', ipAddress)
				.gte('created_at', cutoffTime.toISOString());

			if (!countError && count !== null && count >= RATE_LIMIT_COUNT) {
				console.log(
					`[BOT DETECTED] Rate limit exceeded for IP: ${ipAddress} (${count} submissions)`
				);
				return fail(429, {
					success: false,
					message: 'Too many requests. Please try again later.',
					name,
					email,
					enneagramType,
					sessionGoal
				});
			}
		} catch (e) {
			// Don't block if rate limit check fails
			console.error('Rate limit check error:', e);
		}

		// ============ STANDARD VALIDATION ============

		// Validate form data
		if (!name) {
			return fail(400, {
				success: false,
				message: 'Name is required',
				name,
				email,
				enneagramType,
				sessionGoal
			});
		}

		if (!email) {
			return fail(400, {
				success: false,
				message: 'Email is required',
				name,
				email,
				enneagramType,
				sessionGoal
			});
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, {
				success: false,
				message: 'Please enter a valid email address',
				name,
				email,
				enneagramType,
				sessionGoal
			});
		}

		// 6. Check for disposable email domains
		const emailDomain = email.split('@')[1]?.toLowerCase();
		if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
			console.log(`[BOT DETECTED] Disposable email domain: ${emailDomain} from IP: ${ipAddress}`);
			return fail(400, {
				success: false,
				message: 'Please use a permanent email address (no temporary emails)',
				name,
				email,
				enneagramType,
				sessionGoal
			});
		}

		if (!sessionGoal) {
			return fail(400, {
				success: false,
				message: 'Share what you want from this session',
				name,
				email,
				enneagramType,
				sessionGoal
			});
		}

		if (sessionGoal.length > 600) {
			return fail(400, {
				success: false,
				message: 'Please keep your note under 600 characters',
				name,
				email,
				enneagramType,
				sessionGoal
			});
		}

		try {
			// Insert into coaching_waitlist table
			const { data: waitlistData, error: waitlistError } = await locals.supabase
				.from('coaching_waitlist')
				.insert([{ name, email, enneagram_type: enneagramType, session_goal: sessionGoal }])
				.select('id')
				.single();

			if (waitlistError) {
				// Check if it's a unique violation (email already exists)
				if (waitlistError.code === '23505') {
					return fail(400, {
						success: false,
						message: 'This email is already on our waitlist!',
						name,
						email,
						enneagramType,
						sessionGoal
					});
				}

				console.error('Error adding to waitlist:', waitlistError);
				return fail(500, {
					success: false,
					message: 'An unexpected error occurred. Please try again.',
					name,
					email,
					enneagramType,
					sessionGoal
				});
			}

			// Get tracking information
			const ipAddress = getClientAddress();
			const userAgent = request.headers.get('user-agent') || '';
			const referer = request.headers.get('referer') || '';

			// Get UTM parameters
			const utmSource = url.searchParams.get('utm_source') || '';
			const utmMedium = url.searchParams.get('utm_medium') || '';
			const utmCampaign = url.searchParams.get('utm_campaign') || '';
			const utmContent = url.searchParams.get('utm_content') || '';

			// Determine source
			let source = utmSource;
			if (!source && referer) {
				// Extract domain from referer if available
				try {
					const refererUrl = new URL(referer);
					source = refererUrl.hostname;
				} catch (e) {
					source = referer;
				}
			}

			// Insert metadata
			if (waitlistData?.id) {
				await locals.supabase.from('coaching_waitlist_metadata').insert([
					{
						waitlist_id: waitlistData.id,
						source,
						ip_address: ipAddress,
						user_agent: userAgent,
						utm_campaign: utmCampaign,
						utm_medium: utmMedium,
						utm_content: utmContent
					}
				]);
			}

			// Set a cookie to remember the user signed up
			cookies.set('coaching_waitlist', 'true', {
				path: '/',
				maxAge: 60 * 60 * 24 * 365, // 1 year
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production'
			});

			// Send confirmation email
			// This would be implemented with your email service
			// await sendConfirmationEmail(email, name);

			// Return success
			return {
				success: true,
				message: 'You have been added to our waitlist!'
			};
		} catch (error) {
			console.error('Server error during signup:', error);
			return fail(500, {
				success: false,
				message: 'A server error occurred. Please try again later.',
				name,
				email,
				enneagramType,
				sessionGoal
			});
		}
	}
};

export async function load({ cookies, url }) {
	// Check if user already signed up (via cookie)
	const alreadySignedUp = cookies.get('coaching_waitlist') === 'true';

	// Get UTM parameters to pass to the form
	const utmSource = url.searchParams.get('utm_source') || null;
	const utmMedium = url.searchParams.get('utm_medium') || null;
	const utmCampaign = url.searchParams.get('utm_campaign') || null;
	const utmContent = url.searchParams.get('utm_content') || null;

	return {
		alreadySignedUp,
		utmParams: {
			source: utmSource,
			medium: utmMedium,
			campaign: utmCampaign,
			content: utmContent
		}
	};
}
