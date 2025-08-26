<!-- src/routes/stories/enneagram-and-mental-illness/+page.svelte -->
<!DOCTYPE html>
<html amp lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
		<title>The Enneagram and Mental Illness: Each Type's Predispositions</title>
		<link rel="canonical" href="https://9takes.com/enneagram-corner/enneagram-and-mental-illness" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Noticia+Text:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Mono&display=swap"
			rel="stylesheet"
		/>

		<!-- Required AMP markup -->
		<script async src="https://cdn.ampproject.org/v0.js"></script>
		<script
			async
			custom-element="amp-story"
			src="https://cdn.ampproject.org/v0/amp-story-1.0.js"
		></script>
		<script
			async
			custom-element="amp-video"
			src="https://cdn.ampproject.org/v0/amp-video-0.1.js"
		></script>

		<style amp-boilerplate>
			body {
				-webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
				-moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
				-ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
				animation: -amp-start 8s steps(1, end) 0s 1 normal both;
			}

			@-webkit-keyframes -amp-start {
				from {
					visibility: hidden;
				}

				to {
					visibility: visible;
				}
			}

			@-moz-keyframes -amp-start {
				from {
					visibility: hidden;
				}

				to {
					visibility: visible;
				}
			}

			@-ms-keyframes -amp-start {
				from {
					visibility: hidden;
				}

				to {
					visibility: visible;
				}
			}

			@-o-keyframes -amp-start {
				from {
					visibility: hidden;
				}

				to {
					visibility: visible;
				}
			}

			@keyframes -amp-start {
				from {
					visibility: hidden;
				}

				to {
					visibility: visible;
				}
			}
		</style><noscript>
			<style amp-boilerplate>
				body {
					-webkit-animation: none;
					-moz-animation: none;
					-ms-animation: none;
					animation: none;
				}
			</style>
		</noscript>

		<!-- Custom styles for the Web Story - 9takes branding -->
		<style amp-custom>
			:root {
				--primary: #6c5ce7;
				--primary-dark: #4834d4;
				--primary-light: #a29bfe;
				--accent: #8c7ae6;
				--accent-dark: #7158e2;
				--accent-light: #e9e4ff;
				--white: #ffffff;
				--off-white: #f9f9ff;
				--lightest-gray: #f0f2f5;
				--light-gray: #e4e6eb;
				--medium-gray: #c1c5d0;
				--dark-gray: #65676b;
				--darkest-gray: #2a2d34;
				--black: #18191a;
				--success: #00b894;
				--warning: #fdcb6e;
				--error: #e84393;
				--info: #74b9ff;
				--text-primary: #2d3436;
				--text-secondary: #636e72;
				--border-radius: 0.5rem;
			}

			amp-story {
				font-family: 'Noticia Text', serif;
				color: var(--white);
			}

			amp-story-page {
				background-color: var(--black);
			}

			h1 {
				font-size: 2em;
				font-weight: bold;
				line-height: 1.2;
				margin: 0 0 0.5em;
			}

			h2 {
				font-size: 1.5em;
				font-weight: bold;
				line-height: 1.2;
				margin: 0 0 0.5em;
			}

			p {
				font-size: 1.1em;
				line-height: 1.4;
				margin: 0 0 0.5em;
			}

			.overlay {
				background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
				padding: 2em;
				width: 100%;
				max-height: 80%;
				position: absolute;
				bottom: 0;
				left: 0;
			}

			.top-overlay {
				background: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
				padding: 2em;
				width: 100%;
				max-height: 30%;
				position: absolute;
				top: 0;
				left: 0;
			}

			.centered-box {
				text-align: center;
				background-color: rgba(0, 0, 0, 0.7);
				border-radius: var(--border-radius);
				padding: 2em;
				width: 85%;
				margin: 0 auto;
			}

			.type-title {
				font-size: 1.8em;
				font-weight: bold;
				margin-bottom: 0.3em;
			}

			.type-subtitle {
				font-size: 1.2em;
				margin-bottom: 1em;
				opacity: 0.9;
			}

			.type-list {
				list-style-type: none;
				padding-left: 0.5em;
			}

			.type-list li {
				margin-bottom: 0.7em;
				text-align: left;
				position: relative;
				padding-left: 1.5em;
			}

			.type-list li:before {
				content: '•';
				position: absolute;
				left: 0.3em;
				color: var(--primary-light);
			}

			/* Type-specific colors - using 9takes palette */
			.type1-color {
				background: linear-gradient(135deg, var(--primary), var(--primary-dark));
			}

			.type2-color {
				background: linear-gradient(135deg, var(--accent), var(--accent-dark));
			}

			.type3-color {
				background: linear-gradient(135deg, var(--primary-light), var(--primary));
			}

			.type4-color {
				background: linear-gradient(135deg, var(--error), #be185d);
			}

			.type5-color {
				background: linear-gradient(135deg, var(--info), #1d4ed8);
			}

			.type6-color {
				background: linear-gradient(135deg, var(--accent-dark), var(--primary-dark));
			}

			.type7-color {
				background: linear-gradient(135deg, var(--warning), #b45309);
			}

			.type8-color {
				background: linear-gradient(135deg, #e84393, var(--primary));
			}

			.type9-color {
				background: linear-gradient(135deg, var(--success), var(--info));
			}

			.brand-gradient {
				background: linear-gradient(135deg, var(--primary-dark), var(--accent));
			}

			/* Improved styling for bookend */
			amp-story-bookend {
				font-family: 'Noticia Text', serif;
			}

			/* Buttons and interactive elements */
			.cta-button {
				background-color: var(--primary);
				color: var(--white);
				border-radius: var(--border-radius);
				padding: 0.75em 1.5em;
				font-weight: bold;
				text-decoration: none;
				display: inline-block;
				margin-top: 1em;
			}
		</style>

		<!-- Schema.org structured data -->
		<script type="application/ld+json">
			{
				"@context": "http://schema.org",
				"@type": "Article",
				"mainEntityOfPage": {
					"@type": "WebPage",
					"@id": "https://9takes.com/enneagram-corner/enneagram-and-mental-illness"
				},
				"headline": "The Enneagram and Mental Illness: A Guide to Understanding Each Type's Predispositions",
				"image": "https://9takes.com/blogs/greek-statue-2-sided-mask.webp",
				"datePublished": "2023-12-08T08:00:00+08:00",
				"dateModified": "2025-01-22T09:00:00+08:00",
				"author": {
					"@type": "Person",
					"name": "DJ Wayne"
				},
				"publisher": {
					"@type": "Organization",
					"name": "9takes",
					"logo": {
						"@type": "ImageObject",
						"url": "https://9takes.com/brand/aero.png",
						"width": 600,
						"height": 60
					}
				}
			}
		</script>
	</head>

	<body>
		<!-- The Web Story itself -->
		<amp-story
			standalone
			title="The Enneagram and Mental Illness"
			publisher="9takes"
			publisher-logo-src="https://9takes.com/brand/aero.png"
			poster-portrait-src="https://9takes.com/blogs/greek-statue-2-sided-mask.webp"
		>
			<!-- Cover Page -->
			<amp-story-page id="cover">
				<amp-story-grid-layer template="fill">
					<amp-img
						src="https://9takes.com/blogs/greek-statue-2-sided-mask.webp"
						width="720"
						height="1280"
						layout="responsive"
						alt="Greek statue with two-sided mask"
					>
					</amp-img>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="overlay">
						<h1>The Enneagram and Mental Illness</h1>
						<p>Understanding Each Type's Predispositions</p>
						<p>By DJ Wayne</p>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Introduction -->
			<amp-story-page id="intro" class="brand-gradient">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #4834d4, #8c7ae6);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Important Context</h2>
						<p>The Enneagram is a personality framework—not a diagnostic tool.</p>
						<p>
							Everyone's experience with mental health is unique, and symptoms or challenges can
							vary widely.
						</p>
						<p>This guide is for informational and self-reflection purposes only.</p>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 1 -->
			<amp-story-page id="type1" class="type1-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #6c5ce7, #4834d4);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 1: The Perfectionist</div>
						<div class="type-subtitle">Perfectionism and Obsessive-Compulsive Tendencies</div>
					</div>
					<div class="overlay">
						<p>Type 1s are susceptible to:</p>
						<ul class="type-list">
							<li>Obsessive-Compulsive Disorder (OCD)</li>
							<li>Depressive Personality Disorder</li>
							<li>Eating disorders</li>
							<li>Intense guilt</li>
							<li>Self-destructive behaviors</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 1 Example -->
			<amp-story-page id="type1-example" class="type1-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #6c5ce7, #4834d4);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 1 Unhealthy Spiral</h2>
						<p>Alex, a dedicated teacher, develops obsessive-compulsive tendencies:</p>
						<ul class="type-list">
							<li>Spending excessive hours revising materials</li>
							<li>Experiencing anxiety attacks before classes</li>
							<li>Developing insomnia due to worry about mistakes</li>
							<li>Eventual burnout and consideration of leaving the profession</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 2 -->
			<amp-story-page id="type2" class="type2-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #8c7ae6, #7158e2);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 2: The Helper</div>
						<div class="type-subtitle">Codependency and Emotional Manipulation</div>
					</div>
					<div class="overlay">
						<p>Type 2s are susceptible to:</p>
						<ul class="type-list">
							<li>Histrionic Personality Disorder</li>
							<li>Hypochondriasis</li>
							<li>Coercive behaviors (e.g., stalking)</li>
							<li>Emotional dependency</li>
							<li>Obsessive jealousy</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 2 Example -->
			<amp-story-page id="type2-example" class="type2-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #8c7ae6, #7158e2);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 2 Unhealthy Spiral</h2>
						<p>Emma exhibiting signs of obsessive attachment:</p>
						<ul class="type-list">
							<li>Tries to outdo friends to secure her place as "best friend"</li>
							<li>Obsessing over others' interactions and feeling jealous</li>
							<li>Progresses into stalking to maintain perceived importance</li>
							<li>Relationship deteriorates, leading to isolation and distress</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 3 -->
			<amp-story-page id="type3" class="type3-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #a29bfe, #6c5ce7);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 3: The Achiever</div>
						<div class="type-subtitle">Narcissistic Traits and Imposter Syndrome</div>
					</div>
					<div class="overlay">
						<p>Type 3s are susceptible to:</p>
						<ul class="type-list">
							<li>Narcissistic Personality Disorder</li>
							<li>Hypertension</li>
							<li>Depression</li>
							<li>Narcissistic rage</li>
							<li>Imposter syndrome</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 3 Example -->
			<amp-story-page id="type3-example" class="type3-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #a29bfe, #6c5ce7);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 3 Unhealthy Spiral</h2>
						<p>Sophia, a high-achieving student battling imposter syndrome:</p>
						<ul class="type-list">
							<li>Cheats on tests to maintain top grades</li>
							<li>Feels like a fraud yet believes she "deserves" success</li>
							<li>Becomes hostile toward anyone challenging her intellect</li>
							<li>Develops narcissistic traits and isolates herself socially</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 4 -->
			<amp-story-page id="type4" class="type4-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #e84393, #be185d);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 4: The Individualist</div>
						<div class="type-subtitle">Chronic Depression and Identity Issues</div>
					</div>
					<div class="overlay">
						<p>Type 4s are susceptible to:</p>
						<ul class="type-list">
							<li>Severe depression</li>
							<li>Narcissistic Personality Disorder</li>
							<li>Avoidant Personality Disorder</li>
							<li>Self-destructive behaviors</li>
							<li>Obsessive thoughts about death or morbidity</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 4 Example -->
			<amp-story-page id="type4-example" class="type4-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #e84393, #be185d);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 4 Unhealthy Spiral</h2>
						<p>Isabella, morbid obsessions and identity issues:</p>
						<ul class="type-list">
							<li>Fixates on loss/tragedy and cycles through intense attachment and rejection</li>
							<li>Self-sabotage through distancing from positive influences</li>
							<li>Worsening self-hatred and isolation</li>
							<li>Retreating into fantasies of suffering</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 5 -->
			<amp-story-page id="type5" class="type5-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #74b9ff, #1d4ed8);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 5: The Investigator</div>
						<div class="type-subtitle">Social Isolation and Schizoid Tendencies</div>
					</div>
					<div class="overlay">
						<p>Type 5s are susceptible to:</p>
						<ul class="type-list">
							<li>Schizoid Personality Disorder</li>
							<li>Schizotypal Personality Disorder</li>
							<li>Avoidant Personality Disorder</li>
							<li>Psychotic breaks</li>
							<li>Suicidal tendencies</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 5 Example -->
			<amp-story-page id="type5-example" class="type5-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #74b9ff, #1d4ed8);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 5 Unhealthy Spiral</h2>
						<p>Ethan, a researcher lost in extreme isolation:</p>
						<ul class="type-list">
							<li>Consumed by intellectual pursuits, ignoring self-care</li>
							<li>Increasingly eccentric, refusing help from friends</li>
							<li>Perceptions become distorted, leading to suicidal thoughts</li>
							<li>Complete disconnection from reality</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 6 -->
			<amp-story-page id="type6" class="type6-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #7158e2, #4834d4);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 6: The Loyalist</div>
						<div class="type-subtitle">Anxiety Disorders and Paranoid Thinking</div>
					</div>
					<div class="overlay">
						<p>Type 6s are susceptible to:</p>
						<ul class="type-list">
							<li>Paranoid Personality Disorder</li>
							<li>Dependent Personality Disorder</li>
							<li>Borderline Personality Disorder</li>
							<li>Intense anxiety attacks</li>
							<li>Chronic fear and suspicion</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 6 Example -->
			<amp-story-page id="type6-example" class="type6-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #7158e2, #4834d4);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 6 Unhealthy Spiral</h2>
						<p>Mia, developing extreme paranoia:</p>
						<ul class="type-list">
							<li>Distrusts those around her, believing they could betray her</li>
							<li>Attachments become erratic; suspicion intensifies</li>
							<li>Impulsive defiance and aggression isolate her further</li>
							<li>Emotional instability disrupts both personal and professional life</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 7 -->
			<amp-story-page id="type7" class="type7-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #fdcb6e, #b45309);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 7: The Enthusiast</div>
						<div class="type-subtitle">Manic Behavior and Addiction Struggles</div>
					</div>
					<div class="overlay">
						<p>Type 7s are susceptible to:</p>
						<ul class="type-list">
							<li>Manic-Depressive Disorders (Bipolar)</li>
							<li>Histrionic Personality Disorder</li>
							<li>Substance abuse issues</li>
							<li>Impulsivity and mood swings</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 7 Example -->
			<amp-story-page id="type7-example" class="type7-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #fdcb6e, #b45309);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 7 Unhealthy Spiral</h2>
						<p>Charlotte, exhibiting manic-depressive tendencies:</p>
						<ul class="type-list">
							<li>Compulsive shopping, partying, socializing to outrun anxiety</li>
							<li>Swings between manic highs and depressive lows grow more intense</li>
							<li>Dramatic or attention-seeking behavior escalates with stress</li>
							<li>Addiction or unstable relationships severely impact her well-being</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 8 -->
			<amp-story-page id="type8" class="type8-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #e84393, #6c5ce7);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 8: The Challenger</div>
						<div class="type-subtitle">Anger Management Issues and Antisocial Behavior</div>
					</div>
					<div class="overlay">
						<p>Type 8s are susceptible to:</p>
						<ul class="type-list">
							<li>Antisocial Personality Disorder</li>
							<li>Sadistic behavior</li>
							<li>Social isolation</li>
							<li>Intense rage and aggression</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 8 Example -->
			<amp-story-page id="type8-example" class="type8-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #e84393, #6c5ce7);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 8 Unhealthy Spiral</h2>
						<p>Amelia, displaying antisocial and sadistic tendencies:</p>
						<ul class="type-list">
							<li>Lack of empathy justifies harmful actions</li>
							<li>Violent or criminal acts become her means of asserting power</li>
							<li>Intensifies isolation from society, compounding mental health issues</li>
							<li>Uses dominance to manage vulnerability or fear</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 9 -->
			<amp-story-page id="type9" class="type9-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #00b894, #74b9ff);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="top-overlay">
						<div class="type-title">Type 9: The Peacemaker</div>
						<div class="type-subtitle">Dissociation and Chronic Avoidance</div>
					</div>
					<div class="overlay">
						<p>Type 9s are susceptible to:</p>
						<ul class="type-list">
							<li>Dissociative Disorders</li>
							<li>Dependent Personality Disorder</li>
							<li>Schizoid Personality Disorder</li>
							<li>Severe depersonalization</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Type 9 Example -->
			<amp-story-page id="type9-example" class="type9-color">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #00b894, #74b9ff);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Type 9 Unhealthy Spiral</h2>
						<p>Harper, experiencing extreme dissociation:</p>
						<ul class="type-list">
							<li>Refuses to address personal or emotional issues</li>
							<li>Feels detached from her own body and reality</li>
							<li>Worsening confusion, as each conflict is avoided rather than resolved</li>
							<li>Complete loss of personal agency and identity</li>
						</ul>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Conclusion -->
			<amp-story-page id="conclusion" class="brand-gradient">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #4834d4, #8c7ae6);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Remember</h2>
						<p>
							Understanding the Enneagram's connection to mental health is about awareness, not
							diagnosis.
						</p>
						<p>If you're struggling, seeking professional help is the most important step.</p>
						<p>Self-awareness can transform potential vulnerabilities into strengths.</p>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Call to Action -->
			<amp-story-page id="cta" class="brand-gradient">
				<amp-story-grid-layer template="fill">
					<div style="background: linear-gradient(135deg, #6c5ce7, #4834d4);"></div>
				</amp-story-grid-layer>
				<amp-story-grid-layer template="vertical">
					<div class="centered-box">
						<h2>Continue Your Journey</h2>
						<p>
							Dive deeper into the Enneagram and learn more about how each type responds under
							stress.
						</p>
						<p>
							Engage with our questions or other Enneagram guides to better understand yourself.
						</p>
						<p>
							Embrace self-awareness and reflection to transform potential vulnerabilities into
							strengths.
						</p>
					</div>
				</amp-story-grid-layer>
			</amp-story-page>

			<!-- Bookend (final page) -->
			<amp-story-bookend layout="nodisplay">
				<script type="application/json">
					{
						"bookendVersion": "v1.0",
						"shareProviders": ["facebook", "twitter", "email"],
						"components": [
							{
								"type": "heading",
								"text": "Continue Your Journey"
							},
							{
								"type": "small",
								"title": "Read the Full Article",
								"url": "https://9takes.com/enneagram-corner/enneagram-and-mental-illness",
								"image": "https://9takes.com/blogs/greek-statue-2-sided-mask.webp"
							},
							{
								"type": "small",
								"title": "Enneagram Types in Stress",
								"url": "https://9takes.com/enneagram-corner/enneagram-types-in-stress",
								"image": "https://9takes.com/blogs/default-blog-image.webp"
							},
							{
								"type": "small",
								"title": "Toxic Traits of Each Enneagram Type",
								"url": "https://9takes.com/enneagram-corner/toxic-traits-of-each-enneagram-type",
								"image": "https://9takes.com/blogs/default-blog-image.webp"
							},
							{
								"type": "small",
								"title": "Enneagram Communication Styles",
								"url": "https://9takes.com/enneagram-corner/enneagram-communication-styles",
								"image": "https://9takes.com/blogs/default-blog-image.webp"
							},
							{
								"type": "cta-link",
								"links": [
									{
										"text": "Explore More Enneagram Insights",
										"url": "https://9takes.com/enneagram-corner"
									}
								]
							}
						]
					}
				</script>
			</amp-story-bookend>
		</amp-story>
	</body>
</html>
