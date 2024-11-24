<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { page } from '$app/stores';
	import Context, { onClickOutside } from './Context.svelte';

	let isMenuOpen = false;
	let isDropdownOpen = false;

	// Close the menu when navigating to a new page
	$: $page.url && (isMenuOpen = false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		const modal = getModal('mobile-nav');
		if (isMenuOpen) {
			modal.open();
		} else {
			modal.close();
		}
	}

	function closeMenu() {
		isMenuOpen = false;
		getModal('mobile-nav').close();
	}

	// Handle modal close events (including clicking outside)
	function handleModalClose() {
		isMenuOpen = false;
		closeMenu();
	}
</script>

<div class="mobile-header">
	<button
		class="hamburger"
		aria-label="Toggle navigation"
		on:click={toggleMenu}
		aria-expanded={isMenuOpen}
	>
		{#if !isMenuOpen}
			<span class="hamburger-lines">
				<span class="line"></span>
				<span class="line"></span>
				<span class="line"></span>
			</span>
		{:else}
			<span class="close-icon">&times;</span>
		{/if}
	</button>
</div>

<Modal2 id="mobile-nav" on:close={handleModalClose}>
	<Context>
		<nav
			class="mobile-nav"
			aria-label="Main Navigation"
			use:onClickOutside={() => {
				isMenuOpen = false;
			}}
		>
			<ul class="menu">
				<li>
					<a href="/" class:active-link={$page.url.pathname === '/'}>Home</a>
				</li>
				<li>
					<a href="/questions" class:active-link={$page.url.pathname.startsWith('/questions')}>
						Question List
					</a>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-button"
						aria-haspopup="true"
						aria-expanded={isDropdownOpen}
						on:click={() => (isDropdownOpen = !isDropdownOpen)}
					>
						Blogs
					</button>
					{#if isDropdownOpen}
						<ul class="dropdown-menu">
							<li>
								<a href="/community" class:active-link={$page.url.pathname === '/community'}>
									The Takes of 9takes
								</a>
							</li>
							<li>
								<a
									href="/enneagram-corner"
									class:active-link={$page.url.pathname === '/enneagram-corner'}
								>
									Enneagram Corner
								</a>
							</li>
							<li>
								<a
									href="/personality-analysis"
									class:active-link={$page.url.pathname === '/personality-analysis'}
								>
									Personality Analysis
								</a>
							</li>
							<li>
								<a
									href="/how-to-guides"
									class:active-link={$page.url.pathname === '/how-to-guides'}
								>
									How to Guides
								</a>
							</li>
						</ul>
					{/if}
				</li>
				<li>
					<a href="/about" class:active-link={$page.url.pathname === '/about'}>About</a>
				</li>
			</ul>
		</nav>
	</Context>
</Modal2>

<style lang="scss">
	.mobile-header {
		position: relative;
		z-index: 11;

		.hamburger {
			background: none;
			border: none;
			cursor: pointer;
			padding: 1rem;
			display: flex;
			align-items: center;
			transition: opacity 0.2s ease;
			height: 18px;
			width: 25px;

			&:focus {
				outline: none;
			}

			.hamburger-lines {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 18px;
				width: 25px;

				.line {
					width: 25px;
					height: 2px;
					background-color: #333;
					transition: transform 0.2s ease;
				}
			}

			.close-icon {
				font-size: 2rem;
				line-height: 1;
				color: #333;
				transition: transform 0.2s ease;
			}
		}
	}

	.mobile-nav {
		padding: 2rem 1rem;

		.menu {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				margin-bottom: 1rem;

				a,
				.dropdown-button {
					font-size: 1.5rem;
					text-decoration: none;
					color: #333;
					background: none;
					border: none;
					padding: 0;
					cursor: pointer;
					text-align: left;

					&:hover,
					&.active-link {
						color: #833bff;
					}
				}

				.dropdown-button {
					display: flex;
					align-items: center;

					&:after {
						content: '';
						margin-left: auto;
						width: 0;
						height: 0;
						border-left: 5px solid transparent;
						border-right: 5px solid transparent;
						border-top: 5px solid #333;
						transition: transform 0.3s;
					}

					&[aria-expanded='true']:after {
						transform: rotate(180deg);
					}
				}

				.dropdown-menu {
					list-style: none;
					padding-left: 1rem;
					margin-top: 0.5rem;

					li {
						margin-bottom: 0.5rem;

						a {
							font-size: 1.3rem;
							color: #555;

							&:hover,
							&.active-link {
								color: #833bff;
							}
						}
					}
				}
			}
		}
	}

	/* Modal styles */
	:global(.modal) {
		background-color: rgba(0, 0, 0, 0.5);

		.modal-content {
			max-width: 400px;
			margin: 0 auto;
			background: #fff;
			border-radius: 8px;
			overflow-y: auto;
			max-height: 90vh;
		}
	}
</style>
