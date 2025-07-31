<!-- routes/enneagram-corner/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';

	export let data: PageData;

	const blogSections = [
		{
			id: 'understanding',
			title: 'Understanding the Enneagram',
			type: 'overview',
			linkTitle: 'Understanding the Enneagram'
		},
		{
			id: 'nine-types',
			title: 'The Nine Enneagram Types',
			type: 'nine-types',
			linkTitle: 'Nine Types'
		},
		{
			id: 'personal-development',
			title: 'Using the Enneagram for Personal Development',
			type: 'development',
			linkTitle: 'Personal Development'
		},
		{
			id: 'relationships',
			title: 'Enneagram in Relationships',
			type: 'relationships',
			linkTitle: 'Relationships'
		},
		{
			id: 'workplace',
			title: 'Enneagram in the Workplace',
			type: 'workplace',
			linkTitle: 'Workplace'
		},
		{ id: 'resources', title: 'Enneagram Resources', type: 'resources', linkTitle: 'Resources' },
		{
			id: 'situations',
			title: 'Enneagram Situational Topics',
			type: 'situational',
			linkTitle: 'Situational Topics'
		}
	];

	function formatBlogSlug(title: string) {
		return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	}
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"mainEntity": {
				"@type": "ItemList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Understanding the Enneagram",
						"description": "Explore the basics and fundamentals of the Enneagram system",
						"url": "https://9takes.com/enneagram-corner#understanding"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "The Nine Enneagram Types",
						"description": "Detailed information about each of the nine Enneagram personality types",
						"url": "https://9takes.com/enneagram-corner#nine-types"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Using the Enneagram for Personal Development",
						"description": "Learn how to apply Enneagram insights for personal growth and self-improvement",
						"url": "https://9takes.com/enneagram-corner#personal-development"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Enneagram in Relationships",
						"description": "Understand how Enneagram types interact in various relationships",
						"url": "https://9takes.com/enneagram-corner#relationships"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Enneagram in the Workplace",
						"description": "Discover how Enneagram knowledge can improve workplace dynamics and productivity",
						"url": "https://9takes.com/enneagram-corner#workplace"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Enneagram Resources",
						"description": "Curated collection of Enneagram books, tools, and other resources",
						"url": "https://9takes.com/enneagram-corner#resources"
					},
					{
						"@type": "ListItem",
						"position": 7,
						"name": "Enneagram Situational Topics",
						"description": "Explore how Enneagram types respond in various life situations",
						"url": "https://9takes.com/enneagram-corner#situations"
					}
				]
			},
			"name": "Enneagram Corner: Your Guide to Personal Growth and Understanding",
			"description": "Dive into the Enneagram with this 9takes guide. Explore the nine types, personal development, relationships, workplace dynamics, and more.",
			"url": "https://9takes.com/enneagram-corner",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "https://9takes.com"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Enneagram Corner",
						"item": "https://9takes.com/enneagram-corner"
					}
				]
			}
		}
	</script>
</svelte:head>
<!-- here -->
<BlogPageHead
	data={{
		title: '9takes Enneagram Corner - Explore All Enneagram Topics',
		description:
			'Dive into the Enneagram with 9takes. Explore the nine types, personal development, relationships, workplace dynamics, and more. Your comprehensive guide to understanding and applying the Enneagram.'
	}}
	slug={'enneagram-corner'}
/>

<main>
	<h1>Enneagram Corner: Your Guide to Personal Growth and Understanding</h1>
	
	<div class="authority-section">
		<p class="intro-text">
			The Enneagram is a powerful personality framework backed by decades of psychological research and practice. 
			Our content draws from authoritative sources including the <strong>Enneagram Institute</strong>, 
			works by <strong>Don Richard Riso</strong> and <strong>Russ Hudson</strong>, and contemporary research in personality psychology.
		</p>
		
	</div>

	<nav aria-label="Table of Contents">
		<h2>Explore Enneagram Topics</h2>
		<ul>
			{#each blogSections as section}
				<li><a href="#{section.id}">{section.title}</a></li>
			{/each}
		</ul>
	</nav>

	{#each blogSections as section}
		<section aria-labelledby={section.id}>
			<h2 id={section.id}>{section.title}</h2>
			<div class="blog-grid-container" class:nine-types={section.type === 'nine-types'}>
				{#each data.enneagramBlogs
					.filter((blog) => blog.type[0] === section.type)
					.slice(0, section.type === 'nine-types' ? 9 : 3) as blog (blog.slug)}
					<article class="grid-item">
						<a
							href="/enneagram-corner/{blog.slug}"
							class="blog-link"
							data-tag={`h-blog-${formatBlogSlug(blog.title)}`}
						>
							<div
								class="grid-item-content"
								style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}
							>
								<div class="text-overlay">
									<h3
										style="padding: 2rem 0 0rem;"
										style:--tag={`h-blog-${blog.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
									>
										{blog.title}
									</h3>
									<p style="margin-top: .3rem;">{blog.description}</p>
								</div>
							</div>
						</a>
					</article>
				{/each}
				{#if section.type !== 'nine-types'}
					<div class="grid-item view-all">
						<a href="/enneagram-corner/subtopic/{section.type}" class="blog-link">
							<div class="grid-item-content">
								<div class="text-overlay">
									<h3>
										All {section.linkTitle} Articles
										<ArrowRightIcon
											iconStyle={'margin-left: .5rem'}
											height={'1.5rem'}
											fill={'var(--accent)'}
										/>
									</h3>
								</div>
							</div>
						</a>
					</div>
				{/if}
			</div>
		</section>
	{/each}
</main>

<div class="resources-footer">
	<h2>Authoritative Enneagram Resources</h2>
	<p>Our content is informed by these respected sources in the Enneagram community:</p>
	<ul class="resources-list">
		<li>
			<strong>The Enneagram Institute</strong> - Founded by Don Richard Riso and Russ Hudson, 
			offering the most comprehensive Enneagram type descriptions and growth paths.
		</li>
		<li>
			<strong>The Wisdom of the Enneagram</strong> by Riso & Hudson - 
			The definitive guide to psychological and spiritual growth for the nine personality types.
		</li>
		<li>
			<strong>Helen Palmer's Work</strong> - 
			Pioneer in bringing the Enneagram to modern psychology and business applications.
		</li>
		<li>
			<strong>Beatrice Chestnut</strong> - 
			Leading expert on Enneagram subtypes and instinctual variants.
		</li>
		<li>
			<strong>International Enneagram Association (IEA)</strong> - 
			The global organization promoting accuracy, ethics, and excellence in Enneagram education.
		</li>
	</ul>
	<p class="citation-note">
		<em>All our content aims to present Enneagram insights accurately while making them accessible 
		for personal growth and improved relationships.</em>
	</p>
</div>

<style lang="scss">
	.authority-section {
		background-color: #f8f9fa;
		border-radius: 8px;
		padding: 2rem;
		margin: 2rem 0;
		border-left: 4px solid var(--primary);
		
		.intro-text {
			font-size: 1.1rem;
			line-height: 1.6;
			margin-bottom: 1.5rem;
			color: #333;
		}
		
		.credibility-badges {
			display: flex;
			flex-wrap: wrap;
			gap: 1.5rem;
			
			.badge-item {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin: 0;
				
				.badge-icon {
					font-size: 1.5rem;
				}
			}
		}
	}
	
	.resources-footer {
		background-color: #f0f4f8;
		padding: 3rem;
		margin-top: 4rem;
		border-radius: 12px;
		
		h2 {
			color: var(--primary);
			margin-bottom: 1rem;
		}
		
		.resources-list {
			list-style: none;
			padding: 0;
			margin: 1.5rem 0;
			
			li {
				padding: 1rem;
				margin-bottom: 1rem;
				background: white;
				border-radius: 8px;
				border-left: 3px solid var(--primary);
				
				strong {
					color: var(--primary);
				}
			}
		}
		
		.citation-note {
			margin-top: 1.5rem;
			padding: 1rem;
			background: rgba(108, 92, 231, 0.1);
			border-radius: 8px;
			text-align: center;
		}
	}

	nav {
		margin-bottom: 3rem;

		h2 {
			font-size: 1.5rem;
			margin-bottom: 1rem;
		}

		ul {
			list-style-type: none;
			padding: 0;
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		a {
			color: var(--text-color);
			text-decoration: none;
			padding: 0.5rem;
			border-radius: var(--base-border-radius);
			background-color: var(--card-bg-color);
			transition: background-color 0.3s ease;

			&:hover,
			&:focus {
				background-color: var(--primary-light);
			}
		}
	}

	section {
		margin-bottom: 3rem;

		h2 {
			font-size: 2rem;
			margin-bottom: 1rem;
		}
	}

	.blog-grid-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;

		&.nine-types {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.grid-item {
		aspect-ratio: 1 / 1;
		padding: 0;
		overflow: hidden;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		}
	}

	.blog-link {
		display: block;
		text-decoration: none;
		color: inherit;
		height: 100%;
	}

	.grid-item-content {
		height: 100%;
		background-size: cover;
		background-position: center;
		position: relative;
	}

	.text-overlay {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.6);
		color: var(--accent);
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	h3 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	p {
		font-size: 0.8rem;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.view-all {
		margin-top: 0.5rem;
		padding: 0;
		border-radius: var(--base-border-radius);
		.grid-item-content {
			background-color: var(--primary-light);
		}

		.text-overlay {
			background-color: rgba(0, 0, 0, 0.3);
			justify-content: center;
			align-items: center;
			text-align: center;
		}

		h3 {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 1024px) {
		.blog-grid-container {
			grid-template-columns: repeat(4, 1fr);

			&.nine-types {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		h3 {
			font-size: 1.2rem;
		}

		p {
			font-size: 0.9rem;
			-webkit-line-clamp: 3;
		}
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		section h2 {
			font-size: 1.5rem;
		}

		.blog-grid-container,
		.blog-grid-container.nine-types {
			grid-template-columns: repeat(2, 1fr);
		}

		h3 {
			font-size: 1rem;
		}

		p {
			font-size: 0.8rem;
			-webkit-line-clamp: 2;
		}
	}

	@media (max-width: 480px) {
		.blog-grid-container,
		.blog-grid-container.nine-types {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
