<script lang="ts">
    import type { PageData } from './$types';
    import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
    import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
    
    export let data: PageData;
    let innerWidth = 0;

    const blogSections = [
        { id: 'understanding', title: 'Understanding the Enneagram', type: 'overview', linkTitle: 'Understanding the Enneagram' },
        { id: 'personal-development', title: 'Using the Enneagram for Personal Development', type: 'development', linkTitle: 'Personal Development' },
        { id: 'relationships', title: 'Enneagram in Relationships', type: 'relationships', linkTitle: 'Relationships' },
        { id: 'workplace', title: 'Enneagram in the Workplace', type: 'workplace', linkTitle: 'Workplace' },
        { id: 'resources', title: 'Enneagram Resources', type: 'resources',    linkTitle: 'Resources' },
        { id: 'situations', title: 'Enneagram Situational Topics', type: 'situational', linkTitle: 'Situational Topics' },
        // { id: 'subtypes', title: 'Enneagram Subtypes', type: 'subtypes', linkTitle: 'Subtypes' },
        // { id: 'enneagram-wings', title: 'Enneagram Wings', type: 'wings', linkTitle: 'Wings' },
        // { id: 'enneagram-triads', title: 'Enneagram Triads', type: 'triads', linkTitle: 'Triads' },
        // { id: 'enneagram-centers', title: 'Enneagram Centers', type: 'centers', linkTitle: 'Centers' },
        // { id: 'enneagram-variants', title: 'Enneagram Variants', type: 'variants', linkTitle: 'Variants' },
        // { id: 'enneagram-stress', title: 'Enneagram Stress and Security', type: 'stress', linkTitle: 'Stress and Security' },
        // { id: 'enneagram-children', title: 'Enneagram and Children', type: 'children', linkTitle: 'Children' },
        // { id: 'enneagram-animals', title: 'Enneagram and Animals', type: 'animals', linkTitle: 'Animals' },
        // { id: 'enneagram-creativity', title: 'Enneagram and Creativity', type: 'creativity', linkTitle: 'Creativity' },
        // { id: 'enneagram-philosophy', title: 'Enneagram and Philosophy', type: 'philosophy', linkTitle: 'Philosophy' },
        // { id: 'enneagram-spirituality', title: 'Enneagram and Spirituality', type: 'spirituality', linkTitle: 'Spirituality' },
        // { id: 'enneagram-music', title: 'Enneagram and Music', type: 'music', linkTitle: 'Music' },
        // { id: 'enneagram-movies', title: 'Enneagram and Movies', type: 'movies', linkTitle: 'Movies' },
        // { id: 'enneagram-books', title: 'Enneagram and Books', type: 'books', linkTitle: 'Books' },
        // { id: 'enneagram-quotes', title: 'Enneagram Quotes', type: 'quotes', linkTitle: 'Quotes' },
    ];

    function formatBlogSlug(title: string) {
        return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    }
</script>

<svelte:window bind:innerWidth />

<BlogPageHead
    data={{
        title: '9takes Enneagram Corner',
        description: 'Topics related to the Enneagram including the nine types, personal development, relationships, and more.'
    }}
    slug={'enneagram-corner'}
/>

<h1 id="enneagram">Enneagram Corner</h1>

<details open>
    <summary class="accordion">Table of Contents</summary>
    <ul>
        <li><a href="#understanding">Learning the Enneagram</a></li>
        <li><a href="#9types">The Nine Enneagram Types</a></li>
        {#each blogSections.slice(1) as section}
            <li><a href="#{section.id}">{section.title}</a></li>
        {/each}
    </ul>
</details>

<!-- Understanding the Enneagram Section -->
<h2 id="understanding">Learning the Enneagram</h2>
<div class="blog-grid-container">
    {#each data.enneagramBlogs.filter(blog => blog.type[0] === 'overview') as blog}
        <a href="/enneagram-corner/{blog.slug}" class="grid-item" style:--tag={`h-blog-${formatBlogSlug(blog.title)}`}>
            <div class="grid-item-content" style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}>
                <div class="text-overlay">
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                </div>
            </div>
        </a>
    {/each}
    <a href="/enneagram-corner/subtopic/overview" class="grid-item view-all">
        <div class="grid-item-content">
            <div class="text-overlay">
                <h3>
                    All Enneagram topics
                    <ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'var(--accent)'} />
                </h3>
            </div>
        </div>
    </a>
</div>

<!-- The Nine Enneagram Types Section -->
<h2 id="9types">The Nine Enneagram Types</h2>
<div class="blog-grid-container nine-types">
    {#each data.enneagramBlogs.filter(blog => blog.type[0] === 'nine-types') as blog}
        <a href="/enneagram-corner/{blog.slug}" class="grid-item" style:--tag={`h-blog-${formatBlogSlug(blog.title)}`}>
            <div class="grid-item-content" style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}>
                <div class="text-overlay">
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                </div>
            </div>
        </a>
    {/each}
</div>

<!-- Other Sections -->
{#each blogSections.slice(1) as section}
    <h2 id={section.id}>{section.title}</h2>
    <div class="blog-grid-container">
        {#each data.enneagramBlogs.filter(blog => blog.type[0] === section.type) as blog}
            <a href="/enneagram-corner/{blog.slug}" class="grid-item" style:--tag={`h-blog-${formatBlogSlug(blog.title)}`}>
                <div class="grid-item-content" style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}>
                    <div class="text-overlay">
                        <h3>{blog.title}</h3>
                        <p>{blog.description}</p>
                    </div>
                </div>
            </a>
        {/each}
        <a href="/enneagram-corner/subtopic/{section.type}" class="grid-item view-all">
            <div class="grid-item-content">
                <div class="text-overlay">
                    <h3>
                        All {section.linkTitle.toLowerCase().replace('enneagram', 'Enneagram')} blogs
                        <ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'var(--accent)'} />
                    </h3>
                </div>
            </div>
        </a>
    </div>
{/each}

<style lang="scss">
    h2 {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .blog-grid-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;

        &.nine-types {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .grid-item {
        text-decoration: none;
        color: inherit;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: var(--base-border-radius);
        overflow: hidden;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
    }

    .grid-item-content {
        height: 100%;
        min-height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
    }

    .text-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        color: var(--accent);
        padding: 1rem;
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
        font-size: 0.9rem;
        line-height: 1.4;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .view-all {
        grid-column: 4;
        .grid-item-content {
            background-color: var(--color-theme-purple-light);
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
            font-size: 1rem;
        }
    }

    @media (max-width: 1024px) {
        .blog-grid-container {
            grid-template-columns: repeat(3, 1fr);
        }

        .view-all {
            grid-column: 3;
        }
    }

    @media (max-width: 768px) {
        .blog-grid-container {
            grid-template-columns: repeat(2, 1fr);

            &.nine-types {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .view-all {
            grid-column: 2;
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
        .blog-grid-container, .blog-grid-container.nine-types {
            grid-template-columns: 1fr;
        }

        .view-all {
            grid-column: 1;
        }
    }
</style>