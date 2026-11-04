<!-- src/routes/posting-and-privacy/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import SEOHead from '$lib/components/SEOHead.svelte';
</script>

<SEOHead
	title="Posting, Privacy & Community Guidelines | 9takes"
	description="What happens to your answers on 9takes, how guest posting works, and how to ask for a correction or report a concern."
	canonical="https://9takes.com/posting-and-privacy"
/>

<article class="posting-guide">
	<header>
		<a href={resolve('/')}>Back to 9takes</a>
		<h1>Posting &amp; privacy</h1>
		<p class="lead">Know what you’re sharing before you join the conversation.</p>
	</header>

	<nav aria-label="On this page">
		<a href="#public-answers">Public answers</a>
		<a href="#editing-and-removal">Editing &amp; removal</a>
		<a href="#browser-data">Browser data</a>
		<a href="#community-guidelines">Community guidelines</a>
	</nav>

	<section id="public-answers" aria-labelledby="public-title">
		<h2 id="public-title">Your answer joins a public conversation</h2>
		<p>
			Posting on a live question saves your answer and lets you read other people’s answers. Guests
			post without a public name. If you’re signed in, your answer is associated with your account.
			Posting without a name does not make the answer private.
		</p>
		<p>
			Share only what you’re comfortable having other people read or copy. Leave out contact details
			and information that identifies someone who has not agreed to be named.
		</p>
		<p>
			You can give a first answer to a question as a guest. Sign in to reply to other people. If you
			choose email notifications after posting, the email address is used to send reply
			notifications; it is not displayed with your answer.
		</p>
	</section>

	<section id="editing-and-removal" aria-labelledby="editing-title">
		<h2 id="editing-title">Editing or requesting removal</h2>
		<p>
			If you posted from your account, open the full question page and choose
			<strong>Edit Comment</strong> from your answer’s options menu. Guest answers do not have an edit
			control, and there is no self-service delete control for answers.
		</p>
		<p>
			For a guest correction or a removal request, email
			<a href="mailto:usersup@9takes.com">usersup@9takes.com</a>. Include the question link and
			enough of the answer to identify it. We may need more information to establish that the answer
			is yours. Clearing browser data does not remove a posted answer.
		</p>
	</section>

	<section aria-labelledby="drafts-title">
		<h2 id="drafts-title">Drafts and practice examples</h2>
		<p>
			An unsubmitted homepage answer stays in the current tab and clears when you refresh. When the
			homepage offers a private practice exercise, its button says
			<strong>Reveal 9 perspectives</strong>. That exercise does not post your draft or send it to
			an AI; it shows prepared AI-written examples.
		</p>
		<p>
			Live community answers and AI-written examples are labeled separately. The examples are
			possible ways to see a situation, not a personality assessment of you or anyone you describe.
		</p>
	</section>

	<section id="browser-data" aria-labelledby="browser-title">
		<h2 id="browser-title">Cookies, accounts and usage data</h2>
		<p>
			9takes uses cookies and browser storage to maintain sign-in, remember preferences and
			recognize guest activity. A visitor identifier helps recognize that you have answered a
			question. Guest posting hides your name from readers; it does not mean the service holds no
			information about your visit.
		</p>
		<p>
			We collect usage information such as page visits, interactions and device or browser details
			to understand how the site is used and improve it. Account activity can be associated with
			your account. The homepage’s answer-started and posting analytics events do not include your
			answer text; submitting a live answer separately sends that text to the service for posting.
		</p>
		<p>
			For questions about your account, stored data or a privacy concern, contact
			<a href="mailto:usersup@9takes.com">usersup@9takes.com</a>.
		</p>
	</section>

	<section id="community-guidelines" aria-labelledby="guidelines-title">
		<h2 id="guidelines-title">Community guidelines</h2>
		<ul>
			<li><strong>Give your own answer.</strong> Share what you think and why.</li>
			<li>
				<strong>Disagree with curiosity.</strong> Challenge an idea without harassing or threatening the
				person sharing it.
			</li>
			<li>
				<strong>Protect people’s privacy.</strong> Don’t share private contact details or identifying
				information about someone without their permission.
			</li>
			<li>
				<strong>Use types as a lens.</strong> Don’t treat an Enneagram label as a diagnosis or a reason
				to dismiss someone.
			</li>
			<li>
				<strong>Stay with the question.</strong> Leave out spam, impersonation and repeated promotions.
			</li>
		</ul>
		<p>
			To report a concern, open a comment’s options menu and choose <strong>Flag Comment</strong>,
			or email <a href="mailto:usersup@9takes.com">usersup@9takes.com</a> with the question link and a
			description of the issue. Moderators can review flagged comments. A moderation flag is not a request
			to delete your data; use the contact above for that.
		</p>
	</section>
</article>

<style>
	.posting-guide {
		max-width: 800px;
		margin-inline: auto;
		padding: var(--space-3xl) var(--space-xl);
		color: var(--ink-bright);
		font-size: 16px;
		line-height: 1.65;
	}
	h1,
	h2,
	p {
		margin: 0;
	}
	h1,
	h2 {
		text-wrap: balance;
	}
	h1 {
		margin-top: var(--space-xl);
		font-size: clamp(32px, 6vw, 48px);
		line-height: 1.1;
		letter-spacing: -0.035em;
	}
	.lead {
		margin-top: var(--space-lg);
		font-size: 18px;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-xl);
		margin-top: var(--space-xl);
		padding-block: var(--space-md);
		border-block: 1px solid var(--stone-edge);
	}
	nav a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
	section {
		margin-top: var(--space-3xl);
		scroll-margin-top: 160px;
	}
	h2 {
		font-size: 28px;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}
	p + p,
	section p,
	ul {
		margin-top: var(--space-lg);
	}
	ul {
		padding-left: var(--space-xl);
		list-style: disc;
	}
	li + li {
		margin-top: var(--space-md);
	}
	a {
		color: var(--lamp-glow);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	:global(:root.light) a {
		color: var(--lamp-deep);
	}
	a:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 4px;
	}
</style>
