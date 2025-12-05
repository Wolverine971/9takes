<!-- src/routes/intake/[token]/+page.svelte -->
<!-- Client-facing intake form for personality coaching -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let currentSection = 1;
	let isSubmitting = false;
	let showSuccess = form?.success || false;

	const totalSections = 7;

	// Timezone detection (client-side only)
	let detectedTimezone = '';
	onMount(() => {
		if (typeof Intl !== 'undefined') {
			detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		}
	});

	function nextSection() {
		if (currentSection < totalSections) {
			currentSection++;
			scrollToTop();
		}
	}

	function prevSection() {
		if (currentSection > 1) {
			currentSection--;
			scrollToTop();
		}
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const ageRanges = [
		{ value: '18-24', label: '18-24' },
		{ value: '25-34', label: '25-34' },
		{ value: '35-44', label: '35-44' },
		{ value: '45-54', label: '45-54' },
		{ value: '55-64', label: '55-64' },
		{ value: '65+', label: '65+' }
	];

	const relationshipStatuses = [
		{ value: 'single', label: 'Single' },
		{ value: 'dating', label: 'Dating' },
		{ value: 'committed', label: 'In a committed relationship' },
		{ value: 'married', label: 'Married' },
		{ value: 'divorced', label: 'Divorced' },
		{ value: 'widowed', label: 'Widowed' },
		{ value: 'other', label: 'Other' }
	];

	const urgencyLevels = [
		{ value: 'low', label: 'Low - Just exploring' },
		{ value: 'medium', label: 'Medium - Ready to start working on things' },
		{ value: 'high', label: 'High - Need to make changes soon' },
		{ value: 'critical', label: 'Critical - Urgent situation' }
	];

	const primaryEmotions = [
		{
			value: 'anger',
			label: 'Anger/Frustration',
			description: 'Often feel irritated, resentful, or like things should be different'
		},
		{
			value: 'shame',
			label: 'Shame/Image concerns',
			description: "Often worry about how you're perceived or feel not good enough"
		},
		{
			value: 'fear',
			label: 'Fear/Anxiety',
			description: 'Often feel worried, uncertain, or need to prepare for the worst'
		}
	];

	const sessionTimes = [
		{ value: 'morning', label: 'Morning (8am-12pm)' },
		{ value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
		{ value: 'evening', label: 'Evening (5pm-9pm)' }
	];
</script>

<svelte:head>
	<title>Intake Form | 9takes Personality Coaching</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="intake-container">
	{#if data.completed || showSuccess}
		<!-- Thank You Screen -->
		<div class="completion-screen">
			<div class="completion-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="64"
					height="64"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22,4 12,14.01 9,11.01" />
				</svg>
			</div>
			<h1>Thank You!</h1>
			<p class="completion-message">
				Your intake form has been submitted successfully. We've received your responses and will
				review them before our session.
			</p>
			<p class="completion-next">
				<strong>What's next?</strong><br />
				We'll reach out soon to confirm your session time and share any preparation materials.
			</p>
			<a href="https://9takes.com" class="btn btn-primary">Visit 9takes</a>
		</div>
	{:else}
		<!-- Header -->
		<header class="intake-header">
			<div class="logo">
				<a href="https://9takes.com">9takes</a>
			</div>
			<h1>Personality Coaching Intake</h1>
			<p class="greeting">
				Hi {data.intake.clientName}! Please take a few minutes to fill out this form. Your answers
				help us prepare for a more effective first session.
			</p>
		</header>

		<!-- Progress Bar -->
		<div class="progress-container">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {(currentSection / totalSections) * 100}%"></div>
			</div>
			<span class="progress-text">Section {currentSection} of {totalSections}</span>
		</div>

		<!-- Error Message -->
		{#if form?.error}
			<div class="error-banner">
				{form.error}
			</div>
		{/if}

		<!-- Form -->
		<form
			method="POST"
			action="?/submit"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						showSuccess = true;
						scrollToTop();
					} else {
						await update();
					}
				};
			}}
		>
			<!-- Section 1: Background -->
			<section class="form-section" class:active={currentSection === 1}>
				<h2>About You</h2>
				<p class="section-intro">Let's start with some basic information.</p>

				<div class="form-group">
					<label for="age_range">Age Range</label>
					<select id="age_range" name="age_range">
						<option value="">Select...</option>
						{#each ageRanges as range}
							<option value={range.value}>{range.label}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="occupation">What do you do for work?</label>
					<input
						type="text"
						id="occupation"
						name="occupation"
						placeholder="e.g., Software engineer, Teacher, Entrepreneur..."
					/>
				</div>

				<div class="form-group">
					<label for="relationship_status">Relationship Status</label>
					<select id="relationship_status" name="relationship_status">
						<option value="">Select...</option>
						{#each relationshipStatuses as status}
							<option value={status.value}>{status.label}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="living_situation">Living Situation</label>
					<input
						type="text"
						id="living_situation"
						name="living_situation"
						placeholder="e.g., Live alone, with partner, with family..."
					/>
				</div>
			</section>

			<!-- Section 2: Current Situation -->
			<section class="form-section" class:active={currentSection === 2}>
				<h2>Current Situation</h2>
				<p class="section-intro">Help us understand what's bringing you to coaching right now.</p>

				<div class="form-group">
					<label for="current_challenges">
						What's the main challenge you're facing right now? *
					</label>
					<textarea
						id="current_challenges"
						name="current_challenges"
						rows="4"
						placeholder="Be as specific as you're comfortable with..."
						required
					></textarea>
					<span class="field-hint"
						>This is the most important question - take your time with it.</span
					>
				</div>

				<div class="form-group">
					<label for="desired_outcome">What would success look like for you? *</label>
					<textarea
						id="desired_outcome"
						name="desired_outcome"
						rows="3"
						placeholder="If our work together is successful, what would be different in your life?"
						required
					></textarea>
				</div>

				<div class="form-group">
					<label for="previous_attempts">What have you already tried?</label>
					<textarea
						id="previous_attempts"
						name="previous_attempts"
						rows="3"
						placeholder="Therapy, self-help books, other coaches, courses, etc."
					></textarea>
				</div>

				<div class="form-group">
					<label for="urgency_level">How urgent does this feel?</label>
					<select id="urgency_level" name="urgency_level">
						<option value="">Select...</option>
						{#each urgencyLevels as level}
							<option value={level.value}>{level.label}</option>
						{/each}
					</select>
				</div>
			</section>

			<!-- Section 3: Personality Assessment -->
			<section class="form-section" class:active={currentSection === 3}>
				<h2>Personality Assessment</h2>
				<p class="section-intro">
					Let's explore your Enneagram type. Don't worry if you're not sure - we'll figure it out
					together.
				</p>

				<div class="form-group">
					<label for="suspected_type">Do you know (or suspect) your Enneagram type?</label>
					<select id="suspected_type" name="suspected_type">
						<option value="">Not sure / Don't know</option>
						<option value="1">Type 1 - The Reformer/Perfectionist</option>
						<option value="2">Type 2 - The Helper/Giver</option>
						<option value="3">Type 3 - The Achiever/Performer</option>
						<option value="4">Type 4 - The Individualist/Romantic</option>
						<option value="5">Type 5 - The Investigator/Observer</option>
						<option value="6">Type 6 - The Loyalist/Guardian</option>
						<option value="7">Type 7 - The Enthusiast/Adventurer</option>
						<option value="8">Type 8 - The Challenger/Protector</option>
						<option value="9">Type 9 - The Peacemaker/Mediator</option>
					</select>
				</div>

				<div class="form-group">
					<label for="why_this_type">Why do you think you might be this type?</label>
					<textarea
						id="why_this_type"
						name="why_this_type"
						rows="3"
						placeholder="What resonates with you about this type? Skip if unsure."
					></textarea>
				</div>

				<div class="form-group">
					<label for="core_fear">What's your biggest fear in life?</label>
					<textarea
						id="core_fear"
						name="core_fear"
						rows="3"
						placeholder="The deep fear that drives many of your decisions..."
					></textarea>
					<span class="field-hint"
						>Think about what keeps you up at night or what you work hardest to avoid.</span
					>
				</div>

				<div class="form-group">
					<label for="core_desire">What do you want most in life?</label>
					<textarea
						id="core_desire"
						name="core_desire"
						rows="3"
						placeholder="The thing you're really searching for..."
					></textarea>
				</div>

				<div class="form-group">
					<label for="childhood_message">
						What message did you get growing up about your worth?
					</label>
					<textarea
						id="childhood_message"
						name="childhood_message"
						rows="3"
						placeholder="What did you learn about what you needed to do or be to be valued?"
					></textarea>
				</div>
			</section>

			<!-- Section 4: Emotional Patterns -->
			<section class="form-section" class:active={currentSection === 4}>
				<h2>Emotional Patterns</h2>
				<p class="section-intro">Understanding your emotional landscape helps us work together.</p>

				<div class="form-group">
					<span id="emotion-label" class="field-label"
						>Which emotion do you experience most often?</span
					>
					<div class="radio-group" role="radiogroup" aria-labelledby="emotion-label">
						{#each primaryEmotions as emotion}
							<label class="radio-option">
								<input type="radio" name="primary_emotion" value={emotion.value} />
								<span class="radio-label">{emotion.label}</span>
								<span class="radio-description">{emotion.description}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="form-group">
					<label for="emotion_expression"
						>How do you typically express or manage this emotion?</label
					>
					<textarea
						id="emotion_expression"
						name="emotion_expression"
						rows="3"
						placeholder="Do you express it outwardly, suppress it, channel it somewhere..."
					></textarea>
				</div>

				<div class="form-group">
					<label for="stress_response">What do you do when you're stressed?</label>
					<textarea
						id="stress_response"
						name="stress_response"
						rows="3"
						placeholder="How do you act when things get difficult?"
					></textarea>
				</div>

				<div class="form-group">
					<label for="comfort_response">What do you do when you're relaxed and at your best?</label>
					<textarea
						id="comfort_response"
						name="comfort_response"
						rows="3"
						placeholder="How do you show up when life is going well?"
					></textarea>
				</div>
			</section>

			<!-- Section 5: Relationships -->
			<section class="form-section" class:active={currentSection === 5}>
				<h2>Relationships</h2>
				<p class="section-intro">How you relate to others reveals important patterns.</p>

				<div class="form-group">
					<label for="relationship_patterns"
						>What patterns do you notice in your relationships?</label
					>
					<textarea
						id="relationship_patterns"
						name="relationship_patterns"
						rows="4"
						placeholder="Any recurring issues, dynamics, or themes across different relationships..."
					></textarea>
				</div>

				<div class="form-group">
					<label for="communication_style">How would you describe your communication style?</label>
					<textarea
						id="communication_style"
						name="communication_style"
						rows="3"
						placeholder="Are you direct, indirect, assertive, passive, detailed, big-picture..."
					></textarea>
				</div>

				<div class="form-group">
					<label for="conflict_style">How do you handle conflict?</label>
					<textarea
						id="conflict_style"
						name="conflict_style"
						rows="3"
						placeholder="Do you confront it, avoid it, try to fix it, need time to process..."
					></textarea>
				</div>
			</section>

			<!-- Section 6: Goals -->
			<section class="form-section" class:active={currentSection === 6}>
				<h2>Your Goals</h2>
				<p class="section-intro">Let's get specific about what you want to achieve.</p>

				<div class="form-group">
					<label for="short_term_goals">What do you want to accomplish in the next 3 months?</label>
					<textarea
						id="short_term_goals"
						name="short_term_goals"
						rows="3"
						placeholder="Specific, concrete outcomes you're working toward..."
					></textarea>
				</div>

				<div class="form-group">
					<label for="long_term_goals">Where do you want to be in 1-2 years?</label>
					<textarea
						id="long_term_goals"
						name="long_term_goals"
						rows="3"
						placeholder="Your bigger vision for your life..."
					></textarea>
				</div>

				<div class="form-group">
					<label for="specific_scenarios">
						Are there specific situations you'd like to work on?
					</label>
					<textarea
						id="specific_scenarios"
						name="specific_scenarios"
						rows="4"
						placeholder="Particular scenarios, relationships, or challenges you want to address..."
					></textarea>
				</div>
			</section>

			<!-- Section 7: Logistics -->
			<section class="form-section" class:active={currentSection === 7}>
				<h2>Scheduling</h2>
				<p class="section-intro">Last section! Just a few logistics.</p>

				<div class="form-group">
					<label for="preferred_session_time">When do you prefer to have sessions?</label>
					<select id="preferred_session_time" name="preferred_session_time">
						<option value="">Select...</option>
						{#each sessionTimes as time}
							<option value={time.value}>{time.label}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="timezone">Your Timezone</label>
					<input
						type="text"
						id="timezone"
						name="timezone"
						value={detectedTimezone}
						placeholder="e.g., America/New_York"
					/>
				</div>

				<div class="form-group">
					<label for="how_heard_about_us">How did you hear about us?</label>
					<input
						type="text"
						id="how_heard_about_us"
						name="how_heard_about_us"
						placeholder="Google, friend, social media..."
					/>
				</div>

				<div class="submit-section">
					<p class="privacy-note">
						Your responses are private and will only be used to prepare for your coaching sessions.
					</p>
					<button type="submit" class="btn btn-primary btn-large" disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
					</button>
				</div>
			</section>

			<!-- Navigation -->
			<div class="form-navigation">
				{#if currentSection > 1}
					<button type="button" class="btn btn-secondary" on:click={prevSection}> Previous </button>
				{:else}
					<div></div>
				{/if}

				{#if currentSection < totalSections}
					<button type="button" class="btn btn-primary" on:click={nextSection}> Next </button>
				{/if}
			</div>
		</form>
	{/if}
</div>

<style>
	:global(body) {
		background: #f9fafb;
	}

	.intake-container {
		max-width: 640px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	/* Header */
	.intake-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo {
		margin-bottom: 1rem;
	}

	.logo a {
		font-size: 1.25rem;
		font-weight: 700;
		color: #6366f1;
		text-decoration: none;
	}

	.intake-header h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 0.75rem;
		color: #1f2937;
	}

	.greeting {
		color: #6b7280;
		font-size: 0.95rem;
		line-height: 1.5;
		margin: 0;
	}

	/* Progress */
	.progress-container {
		margin-bottom: 2rem;
	}

	.progress-bar {
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #6366f1, #8b5cf6);
		transition: width 0.3s ease;
	}

	.progress-text {
		display: block;
		text-align: center;
		font-size: 0.75rem;
		color: #9ca3af;
		margin-top: 0.5rem;
	}

	/* Error Banner */
	.error-banner {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	/* Form Sections */
	.form-section {
		display: none;
		background: white;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		margin-bottom: 1rem;
	}

	.form-section.active {
		display: block;
	}

	.form-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: #1f2937;
	}

	.section-intro {
		color: #6b7280;
		font-size: 0.9rem;
		margin: 0 0 1.5rem;
	}

	/* Form Groups */
	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label,
	.form-group .field-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: inherit;
		transition: border-color 0.2s;
		background: white;
	}

	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.field-hint {
		display: block;
		font-size: 0.75rem;
		color: #9ca3af;
		margin-top: 0.375rem;
	}

	/* Radio Group */
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.radio-option {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.radio-option:hover {
		border-color: #c7d2fe;
		background: #f5f3ff;
	}

	.radio-option input[type='radio'] {
		width: auto;
		margin-top: 0.125rem;
	}

	.radio-label {
		font-weight: 500;
		color: #1f2937;
		flex: 1;
	}

	.radio-description {
		width: 100%;
		font-size: 0.8rem;
		color: #6b7280;
		margin-left: 1.5rem;
	}

	/* Navigation */
	.form-navigation {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-size: 0.95rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #6366f1;
		color: white;
	}

	.btn-primary:hover {
		background: #4f46e5;
	}

	.btn-primary:disabled {
		background: #a5b4fc;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		border: 1px solid #d1d5db;
		color: #374151;
	}

	.btn-secondary:hover {
		background: #f9fafb;
	}

	.btn-large {
		padding: 1rem 2rem;
		font-size: 1rem;
	}

	/* Submit Section */
	.submit-section {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
		text-align: center;
	}

	.privacy-note {
		font-size: 0.8rem;
		color: #9ca3af;
		margin-bottom: 1rem;
	}

	/* Completion Screen */
	.completion-screen {
		text-align: center;
		background: white;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 3rem 2rem;
	}

	.completion-icon {
		color: #10b981;
		margin-bottom: 1.5rem;
	}

	.completion-screen h1 {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0 0 1rem;
		color: #1f2937;
	}

	.completion-message {
		color: #6b7280;
		font-size: 1rem;
		line-height: 1.6;
		margin: 0 0 1.5rem;
	}

	.completion-next {
		background: #f3f4f6;
		padding: 1rem;
		border-radius: 8px;
		font-size: 0.9rem;
		color: #374151;
		margin-bottom: 2rem;
	}

	@media (max-width: 640px) {
		.intake-container {
			padding: 1rem;
		}

		.form-section {
			padding: 1rem;
		}
	}
</style>
