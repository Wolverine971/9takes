<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;

	let email = form?.email || '';
	let name = form?.name || '';
	let submitted = form?.success || false;
	let loading = false;

	// SEO variables
	const siteName = '9takes';
	const title = 'Book a Personal Enneagram Coaching Session | 9takes';
	const metaDescription =
		'Transform your understanding of yourself with personalized Enneagram coaching. Join our waitlist for exclusive one-on-one sessions with certified Enneagram specialists.';
	const keywords =
		'enneagram coaching, personality coaching, self-development, personal growth, enneagram expert, type analysis, personality insights, enneagram session';
	const domain = 'https://9takes.com';
	const ogImage = 'https://9takes.com/enneagram_coaching.png'; // You may need to create this image
	const twitterHandle = '@djwayne3';
	const imageAlt = 'Book a personal Enneagram coaching session with 9takes experts';

	// Testimonials from people who had coaching sessions
	const testimonials = [
		{
			quote:
				"Understanding my Type 4 tendencies has completely changed how I approach relationships. I'm now able to recognize when I'm idealizing others and communicate my needs more effectively.",
			author: 'Jamie L.',
			type: 'Type 4'
		},
		{
			quote:
				"As a Type 8, I've always been seen as 'too intense.' My session helped me channel my natural leadership in ways that empower others rather than intimidate them.",
			author: 'Michael R.',
			type: 'Type 8'
		},
		{
			quote:
				'Learning I was a Type 9 explained so much about why I avoid conflict. My coach helped me develop strategies to stay present in difficult conversations instead of checking out.',
			author: 'Sarah T.',
			type: 'Type 9'
		}
	];

	// Benefits of Enneagram coaching
	const benefits = [
		{
			title: 'Understand Your Core Motivations',
			description:
				'Discover the unconscious drivers behind your behavior and decision-making patterns.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`
		},
		{
			title: 'Improve Your Relationships',
			description:
				'Learn how your type interacts with others and develop strategies for healthier connections.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
		},
		{
			title: 'Navigate Growth & Stress',
			description:
				'Identify your patterns during times of health and stress, and develop resilience strategies.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`
		},
		{
			title: 'Break Free From Limitations',
			description: 'Recognize and transcend the self-imposed limitations of your personality type.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
		}
	];

	// What happens in a coaching session
	const sessionSteps = [
		{
			number: '01',
			title: 'Type Verification',
			description: "We'll confirm your Enneagram type with targeted questions to ensure accuracy."
		},
		{
			number: '02',
			title: 'Deep Dive Analysis',
			description: 'Explore your core fears, desires, and defense mechanisms in detail.'
		},
		{
			number: '03',
			title: 'Personal Growth Strategies',
			description:
				'Receive customized strategies to leverage your strengths and address challenges.'
		},
		{
			number: '04',
			title: 'Relationship Dynamics',
			description:
				'Learn how your type interacts with others and strategies for better connections.'
		}
	];

	// We don't need the handleSubmit function anymore since we're using form actions
	// Check if the user is already signed up
	$: if (data.alreadySignedUp && !form?.success) {
		submitted = true;
	}

	// UTM params passed from the server
	$: utmParams = data.utmParams;

	onMount(() => {
		// Make all content visible immediately without animations
		// This ensures content always appears even if scroll animations fail
		if (browser) {
			// Set a small timeout to ensure DOM is fully rendered
			setTimeout(() => {
				document.querySelectorAll('.animate-on-scroll').forEach((el) => {
					el.classList.add('animate-in');
				});
			}, 100);
		}
	});
</script>

<svelte:head>
	<!-- Preconnect to domains for faster loading -->
	<link rel="preconnect" href="https://9takes.com" />

	<!-- Set explicit width and height on viewport to prevent layout shift -->
	<meta name="viewport" content="width=device-width, initial-scale=1, height=device-height" />

	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="author" content={siteName} />

	<!-- Structured Data for Coaching Service -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Service",
			"name": "Enneagram Coaching by 9takes",
			"description": "Personalized one-on-one Enneagram coaching sessions to help you understand yourself better and improve your relationships.",
			"provider": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"serviceType": "Personality Coaching",
			"offers": {
				"@type": "Offer",
				"availability": "https://schema.org/ComingSoon",
				"price": "0",
				"priceCurrency": "USD"
			}
		}
	</script>

	<!-- Links -->
	<link rel="canonical" href={domain + '/book-session'} />
	<link rel="alternate" href={domain + '/book-session'} hreflang="x-default" />
	<link rel="alternate" href={domain + '/book-session'} hreflang="en" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={domain + '/book-session'} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:logo" content="https://9takes.com/brand/aero.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={imageAlt} />

	<!-- Additional SEO Tags -->
	<meta name="theme-color" content="#6c5ce7" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="apple-mobile-web-app-title" content={siteName} />

	<!-- Mobile Specific -->
	<meta name="format-detection" content="telephone=no" />
	<meta name="mobile-web-app-capable" content="yes" />
</svelte:head>

<div class="book-session-container">
	<!-- Hero Section -->
	<section class="hero-section">
		<div class="content-wrapper">
			<div class="text-content">
				<h1>Unlock Your True Self with Personalized Enneagram Coaching</h1>
				<p class="subtitle">
					Join our exclusive waitlist for one-on-one sessions with Enneagram specialists.
				</p>

				<div class="features">
					<div class="feature">
						<span class="icon">✓</span>
						<span>Personalized 60-minute sessions</span>
					</div>
					<div class="feature">
						<span class="icon">✓</span>
						<span>Custom growth strategies for your type</span>
					</div>
					<div class="feature">
						<span class="icon">✓</span>
						<span>Relationship insights & communication tools</span>
					</div>
				</div>
			</div>

			<div class="form-container glass-area">
				{#if !submitted}
					<h2>Join the Waitlist</h2>
					<p>Be among the first to access our personalized coaching sessions when they launch.</p>

					<form method="POST" action="?/coachSub">
						<div class="form-group">
							<label for="name">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={name}
								placeholder="Your name"
								required
							/>
						</div>

						<div class="form-group">
							<label for="email">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								placeholder="your@email.com"
								required
							/>
						</div>

						<div class="form-group">
							<label for="enneagramType">Your Enneagram Type (if known)</label>
							<select id="enneagramType" name="enneagramType">
								<option value="">I don't know my type yet</option>
								<option value="1">Type 1 - The Reformer</option>
								<option value="2">Type 2 - The Helper</option>
								<option value="3">Type 3 - The Achiever</option>
								<option value="4">Type 4 - The Individualist</option>
								<option value="5">Type 5 - The Investigator</option>
								<option value="6">Type 6 - The Loyalist</option>
								<option value="7">Type 7 - The Enthusiast</option>
								<option value="8">Type 8 - The Challenger</option>
								<option value="9">Type 9 - The Peacemaker</option>
							</select>
						</div>

						{#if form?.message && !form?.success}
							<div class="error-message">{form.message}</div>
						{/if}

						<button type="submit" class="submit-button" disabled={loading}>
							{loading ? 'Processing...' : 'Join Waitlist'}
						</button>
					</form>
				{:else}
					<div class="success-message">
						<div class="icon-success">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
								<polyline points="22 4 12 14.01 9 11.01"></polyline>
							</svg>
						</div>
						<h2>You're on the list!</h2>
						<p>
							Thank you for joining our waitlist. We'll contact you as soon as coaching sessions are
							available.
						</p>
						<p class="email-note">
							{#if email}
								We've sent a confirmation to <strong>{email}</strong>
							{:else}
								We'll keep you updated on our coaching program launch
							{/if}
						</p>

						<a href="/" class="home-button">Back to Home</a>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Testimonials Section - Removed animation class for reliability -->
	<!-- <section class="testimonials-section">
		<h2>What People Are Saying</h2>
		<div class="testimonials-container">
			{#each testimonials as testimonial}
				<div class="testimonial-card">
					<div class="quote">"</div>
					<p class="testimonial-text">{testimonial.quote}</p>
					<div class="testimonial-author">
						<strong>{testimonial.author}</strong>
						<span class="type-tag">{testimonial.type}</span>
					</div>
				</div>
			{/each}
		</div>
	</section> -->

	<!-- Benefits Section - Removed animation class -->
	<section class="benefits-section">
		<h2>How Enneagram Coaching Transforms Your Life</h2>
		<div class="benefits-grid">
			{#each benefits as benefit}
				<div class="benefit-card">
					<div class="benefit-icon">
						{@html benefit.icon}
					</div>
					<h3>{benefit.title}</h3>
					<p>{benefit.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Session Process Section - Removed animation class -->
	<section class="session-process">
		<h2>What to Expect in Your Session</h2>
		<div class="steps-container">
			{#each sessionSteps as step}
				<div class="step-card">
					<div class="step-number">{step.number}</div>
					<div class="step-content">
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Enneagram Visual Section - Removed animation class -->
	<section class="enneagram-visual-section">
		<div class="content-split">
			<div class="text-content">
				<h2>The Power of the Enneagram</h2>
				<p>
					The Enneagram isn't just another personality test. It's a profound system of understanding
					that reveals your core motivations, fears, and desires.
				</p>
				<p>
					Our coaches are extensively trained to help you apply this wisdom to your unique
					circumstances and challenges.
				</p>
				<p>
					When you understand your type at a deep level, you gain access to new possibilities for
					growth and transformation.
				</p>

				<div class="cta-secondary">
					<a href="#top" class="cta-button">Join the Waitlist</a>
					<a
						href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
						class="text-link">Learn more about the Enneagram →</a
					>
				</div>
			</div>

			<div class="diagram-container">
				<EnneagramDiagram />
			</div>
		</div>
	</section>

	<!-- FAQ Section - Removed animation class -->
	<section class="faq-section">
		<h2>Frequently Asked Questions</h2>
		<div class="faq-grid">
			<div class="faq-item">
				<h3>How long are the coaching sessions?</h3>
				<p>
					Each initial session is 60 minutes, with follow-up sessions available in 30 or 60-minute
					formats based on your needs.
				</p>
			</div>
			<div class="faq-item">
				<h3>Do I need to know my Enneagram type already?</h3>
				<p>
					No, part of our coaching process includes helping you accurately identify your type if
					you're unsure.
				</p>
			</div>
			<div class="faq-item">
				<h3>How are sessions conducted?</h3>
				<p>
					Sessions are held virtually via video call, allowing you to connect with our coaches from
					anywhere in the world.
				</p>
			</div>
			<div class="faq-item">
				<h3>When will coaching sessions become available?</h3>
				<p>
					We're currently finalizing our coaching team and platform. Waitlist members will be the
					first to know when sessions launch and will receive priority booking.
				</p>
			</div>
		</div>
	</section>

	<!-- Final CTA - Removed animation class -->
	<section class="final-cta">
		<div class="cta-content">
			<h2>Ready to Dive Deeper Into Your Enneagram Journey?</h2>
			<p>
				Join our waitlist today and be the first to access our transformative coaching sessions.
			</p>
			<a href="#top" class="cta-button-large">Join the Waitlist</a>
		</div>
	</section>
</div>

<style lang="scss">
	:global(body) {
		background-color: var(--background-color, #f7f7ff);
	}

	.book-session-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* Hero Section */
	.hero-section {
		padding: 4rem 0 3rem;

		.content-wrapper {
			display: flex;
			flex-direction: column;
			gap: 2rem;

			@media (min-width: 768px) {
				flex-direction: row;
				align-items: center;
			}
		}

		.text-content {
			flex: 1;

			h1 {
				font-size: 2.5rem;
				line-height: 1.2;
				margin-bottom: 1rem;
				background: linear-gradient(90deg, var(--darkest-gray) 0%, var(--primary-dark) 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				font-weight: 700;

				@media (min-width: 768px) {
					font-size: 3rem;
				}
			}

			.subtitle {
				font-size: 1.25rem;
				color: var(--text-secondary);
				margin-bottom: 2rem;
			}
		}

		.features {
			margin-top: 1.5rem;

			.feature {
				display: flex;
				align-items: center;
				margin-bottom: 0.75rem;

				.icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					background-color: var(--primary);
					color: white;
					margin-right: 0.75rem;
					font-size: 0.875rem;
				}

				span {
					font-size: 1.1rem;
				}
			}
		}
	}

	/* Form Container */
	.form-container {
		width: 100%;
		max-width: 450px;
		padding: 2rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--light-gray);

		h2 {
			color: var(--primary-dark);
			margin-bottom: 0.5rem;
		}

		p {
			color: var(--text-secondary);
			margin-bottom: 1.5rem;
		}

		.form-group {
			margin-bottom: 1.25rem;

			label {
				display: block;
				margin-bottom: 0.5rem;
				font-weight: 500;
				color: var(--darkest-gray);
			}

			input,
			select {
				width: 100%;
				padding: 0.75rem;
				border: 1px solid var(--light-gray);
				border-radius: 0.5rem;
				font-size: 1rem;
				background-color: white;

				&:focus {
					outline: none;
					border-color: var(--primary);
					box-shadow: 0 0 0 2px var(--accent-light);
				}
			}
		}

		.error-message {
			color: var(--error);
			margin-bottom: 1rem;
			font-size: 0.875rem;
		}

		.submit-button {
			width: 100%;
			background-color: var(--primary);
			color: white;
			border: none;
			padding: 0.875rem 1.5rem;
			border-radius: 0.5rem;
			font-size: 1rem;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.2s ease;

			&:hover {
				background-color: var(--primary-dark);
				transform: translateY(-2px);
				box-shadow: var(--shadow-md);
			}

			&:disabled {
				background-color: var(--medium-gray);
				cursor: not-allowed;
				transform: none;
				box-shadow: none;
			}
		}
	}

	/* Success Message */
	.success-message {
		text-align: center;
		padding: 1rem 0;

		.icon-success {
			display: flex;
			justify-content: center;
			margin-bottom: 1rem;

			svg {
				color: var(--success);
			}
		}

		h2 {
			color: var(--success);
			margin-bottom: 1rem;
		}

		p {
			margin-bottom: 1.5rem;
		}

		.email-note {
			font-size: 0.875rem;
			opacity: 0.8;
			margin-bottom: 2rem;
		}

		.home-button {
			display: inline-block;
			background-color: var(--primary);
			color: white;
			padding: 0.75rem 1.5rem;
			border-radius: 0.5rem;
			text-decoration: none;
			font-weight: 600;
			transition: all 0.2s ease;

			&:hover {
				background-color: var(--primary-dark);
				transform: translateY(-2px);
				box-shadow: var(--shadow-md);
			}
		}
	}

	/* Testimonials Section */
	.testimonials-section {
		padding: 4rem 0;
		text-align: center;

		h2 {
			margin-bottom: 2.5rem;
			font-size: 2rem;
			color: var(--darkest-gray);
		}

		.testimonials-container {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1.5rem;

			@media (min-width: 768px) {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		.testimonial-card {
			background-color: white;
			border-radius: 1rem;
			padding: 2rem;
			text-align: left;
			position: relative;
			box-shadow: var(--shadow-md);
			border: 1px solid var(--light-gray);
			height: 100%;
			display: flex;
			flex-direction: column;

			.quote {
				position: absolute;
				top: 1rem;
				left: 1.5rem;
				font-size: 4rem;
				line-height: 1;
				color: var(--accent-light);
				font-family: serif;
				opacity: 0.8;
			}

			.testimonial-text {
				margin-top: 1.5rem;
				margin-bottom: 1.5rem;
				color: var(--text-primary);
				font-style: italic;
				z-index: 1;
				flex: 1;
			}

			.testimonial-author {
				display: flex;
				flex-direction: column;

				strong {
					color: var(--darkest-gray);
				}

				.type-tag {
					display: inline-block;
					background-color: var(--accent-light);
					color: var(--primary-dark);
					padding: 0.25rem 0.5rem;
					border-radius: 0.25rem;
					font-size: 0.75rem;
					margin-top: 0.5rem;
					align-self: flex-start;
				}
			}
		}
	}

	/* Benefits Section */
	.benefits-section {
		padding: 4rem 0;
		background-color: var(--off-white);
		border-radius: 1rem;
		margin: 2rem 0;

		h2 {
			text-align: center;
			margin-bottom: 2.5rem;
			font-size: 2rem;
			color: var(--darkest-gray);
		}

		.benefits-grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding: 0 1rem;

			@media (min-width: 640px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media (min-width: 1024px) {
				grid-template-columns: repeat(4, 1fr);
			}
		}

		.benefit-card {
			background-color: white;
			border-radius: 0.75rem;
			padding: 1.5rem;
			text-align: center;
			height: 100%;
			border: 1px solid var(--light-gray);
			transition: all 0.3s ease;

			&:hover {
				transform: translateY(-5px);
				box-shadow: var(--shadow-md);
				border-color: var(--accent-light);
			}

			.benefit-icon {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 60px;
				height: 60px;
				background-color: var(--accent-light);
				border-radius: 50%;
				margin: 0 auto 1rem;

				svg {
					color: var(--primary-dark);
				}
			}

			h3 {
				color: var(--primary-dark);
				margin-bottom: 0.75rem;
				font-size: 1.25rem;
			}

			p {
				color: var(--text-secondary);
				font-size: 0.95rem;
			}
		}
	}

	/* Session Process Section */
	.session-process {
		padding: 4rem 0;

		h2 {
			text-align: center;
			margin-bottom: 2.5rem;
			font-size: 2rem;
			color: var(--darkest-gray);
		}

		.steps-container {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1.5rem;

			@media (min-width: 768px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.step-card {
			display: flex;
			background-color: white;
			border-radius: 0.75rem;
			padding: 1.5rem;
			border: 1px solid var(--light-gray);
			transition: all 0.3s ease;

			&:hover {
				transform: translateY(-3px);
				box-shadow: var(--shadow-md);
				border-color: var(--accent-light);
			}

			.step-number {
				font-size: 2rem;
				font-weight: 700;
				color: var(--primary);
				margin-right: 1rem;
				opacity: 0.8;
			}

			.step-content {
				flex: 1;

				h3 {
					color: var(--primary-dark);
					margin-bottom: 0.5rem;
					font-size: 1.25rem;
				}

				p {
					color: var(--text-secondary);
					font-size: 0.95rem;
				}
			}
		}
	}

	/* Enneagram Visual Section */
	.enneagram-visual-section {
		padding: 4rem 0;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--darkest-gray) 100%);
		color: white;
		border-radius: 1rem;
		margin: 2rem 0;

		.content-split {
			display: flex;
			flex-direction: column;
			gap: 2rem;

			@media (min-width: 768px) {
				flex-direction: row;
				align-items: center;
			}
		}

		.text-content {
			flex: 1;
			padding: 2rem;

			h2 {
				color: white;
				margin-bottom: 1.5rem;
				font-size: 2rem;
			}

			p {
				color: rgba(255, 255, 255, 0.9);
				margin-bottom: 1rem;
				font-size: 1.1rem;
			}
		}

		.diagram-container {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 1rem;
		}

		.cta-secondary {
			margin-top: 2rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			@media (min-width: 640px) {
				flex-direction: row;
				align-items: center;
			}

			.cta-button {
				display: inline-block;
				background-color: white;
				color: var(--primary-dark);
				padding: 0.875rem 1.5rem;
				border-radius: 0.5rem;
				text-decoration: none;
				font-weight: 600;
				text-align: center;
				transition: all 0.2s ease;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
				}
			}

			.text-link {
				color: white;
				text-decoration: none;
				display: inline-block;
				border-bottom: 1px solid rgba(255, 255, 255, 0.3);
				padding-bottom: 2px;
				transition: all 0.2s ease;

				&:hover {
					border-bottom-color: white;
				}
			}
		}
	}

	/* FAQ Section */
	.faq-section {
		padding: 4rem 0;

		h2 {
			text-align: center;
			margin-bottom: 2.5rem;
			font-size: 2rem;
			color: var(--darkest-gray);
		}

		.faq-grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1.5rem;

			@media (min-width: 768px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.faq-item {
			background-color: white;
			border-radius: 0.75rem;
			padding: 1.5rem;
			border: 1px solid var(--light-gray);

			h3 {
				color: var(--primary-dark);
				margin-bottom: 0.75rem;
				font-size: 1.25rem;
				position: relative;
				padding-left: 1.5rem;

				&:before {
					content: 'Q:';
					position: absolute;
					left: 0;
					color: var(--primary);
				}
			}

			p {
				color: var(--text-secondary);
				position: relative;
				padding-left: 1.5rem;

				&:before {
					content: 'A:';
					position: absolute;
					left: 0;
					color: var(--accent);
					font-weight: 600;
				}
			}
		}
	}

	/* Final CTA */
	.final-cta {
		background: linear-gradient(135deg, var(--accent-light) 0%, white 100%);
		border-radius: 1rem;
		padding: 3rem 2rem;
		text-align: center;
		margin: 3rem 0;
		border: 1px solid var(--light-gray);
		box-shadow: var(--shadow-md);

		.cta-content {
			max-width: 700px;
			margin: 0 auto;

			h2 {
				color: var(--primary-dark);
				margin-bottom: 1rem;
				font-size: 2rem;
			}

			p {
				color: var(--text-secondary);
				margin-bottom: 2rem;
				font-size: 1.1rem;
			}

			.cta-button-large {
				display: inline-block;
				background-color: var(--primary);
				color: white;
				padding: 1rem 2rem;
				border-radius: 0.5rem;
				text-decoration: none;
				font-weight: 600;
				font-size: 1.125rem;
				transition: all 0.3s ease;

				&:hover {
					background-color: var(--primary-dark);
					transform: translateY(-3px);
					box-shadow: var(--shadow-lg);
				}
			}
		}
	}

	/* Animation Styles - Removed entirely since we're not using animations */

	/* Responsive Adjustments */
	@media (max-width: 768px) {
		.hero-section {
			padding: 2rem 0;

			h1 {
				font-size: 2rem;
			}

			.subtitle {
				font-size: 1.1rem;
			}
		}

		.form-container {
			margin: 0 auto;
		}

		.testimonial-card,
		.benefit-card,
		.step-card,
		.faq-item {
			padding: 1.25rem;
		}

		.benefit-card .benefit-icon {
			width: 50px;
			height: 50px;
		}

		.enneagram-visual-section .text-content {
			padding: 1.5rem;

			h2 {
				font-size: 1.75rem;
			}

			p {
				font-size: 1rem;
			}
		}

		.final-cta {
			padding: 2rem 1rem;

			.cta-content h2 {
				font-size: 1.75rem;
			}
		}
	}

	/* Accessibility - Simplified since we're not using animations */
	@media (prefers-reduced-motion: reduce) {
		* {
			transition-duration: 0.001ms !important;
			animation-duration: 0.001ms !important;
		}
	}
</style>
