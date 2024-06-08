<!-- <section class="blog" itemprop="articleBody"> -->
<slot />

<!-- </section> -->
<style lang="scss">
	@import '../../../scss/index.scss';
	// @import '../../routes/styles.css';

	@import '../../../routes/styles.css';

	.section-content {
		/*border-right: 4px solid slategrey;*/
		margin: 1rem 0;
		padding: 1rem;
		transition: transform 0.7s ease-in-out;
		flex: 1;
		border: 1px solid grey;
	}

	@media all and (max-width: 576px) {
		.section-content {
			/*border-right: 4px solid slategrey;*/
			margin: 10px;
			padding: 10px;
			/*transition: transform .7s ease-in-out;*/
			/*flex: 1;*/
		}
	}
</style>
