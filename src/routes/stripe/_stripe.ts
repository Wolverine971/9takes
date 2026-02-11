// src/routes/stripe/_stripe.ts
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || '', {
	apiVersion: '2022-11-15'
});

export default stripe;
