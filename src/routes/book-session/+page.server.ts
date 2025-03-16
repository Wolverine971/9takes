import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { Actions } from './$types';

export const actions: Actions = {
	/**
	 * Handle waitlist signup form submission
	 */
	coachSub: async ({ request, getClientAddress, url, cookies, locals }) => {
		const formData = await request.formData();

		// Extract form data
		const name = formData.get('name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const enneagramType = formData.get('enneagramType')?.toString() || '';

		// Validate form data
		if (!name) {
			return fail(400, {
				success: false,
				message: 'Name is required',
				name,
				email,
				enneagramType
			});
		}

		if (!email) {
			return fail(400, {
				success: false,
				message: 'Email is required',
				name,
				email,
				enneagramType
			});
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, {
				success: false,
				message: 'Please enter a valid email address',
				name,
				email,
				enneagramType
			});
		}

		try {
			// Insert into coaching_waitlist table
			const { data: waitlistData, error: waitlistError } = await supabase
				.from('coaching_waitlist')
				.insert([{ name, email, enneagram_type: enneagramType }])
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
						enneagramType
					});
				}

				console.error('Error adding to waitlist:', waitlistError);
				return fail(500, {
					success: false,
					message: 'An unexpected error occurred. Please try again.',
					name,
					email,
					enneagramType
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
				await supabase.from('coaching_waitlist_metadata').insert([
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
				enneagramType
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
