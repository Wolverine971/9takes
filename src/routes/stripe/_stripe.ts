import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'], {
	apiVersion: '2023-04-06'
});

export default stripe;
