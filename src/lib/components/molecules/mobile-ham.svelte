<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	import { page } from '$app/stores';
	import Context, { onClickOutside } from './Context.svelte';

	let active = false;
	let dropdownActive = false;
</script>

<div style="position: relative; z-index: 11;">
	{#if !active}
		<button
			class="hamburger flex-center menu-trigger"
			aria-label="Toggle navigation"
			on:click={() => {
				getModal('mobile-nav').open();
			}}
		>
			<i class="menu-trigger-bar top" />
			<i class="menu-trigger-bar middle" />
			<i class="menu-trigger-bar bottom" />
			<!-- </span> -->
		</button>
	{:else}
		<button
			class="hamburger flex-center close-trigger "
			aria-label="Toggle navigation"
			on:click={() => {
				getModal('mobile-nav').close();
			}}
		>
			<i class="close-trigger-bar left" />
			<i class="close-trigger-bar right" />

			<!-- </span> -->
		</button>
	{/if}

	<Modal2 id="mobile-nav">
		<nav class="mobile-nav">
			<ul class="menu">
				<li><a href="/" class={$page.url.pathname === '/' ? 'active-link' : ''}>Home</a></li>
				<li>
					<a
						href={'/questions'}
						class={$page.url.pathname.startsWith('/questions') ? 'active-link' : ''}>Questions</a
					>
				</li>
				<li>
					<button
						title="see blogs"
						type="button"
						on:click={() => {
							dropdownActive = !dropdownActive;
						}}
						class="blog-dropdown {dropdownActive ? 'is-active' : ''}"
					>
						<div class="nav-element {$page.url.pathname === '/blog' ? 'active-link' : ''}" style="">
							Blogs
						</div>

						<ul class="">
							<li>
								<a href="/blog/community" class="a-wrap">
									<div
										class=" {$page.url.pathname === '/blog/community' ? 'active-link' : ''}"
										style=""
									>
										9takes Inspiration
									</div>
								</a>
							</li>
							<li>
								<a href="/blog/enneagram" class="a-wrap">
									<div
										class={$page.url.pathname === '/blog/enneagram' ? 'active-link' : ''}
										style=""
									>
										Enneagram Blogs
									</div>
								</a>
							</li>
							<li>
								<a href="/blog/famous-enneagram-types" class="a-wrap">
									<div
										class={$page.url.pathname === '/blog/famous-enneagram-types'
											? 'active-link'
											: ''}
										style=""
									>
										Famous Enneagram Types
									</div>
								</a>
							</li>

							<li>
								<a href="/blog/guides" class="a-wrap">
									<div class={$page.url.pathname === '/blog/guides' ? 'active-link' : ''} style="">
										Guides
									</div>
								</a>
							</li>
						</ul>
					</button>
				</li>
				<li>
					<a href="/about" class={$page.url.pathname === '/about' ? 'active-link' : ''}>About</a>
				</li>
			</ul>
		</nav>
	</Modal2>
</div>

<style lang="scss">
	$hover: all 0.2s ease-in;
	$slide: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
	$slide-delay: all 0.4s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
	$slide-slow: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

	@mixin css3-prefix($property, $value) {
		-webkit-#{$property}: #{$value};
		-khtml-#{$property}: #{$value};
		-moz-#{$property}: #{$value};
		-ms-#{$property}: #{$value};
		-o-#{$property}: #{$value};
		#{$property}: #{$value};
	}
	// TRANSFORM
	@mixin transform($params) {
		@include css3-prefix('transform', $params);
	}
	/* Add your CSS styles here */
	.hamburger {
		margin: 1rem;
		width: 50px;
		height: 50px;
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: transform 0.3s ease;
	}

	.hamburger-line {
		width: 24px;
		height: 2px;
		background-color: #000;
		margin-bottom: 4px;
		transition: background-color 0.3s ease;
	}

	.menu {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.menu li {
		margin-bottom: 10px;
	}

	.menu a {
		// text-decoration: none;
		// color: #000;
		font-size: 2rem;
		line-height: 1.5;
	}

	/* .hamburger.active .hamburger-line {
  background-color: #fff;
} */

	.mobile-nav.active {
		display: -webkit-box;
	}

	.menu-trigger-bar {
		display: block;
		width: 100%;
		height: 4px;
		background-color: var(--color-paladin-3);
		margin-bottom: 6px;
		transform: rotate(-45deg);
		position: relative;
		transition: $slide;

		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 0%;
			height: 100%;
			background-color: var(--color-paladin-3);
			transition: $slide;
		}

		&.top {
			width: 50%;
			align-self: flex-start;
		}
		&.middle {
			// &:before {
			// left: auto;
			// right: 0;
			align-self: center;
			// }
		}
		&.bottom {
			width: 50%;
			// margin-left: 50%;
			align-self: flex-end;
		}
	}

	.menu-trigger,
	.close-trigger {
		// position: absolute;
		// top: 32px;
		// right: 20px;
		// display: block;
		width: 42px;
		height: 42px;
		cursor: pointer;
		z-index: 333;

		&:hover {
			.menu-trigger-bar {
				&:before {
					width: 100%;
				}
			}

			.close-trigger-bar {
				&:before {
					width: 100%;
				}
			}
		}
	}

	.close-trigger-bar {
		display: block;
		width: 100%;
		height: 4px;
		background-color: var(--color-paladin-3);
		position: relative;
		transition: $slide;

		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 0%;
			height: 100%;
			background-color: var(--color-paladin-3);
			transition: $slide;
		}

		&.left {
			transform: rotate(-45deg);
		}
		&.right {
			transform: rotate(45deg);
			top: -3px;
		}
	}

	.blog-dropdown {
		margin: 0;
		padding: 0;
		cursor: pointer;
		position: relative;
		text-decoration: none;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		font-size: 2rem;
		line-height: 1.5;
		color: var(--color-theme-purple);
		height: auto;
		border: none;
		// transition: all 1.2s ease-in-out;

		ul {
			position: relative;
			padding-left: 0.5rem;
			max-height: 0;
			transform: scaleY(0);
			transform-origin: top;
			transition: transform 0.3s ease;

			li {
				list-style-type: none;
				a {
					text-decoration: none;
					font-size: 1.7rem;
					line-height: 1;
				}
			}
		}
	}
	.blog-dropdown:after {
		transition: none;
		box-shadow: none;
	}

	.blog-dropdown.is-active {
		ul {
			// visibility: visible;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			height: auto !important;
			max-height: none;
			flex: 1;
			transform: scaleY(1);
		}
	}
</style>
