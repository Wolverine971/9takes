<!-- src/lib/amp-stories/EnneagramMentalIllnessPromo.svelte -->
<script>
	export let title = 'Explore as Web Story';
	export let subtitle = 'View an interactive version of this article';
	export let ampUrl = '/stories/enneagram-and-mental-illness';
	export let imageUrl = 'https://9takes.com/blogs/greek-statue-2-sided-mask.webp';
	export let altText = 'Enneagram and Mental Illness Web Story';
</script>

<a
	href={ampUrl}
	class="group my-8 block w-full overflow-hidden rounded-lg border border-primary-200 bg-primary-50 shadow-sm transition-all duration-300 hover:shadow-md"
>
	<div class="flex flex-col items-center md:flex-row">
		<div class="relative w-full md:w-1/3">
			<div class="relative aspect-[3/4] overflow-hidden">
				<img
					src={imageUrl}
					alt={altText}
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
			</div>
			<div class="absolute bottom-4 left-4 z-10">
				<div class="flex items-center space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span class="font-medium text-white">Web Story</span>
				</div>
			</div>
		</div>

		<div class="w-full p-6 md:w-2/3">
			<h3 class="mb-2 text-xl font-bold text-primary-800 md:text-2xl">{title}</h3>
			<p class="mb-4 text-neutral-600">{subtitle}</p>

			<div class="flex items-center space-x-4">
				<span
					class="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
						/>
					</svg>
					Mobile-optimized
				</span>
				<span
					class="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					Fast loading
				</span>
			</div>

			<div class="mt-4 flex justify-end">
				<div
					class="inline-flex items-center font-medium text-primary-700 group-hover:text-primary-900"
				>
					View Web Story
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</a>
