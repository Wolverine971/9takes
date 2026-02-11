// src/routes/stripe/checkout-session.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import stripe from './_stripe';

export const POST: RequestHandler = async ({ request, url }) => {
	const formData = await request.json();
	const priceId = formData.priceId;

	if (typeof priceId !== 'string') {
		return json(
			{
				error: {
					message: 'priceId is required'
				}
			},
			{ status: 400 }
		);
	}

	try {
		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			success_url: `http://${url.host}/counter?sessionId={CHECKOUT_SESSION_ID}`,
			cancel_url: `http://${url.host}/`
		});
		return json({ sessionId: session.id });
	} catch (err) {
		return json(
			{
				error: err
			},
			{ status: 500 }
		);
	}
};
