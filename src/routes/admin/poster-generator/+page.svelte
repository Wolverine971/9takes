<!-- routes/admin/poster-generator/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { fade } from 'svelte/transition';

	// State for the poster
	let question = 'Who do you look up to and why?';
	let questionUrl = 'https://9takes.com/question-of-the-day';
	let qrCodeData = '';
	let activeTab = 'content';
	let exporting = false;
	let posterRef;
	let toPng: any;
	let jsPDF: any;

	// Poster format settings
	let posterFormat = 'letter';
	const posterFormats = [
		{
			id: 'letter',
			name: 'Letter (8.5" x 11")',
			width: '8.5in',
			height: '11in',
			pdfWidth: 8.5,
			pdfHeight: 11,
			unit: 'in'
		},
		{
			id: 'a4',
			name: 'A4 (210mm x 297mm)',
			width: '210mm',
			height: '297mm',
			pdfWidth: 210,
			pdfHeight: 297,
			unit: 'mm'
		},
		{
			id: 'square',
			name: 'Square (8" x 8")',
			width: '8in',
			height: '8in',
			pdfWidth: 8,
			pdfHeight: 8,
			unit: 'in'
		},
		{
			id: 'instagram',
			name: 'Instagram Post',
			width: '1080px',
			height: '1080px',
			pdfWidth: 8,
			pdfHeight: 8,
			unit: 'in'
		}
	];

	// Active settings
	let activeTheme = 'classic';
	let activeBackground = 'geometric';
	let showGrid = false;

	// Theme settings
	const themes = [
		{
			id: 'classic',
			name: 'Classic',
			headerSettings: {
				text: '9takes',
				fontSize: 'text-3xl',
				fontWeight: 'font-bold',
				color: 'text-white',
				textShadow: true,
				fontFamily: 'font-serif',
				position: 'top',
				logoSize: 'large'
			},
			questionSettings: {
				fontSize: 'text-3xl',
				fontWeight: 'font-bold',
				color: 'text-white',
				textShadow: true,
				fontFamily: 'font-serif',
				bgColor: 'bg-neutral-900',
				bgOpacity: 60
			},
			footerSettings: {
				textPrimary: 'Share your perspective',
				textSecondary: '9takes.com',
				fontSize: 'text-lg',
				fontWeight: 'font-medium',
				color: 'text-white',
				textShadow: true,
				bgOpacity: 90,
				qrLabel: 'Scan to answer:'
			},
			backgroundSettings: {
				opacity: 70,
				gradient: true,
				gradientColors: {
					top: '#1a1a2e',
					middle: '#6c5ce7',
					bottom: '#ffffff'
				},
				dithering: true,
				ditheringIntensity: 30
			}
		},
		{
			id: 'minimal',
			name: 'Minimal Light',
			headerSettings: {
				text: '9takes',
				fontSize: 'text-2xl',
				fontWeight: 'font-medium',
				color: 'text-neutral-900',
				textShadow: false,
				fontFamily: 'font-sans',
				position: 'top',
				logoSize: 'medium'
			},
			questionSettings: {
				fontSize: 'text-3xl',
				fontWeight: 'font-medium',
				color: 'text-neutral-900',
				textShadow: false,
				fontFamily: 'font-sans',
				bgColor: 'bg-white',
				bgOpacity: 30
			},
			footerSettings: {
				textPrimary: 'Share your perspective',
				textSecondary: '9takes.com',
				fontSize: 'text-lg',
				fontWeight: 'font-medium',
				color: 'text-neutral-900',
				textShadow: false,
				bgOpacity: 70,
				qrLabel: 'Scan to answer:'
			},
			backgroundSettings: {
				opacity: 30,
				gradient: false,
				gradientColors: {
					top: '#ffffff',
					middle: '#f0f0f0',
					bottom: '#e0e0e0'
				},
				dithering: false,
				ditheringIntensity: 10
			}
		},
		{
			id: 'bold',
			name: 'Bold Impact',
			headerSettings: {
				text: '9takes',
				fontSize: 'text-4xl',
				fontWeight: 'font-extrabold',
				color: 'text-white',
				textShadow: true,
				fontFamily: 'font-sans',
				position: 'center',
				logoSize: 'large'
			},
			questionSettings: {
				fontSize: 'text-4xl',
				fontWeight: 'font-extrabold',
				color: 'text-white',
				textShadow: true,
				fontFamily: 'font-sans',
				bgColor: 'bg-neutral-900',
				bgOpacity: 80
			},
			footerSettings: {
				textPrimary: 'Share your perspective',
				textSecondary: '9takes.com',
				fontSize: 'text-xl',
				fontWeight: 'font-bold',
				color: 'text-white',
				textShadow: true,
				bgOpacity: 90,
				qrLabel: 'Scan to answer:'
			},
			backgroundSettings: {
				opacity: 80,
				gradient: true,
				gradientColors: {
					top: '#000000',
					middle: '#6c5ce7',
					bottom: '#333333'
				},
				dithering: true,
				ditheringIntensity: 50
			}
		},
		{
			id: 'modern',
			name: 'Modern Clean',
			headerSettings: {
				text: '9takes',
				fontSize: 'text-3xl',
				fontWeight: 'font-bold',
				color: 'text-white',
				textShadow: true,
				fontFamily: 'font-sans',
				position: 'top',
				logoSize: 'large'
			},
			questionSettings: {
				fontSize: 'text-4xl',
				fontWeight: 'font-bold',
				color: 'text-white',
				textShadow: true,
				fontFamily: 'font-sans',
				bgColor: 'bg-neutral-900',
				bgOpacity: 40
			},
			footerSettings: {
				textPrimary: 'Share your perspective',
				textSecondary: '9takes.com',
				fontSize: 'text-lg',
				fontWeight: 'font-medium',
				color: 'text-white',
				textShadow: true,
				bgOpacity: 90,
				qrLabel: 'Scan to answer:'
			},
			backgroundSettings: {
				opacity: 90,
				gradient: true,
				gradientColors: {
					top: '#1a1a2e',
					middle: '#4a4799',
					bottom: '#6c5ce7'
				},
				dithering: true,
				ditheringIntensity: 20
			}
		}
	];

	// Background options
	const backgrounds = [
		{ id: 'geometric', path: '/backgrounds/geometric.jpg', name: 'Geometric' },
		{ id: 'purple_gradient', path: '/backgrounds/purple-gradient.jpg', name: 'Purple Gradient' },
		{ id: 'blue_abstract', path: '/backgrounds/blue-abstract.jpg', name: 'Blue Abstract' },
		{ id: 'minimal', path: '/backgrounds/minimal.jpg', name: 'Minimal' },
		{ id: 'greek_pantheon', path: '/greek_pantheon.png', name: 'Greek Pantheon' },
		{ id: 'philosopher_gathering', path: '/philosopher-gathering.png', name: 'Philosophers' },
		{ id: 'acropolis', path: '/acrop.png', name: 'Acropolis' }
	];

	// Font options
	const fontSizes = [
		{ id: 'text-xl', name: 'Small' },
		{ id: 'text-2xl', name: 'Medium' },
		{ id: 'text-3xl', name: 'Large' },
		{ id: 'text-4xl', name: 'Extra Large' },
		{ id: 'text-5xl', name: 'Huge' }
	];

	const fontWeights = [
		{ id: 'font-normal', name: 'Normal' },
		{ id: 'font-medium', name: 'Medium' },
		{ id: 'font-semibold', name: 'Semi-Bold' },
		{ id: 'font-bold', name: 'Bold' },
		{ id: 'font-extrabold', name: 'Extra Bold' }
	];

	const fontFamilies = [
		{ id: 'font-serif', name: 'Serif' },
		{ id: 'font-sans', name: 'Sans-serif' },
		{ id: 'font-mono', name: 'Monospace' }
	];

	const textColors = [
		{ id: 'text-white', name: 'White' },
		{ id: 'text-primary-100', name: 'Light Purple' },
		{ id: 'text-primary-700', name: 'Purple' },
		{ id: 'text-neutral-900', name: 'Black' }
	];

	const bgColors = [
		{ id: 'bg-neutral-900', name: 'Dark' },
		{ id: 'bg-primary-900', name: 'Purple' },
		{ id: 'bg-white', name: 'White' },
		{ id: 'bg-primary-100', name: 'Light Purple' }
	];

	const logoSizes = [
		{ id: 'small', name: 'Small', class: 'h-10' },
		{ id: 'medium', name: 'Medium', class: 'h-16' },
		{ id: 'large', name: 'Large', class: 'h-20' },
		{ id: 'none', name: 'No Logo', class: 'hidden' }
	];

	const headerPositions = [
		{ id: 'top', name: 'Top of Poster' },
		{ id: 'center', name: 'With Question' },
		{ id: 'none', name: 'No Header' }
	];

	// Current settings (initialized from active theme)
	let headerSettings = { ...themes[0].headerSettings };
	let questionSettings = { ...themes[0].questionSettings };
	let footerSettings = { ...themes[0].footerSettings };
	let backgroundSettings = { ...themes[0].backgroundSettings };

	// Get current logo size class
	$: currentLogoSize = logoSizes.find((s) => s.id === headerSettings.logoSize)?.class || 'h-16';

	// Get current poster format
	$: currentFormat = posterFormats.find((f) => f.id === posterFormat) || posterFormats[0];

	// Get current background
	$: currentBackground = backgrounds.find((bg) => bg.id === activeBackground) || backgrounds[0];

	// Calculate background style based on settings
	$: backgroundStyle = backgroundSettings.gradient
		? `background-image: url(${currentBackground.path}), linear-gradient(to bottom, 
			${backgroundSettings.gradientColors.top}, 
			${backgroundSettings.gradientColors.middle}, 
			${backgroundSettings.gradientColors.bottom}); 
			background-blend-mode: overlay; 
			opacity: ${backgroundSettings.opacity / 100}`
		: `background-image: url(${currentBackground.path}); 
			opacity: ${backgroundSettings.opacity / 100}`;

	// Calculate dithering effect
	$: ditheringStyle = backgroundSettings.dithering
		? `background-image: repeating-conic-gradient(rgba(0,0,0,${backgroundSettings.ditheringIntensity / 200}) 0% 25%, transparent 0% 50%); 
			background-size: 4px 4px;`
		: '';

	// Calculate question background style
	$: questionBgStyle = `${questionSettings.bgColor} opacity-${Math.round(questionSettings.bgOpacity / 10) * 10} backdrop-blur-sm`;

	// Calculate footer background style
	$: footerBgStyle = `opacity-${Math.round(footerSettings.bgOpacity / 10) * 10} backdrop-blur-sm`;

	// Custom file upload for background image
	let customBackgroundFile;
	let customBackgroundPreview = '';
	$: if (customBackgroundFile && customBackgroundFile[0]) {
		const reader = new FileReader();
		reader.onload = (e) => {
			customBackgroundPreview = e.target.result;
			// Add custom background to backgrounds array
			backgrounds.push({
				id: 'custom',
				path: customBackgroundPreview,
				name: 'Custom Upload'
			});
			activeBackground = 'custom';
		};
		reader.readAsDataURL(customBackgroundFile[0]);
	}

	// Apply a theme
	function applyTheme(themeId) {
		const theme = themes.find((t) => t.id === themeId);
		if (theme) {
			headerSettings = { ...theme.headerSettings };
			questionSettings = { ...theme.questionSettings };
			footerSettings = { ...theme.footerSettings };
			backgroundSettings = { ...theme.backgroundSettings };
			activeTheme = themeId;
		}
	}

	// Apply a background
	function applyBackground(backgroundId) {
		const background = backgrounds.find((bg) => bg.id === backgroundId);
		if (background) {
			activeBackground = backgroundId;
		}
	}

	// Generate QR code
	async function generateQRCode() {
		try {
			qrCodeData = await QRCode.toDataURL(questionUrl, {
				errorCorrectionLevel: 'H',
				margin: 1,
				color: {
					dark: '#6c5ce7',
					light: '#ffffff'
				}
			});
		} catch (err) {
			console.error('Error generating QR code:', err);
		}
	}

	// Create a clean filename from the question
	function createFilenameFromQuestion() {
		const words = question.trim().split(/\s+/).slice(0, 5);
		const cleanName = words
			.join('-')
			.replace(/[^a-zA-Z0-9-]/g, '')
			.toLowerCase();
		return `9takes-${cleanName}`;
	}

	// Export as PDF
	async function exportAsPDF() {
		if (!posterRef) return;

		try {
			exporting = true;

			// Dynamically import libraries when needed
			if (!toPng || !jsPDF) {
				const [htmlToImageModule, jsPDFModule] = await Promise.all([
					import('html-to-image'),
					import('jspdf')
				]);
				toPng = htmlToImageModule.toPng;
				jsPDF = jsPDFModule.jsPDF;
			}

			// Get the current poster format settings
			const format = posterFormats.find((f) => f.id === posterFormat);

			// Convert the poster to a PNG using html-to-image
			const dataUrl = await toPng(posterRef, {
				quality: 1.0,
				pixelRatio: 3,
				skipFonts: false,
				fontEmbedCSS: true,
				cacheBust: true
			});

			// Create a new PDF with the correct dimensions
			const pdf = new jsPDF({
				orientation: format.pdfHeight > format.pdfWidth ? 'portrait' : 'landscape',
				unit: format.unit,
				format: [format.pdfWidth, format.pdfHeight]
			});

			// Add the image to the PDF
			pdf.addImage(dataUrl, 'PNG', 0, 0, format.pdfWidth, format.pdfHeight, undefined, 'FAST');

			// Save the PDF
			pdf.save(`${createFilenameFromQuestion()}.pdf`);
		} catch (err) {
			console.error('Error exporting PDF:', err);
			alert('There was an error creating the PDF. Please try again.');
		} finally {
			exporting = false;
		}
	}

	// Export as PNG
	async function exportAsPNG() {
		if (!posterRef) return;

		try {
			exporting = true;

			// Dynamically import toPng when needed
			if (!toPng) {
				const htmlToImageModule = await import('html-to-image');
				toPng = htmlToImageModule.toPng;
			}

			// Convert the poster to a PNG using html-to-image
			const dataUrl = await toPng(posterRef, {
				quality: 1.0,
				pixelRatio: 3
			});

			// Create a download link and trigger it
			const link = document.createElement('a');
			link.download = `${createFilenameFromQuestion()}.png`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error('Error exporting PNG:', err);
			alert('There was an error creating the PNG. Please try again.');
		} finally {
			exporting = false;
		}
	}

	// Initialize
	onMount(() => {
		generateQRCode();
		applyTheme(themes[0].id);
		applyBackground(backgrounds[0].id);
	});
</script>

<div class="min-h-screen bg-neutral-100 p-6">
	<div class="mx-auto max-w-7xl">
		<header class="mb-6">
			<div class="flex items-center gap-3">
				<img src="/brand/nimbus.png" alt="9takes Logo" class="h-10" />
				<div>
					<h1 class="text-2xl font-bold text-primary-700">9takes Poster Generator</h1>
					<p class="text-sm text-neutral-600">
						Create customizable question posters for print or digital use
					</p>
				</div>
			</div>
		</header>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Column: Controls -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<!-- Tab Navigation -->
				<div class="mb-6 flex items-center justify-between">
					<div class="w-2/3 pr-2">
						<select
							bind:value={activeTab}
							class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
						>
							<option value="content">Content</option>
							<option value="theme">Theme</option>
							<option value="background">Background</option>
							<option value="header">Header</option>
							<option value="question">Question</option>
							<option value="footer">Footer</option>
							<option value="export">Export</option>
						</select>
					</div>
					<div class="flex w-1/3 justify-end">
						<label class="flex items-center">
							<input
								type="checkbox"
								bind:checked={showGrid}
								class="mr-2 h-4 w-4 text-primary-600"
							/>
							<span class="text-sm text-neutral-700">Grid</span>
						</label>
					</div>
				</div>

				{#if activeTab === 'content'}
					<div transition:fade={{ duration: 150 }}>
						<h2 class="mb-4 text-xl font-semibold text-neutral-800">Poster Content</h2>

						<div class="mb-4">
							<label for="question" class="mb-2 block text-sm font-medium text-neutral-700">
								Question
							</label>
							<textarea
								id="question"
								bind:value={question}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								rows="3"
							></textarea>
						</div>

						<div class="mb-4">
							<label for="questionUrl" class="mb-2 block text-sm font-medium text-neutral-700">
								Question URL for QR Code
							</label>
							<input
								type="url"
								id="questionUrl"
								bind:value={questionUrl}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								placeholder="https://9takes.com/question/123"
								on:change={generateQRCode}
							/>
						</div>

						<div class="mb-4">
							<label for="posterFormat" class="mb-2 block text-sm font-medium text-neutral-700">
								Poster Size
							</label>
							<select
								id="posterFormat"
								bind:value={posterFormat}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
							>
								{#each posterFormats as format}
									<option value={format.id}>{format.name}</option>
								{/each}
							</select>
						</div>
					</div>
				{/if}

				{#if activeTab === 'theme'}
					<div transition:fade={{ duration: 150 }}>
						<h2 class="mb-4 text-xl font-semibold text-neutral-800">Theme Selection</h2>

						<div class="mb-4 grid grid-cols-2 gap-3">
							{#each themes as theme}
								<button
									class="flex flex-col items-center rounded-lg border-2 p-3 transition-all hover:bg-neutral-50
									{activeTheme === theme.id ? 'border-primary-600 bg-primary-50' : 'border-neutral-200'}"
									on:click={() => applyTheme(theme.id)}
								>
									<div class="mb-2 h-16 w-full rounded border border-neutral-200 p-1">
										<div
											class="flex h-full w-full items-center justify-center rounded-sm bg-gradient-to-b from-purple-900 to-purple-500"
										>
											<div class="rounded bg-black bg-opacity-40 p-1 text-xs text-white">
												{theme.name}
											</div>
										</div>
									</div>
									<span class="text-sm font-medium">{theme.name}</span>
								</button>
							{/each}
						</div>

						<p class="mt-2 text-xs text-neutral-500">
							Applying a theme will update all styling settings but keep your current background
							selection.
						</p>
					</div>
				{/if}

				{#if activeTab === 'background'}
					<div transition:fade={{ duration: 150 }}>
						<h2 class="mb-4 text-xl font-semibold text-neutral-800">Background Settings</h2>

						<div class="mb-4 grid grid-cols-3 gap-2">
							{#each backgrounds as bg}
								<button
									class="flex flex-col items-center rounded-lg border-2 p-2 transition-all hover:bg-neutral-50
									{activeBackground === bg.id ? 'border-primary-600 bg-primary-50' : 'border-neutral-200'}"
									on:click={() => applyBackground(bg.id)}
								>
									<div
										class="mb-1 h-14 w-full rounded bg-cover bg-center"
										style="background-image: url({bg.path})"
									></div>
									<span class="text-xs font-medium">{bg.name}</span>
								</button>
							{/each}
						</div>

						<div class="mb-4">
							<label for="customBackground" class="mb-2 block text-sm font-medium text-neutral-700">
								Upload Custom Background
							</label>
							<input
								type="file"
								id="customBackground"
								accept="image/*"
								bind:files={customBackgroundFile}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div class="mb-4">
							<label
								for="backgroundOpacity"
								class="mb-2 block text-sm font-medium text-neutral-700"
							>
								Background Opacity: {backgroundSettings.opacity}%
							</label>
							<input
								type="range"
								id="backgroundOpacity"
								bind:value={backgroundSettings.opacity}
								min="0"
								max="100"
								class="w-full"
							/>
						</div>

						<div class="mb-4">
							<div class="flex items-center justify-between">
								<label class="text-sm font-medium text-neutral-700"> Gradient Overlay </label>
								<label class="flex items-center">
									<input
										type="checkbox"
										bind:checked={backgroundSettings.gradient}
										class="mr-2 h-4 w-4 text-primary-600"
									/>
									<span class="text-sm font-medium text-neutral-700">Enable</span>
								</label>
							</div>

							{#if backgroundSettings.gradient}
								<div class="mt-2 grid grid-cols-3 gap-2">
									<div>
										<label class="text-xs font-medium text-neutral-700">Top</label>
										<input
											type="color"
											bind:value={backgroundSettings.gradientColors.top}
											class="h-8 w-full rounded-md border border-neutral-300"
										/>
									</div>
									<div>
										<label class="text-xs font-medium text-neutral-700">Middle</label>
										<input
											type="color"
											bind:value={backgroundSettings.gradientColors.middle}
											class="h-8 w-full rounded-md border border-neutral-300"
										/>
									</div>
									<div>
										<label class="text-xs font-medium text-neutral-700">Bottom</label>
										<input
											type="color"
											bind:value={backgroundSettings.gradientColors.bottom}
											class="h-8 w-full rounded-md border border-neutral-300"
										/>
									</div>
								</div>
							{/if}
						</div>

						<div class="mb-4">
							<div class="flex items-center justify-between">
								<label for="ditheringIntensity" class="text-sm font-medium text-neutral-700">
									Dithering: {backgroundSettings.ditheringIntensity}%
								</label>
								<label class="flex items-center">
									<input
										type="checkbox"
										bind:checked={backgroundSettings.dithering}
										class="mr-2 h-4 w-4 text-primary-600"
									/>
									<span class="text-sm font-medium text-neutral-700">Enable</span>
								</label>
							</div>
							<input
								type="range"
								id="ditheringIntensity"
								bind:value={backgroundSettings.ditheringIntensity}
								min="0"
								max="100"
								disabled={!backgroundSettings.dithering}
								class="w-full"
							/>
							<p class="mt-1 text-xs text-neutral-500">
								Dithering adds a subtle texture that can improve print quality.
							</p>
						</div>
					</div>
				{/if}

				{#if activeTab === 'header'}
					<div transition:fade={{ duration: 150 }}>
						<h2 class="mb-4 text-xl font-semibold text-neutral-800">Header Settings</h2>

						<div class="mb-4">
							<label for="headerPosition" class="mb-2 block text-sm font-medium text-neutral-700">
								Header Position
							</label>
							<select
								id="headerPosition"
								bind:value={headerSettings.position}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
							>
								{#each headerPositions as position}
									<option value={position.id}>{position.name}</option>
								{/each}
							</select>
						</div>

						{#if headerSettings.position !== 'none'}
							<div class="mb-4">
								<label for="headerText" class="mb-2 block text-sm font-medium text-neutral-700">
									Header Text
								</label>
								<input
									type="text"
									id="headerText"
									bind:value={headerSettings.text}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>

							<div class="mb-4">
								<label for="logoSize" class="mb-2 block text-sm font-medium text-neutral-700">
									Logo Size
								</label>
								<select
									id="logoSize"
									bind:value={headerSettings.logoSize}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								>
									{#each logoSizes as size}
										<option value={size.id}>{size.name}</option>
									{/each}
								</select>
							</div>

							<div class="grid grid-cols-2 gap-3">
								<div>
									<label
										for="headerFontSize"
										class="mb-2 block text-sm font-medium text-neutral-700"
									>
										Font Size
									</label>
									<select
										id="headerFontSize"
										bind:value={headerSettings.fontSize}
										class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										{#each fontSizes as size}
											<option value={size.id}>{size.name}</option>
										{/each}
									</select>
								</div>

								<div>
									<label
										for="headerFontWeight"
										class="mb-2 block text-sm font-medium text-neutral-700"
									>
										Font Weight
									</label>
									<select
										id="headerFontWeight"
										bind:value={headerSettings.fontWeight}
										class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										{#each fontWeights as weight}
											<option value={weight.id}>{weight.name}</option>
										{/each}
									</select>
								</div>
							</div>

							<div class="mt-4 grid grid-cols-2 gap-3">
								<div>
									<label for="headerColor" class="mb-2 block text-sm font-medium text-neutral-700">
										Text Color
									</label>
									<select
										id="headerColor"
										bind:value={headerSettings.color}
										class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										{#each textColors as color}
											<option value={color.id}>{color.name}</option>
										{/each}
									</select>
								</div>

								<div>
									<label
										for="headerFontFamily"
										class="mb-2 block text-sm font-medium text-neutral-700"
									>
										Font Family
									</label>
									<select
										id="headerFontFamily"
										bind:value={headerSettings.fontFamily}
										class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										{#each fontFamilies as family}
											<option value={family.id}>{family.name}</option>
										{/each}
									</select>
								</div>
							</div>

							<div class="mt-4">
								<label class="flex items-center">
									<input
										type="checkbox"
										bind:checked={headerSettings.textShadow}
										class="mr-2 h-4 w-4 text-primary-600"
									/>
									<span class="text-sm font-medium text-neutral-700">Text shadow</span>
								</label>
							</div>
						{/if}
					</div>
				{/if}

				{#if activeTab === 'question'}
					<div transition:fade={{ duration: 150 }}>
						<h2 class="mb-4 text-xl font-semibold text-neutral-800">Question Styling</h2>

						<div class="grid grid-cols-2 gap-3">
							<div>
								<label
									for="questionFontSize"
									class="mb-2 block text-sm font-medium text-neutral-700"
								>
									Font Size
								</label>
								<select
									id="questionFontSize"
									bind:value={questionSettings.fontSize}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								>
									{#each fontSizes as size}
										<option value={size.id}>{size.name}</option>
									{/each}
								</select>
							</div>

							<div>
								<label
									for="questionFontWeight"
									class="mb-2 block text-sm font-medium text-neutral-700"
								>
									Font Weight
								</label>
								<select
									id="questionFontWeight"
									bind:value={questionSettings.fontWeight}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								>
									{#each fontWeights as weight}
										<option value={weight.id}>{weight.name}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="mt-4 grid grid-cols-2 gap-3">
							<div>
								<label for="questionColor" class="mb-2 block text-sm font-medium text-neutral-700">
									Text Color
								</label>
								<select
									id="questionColor"
									bind:value={questionSettings.color}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								>
									{#each textColors as color}
										<option value={color.id}>{color.name}</option>
									{/each}
								</select>
							</div>

							<div>
								<label
									for="questionFontFamily"
									class="mb-2 block text-sm font-medium text-neutral-700"
								>
									Font Family
								</label>
								<select
									id="questionFontFamily"
									bind:value={questionSettings.fontFamily}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								>
									{#each fontFamilies as family}
										<option value={family.id}>{family.name}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="mt-4">
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={questionSettings.textShadow}
									class="mr-2 h-4 w-4 text-primary-600"
								/>
								<span class="text-sm font-medium text-neutral-700">Text shadow</span>
							</label>
						</div>

						<div class="mt-4">
							<label for="questionBgColor" class="mb-2 block text-sm font-medium text-neutral-700">
								Background Color
							</label>
							<select
								id="questionBgColor"
								bind:value={questionSettings.bgColor}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
							>
								{#each bgColors as color}
									<option value={color.id}>{color.name}</option>
								{/each}
							</select>
						</div>

						<div class="mt-4">
							<label
								for="questionBgOpacity"
								class="mb-2 block text-sm font-medium text-neutral-700"
							>
								Background Opacity: {questionSettings.bgOpacity}%
							</label>
							<input
								type="range"
								id="questionBgOpacity"
								bind:value={questionSettings.bgOpacity}
								min="0"
								max="100"
								class="w-full"
							/>
						</div>
					</div>
				{/if}

				{#if activeTab === 'footer'}
					<div transition:fade={{ duration: 150 }}>
						<h2 class="mb-4 text-xl font-semibold text-neutral-800">Footer Settings</h2>

						<div class="mb-4">
							<label for="qrCodeLabel" class="mb-2 block text-sm font-medium text-neutral-700">
								QR Code Label
							</label>
							<input
								type="text"
								id="qrCodeLabel"
								bind:value={footerSettings.qrLabel}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div class="mb-4">
							<label
								for="footerTextPrimary"
								class="mb-2 block text-sm font-medium text-neutral-700"
							>
								Footer Primary Text
							</label>
							<input
								type="text"
								id="footerTextPrimary"
								bind:value={footerSettings.textPrimary}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div class="mb-4">
							<label
								for="footerTextSecondary"
								class="mb-2 block text-sm font-medium text-neutral-700"
							>
								Footer Secondary Text
							</label>
							<input
								type="text"
								id="footerTextSecondary"
								bind:value={footerSettings.textSecondary}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<div>
								<label for="footerFontSize" class="mb-2 block text-sm font-medium text-neutral-700">
									Font Size
								</label>
								<select
									id="footerFontSize"
									bind:value={footerSettings.fontSize}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								>
									{#each fontSizes as size}
										<option value={size.id}>{size.name}</option>
									{/each}
								</select>
							</div>

							<div>
								<label
									for="footerFontWeight"
									class="mb-2 block text-sm font-medium text-neutral-700"
								>
									Font Weight
								</label>
								<select
									id="footerFontWeight"
									bind:value={footerSettings.fontWeight}
									class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
								>
									{#each fontWeights as weight}
										<option value={weight.id}>{weight.name}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="mt-4">
							<label for="footerColor" class="mb-2 block text-sm font-medium text-neutral-700">
								Text Color
							</label>
							<select
								id="footerColor"
								bind:value={footerSettings.color}
								class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
							>
								{#each textColors as color}
									<option value={color.id}>{color.name}</option>
								{/each}
							</select>
						</div>

						<div class="mt-4">
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={footerSettings.textShadow}
									class="mr-2 h-4 w-4 text-primary-600"
								/>
								<span class="text-sm font-medium text-neutral-700">Text shadow</span>
							</label>
						</div>

						<div class="mt-4">
							<label for="footerBgOpacity" class="mb-2 block text-sm font-medium text-neutral-700">
								Background Opacity: {footerSettings.bgOpacity}%
							</label>
							<input
								type="range"
								id="footerBgOpacity"
								bind:value={footerSettings.bgOpacity}
								min="0"
								max="100"
								class="w-full"
							/>
						</div>
					</div>
				{/if}

				{#if activeTab === 'export'}
					<div transition:fade={{ duration: 150 }}>
						<h2 class="mb-4 text-xl font-semibold text-neutral-800">Export Options</h2>

						<p class="mb-4 text-sm text-neutral-600">
							Generate high-quality exports of your poster for print or digital use.
						</p>

						<div class="mb-6">
							<h3 class="mb-2 text-lg font-medium text-neutral-800">Download as</h3>
							<div class="grid grid-cols-2 gap-3">
								<button
									on:click={exportAsPDF}
									disabled={exporting}
									class="flex items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-3 text-white transition-colors hover:bg-primary-800 disabled:opacity-50"
								>
									{#if exporting}
										<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
												fill="none"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Processing...
									{:else}
										<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
												clip-rule="evenodd"
											></path>
										</svg>
										PDF
									{/if}
								</button>

								<button
									on:click={exportAsPNG}
									disabled={exporting}
									class="flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-3 text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
								>
									{#if exporting}
										<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
												fill="none"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Processing...
									{:else}
										<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
												clip-rule="evenodd"
											></path>
										</svg>
										PNG
									{/if}
								</button>
							</div>
						</div>

						<div class="rounded-md bg-blue-50 p-4">
							<div class="flex">
								<div class="flex-shrink-0">
									<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
								<div class="ml-3 text-sm text-blue-700">
									<p>Files will be saved with names based on your question text.</p>
									<p class="mt-2">For best print quality:</p>
									<ul class="ml-5 mt-1 list-disc text-xs">
										<li>Use high-resolution backgrounds</li>
										<li>Set your printer to high quality</li>
										<li>Export as PDF for printing</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Right Column: Preview -->
			<div class="lg:col-span-2">
				<div class="mb-2 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-neutral-800">Poster Preview</h2>
					<div class="text-sm text-neutral-600">
						{currentFormat.name}
					</div>
				</div>

				<div class="flex justify-center overflow-auto rounded-lg bg-white p-4 shadow-md">
					<div
						bind:this={posterRef}
						class="relative flex flex-col items-center justify-between overflow-hidden rounded-md border border-neutral-200"
						style="width: {currentFormat.width}; height: {currentFormat.height}; max-height: 70vh;"
					>
						<!-- Background with opacity -->
						<div
							class="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
							style={backgroundStyle}
						></div>

						<!-- Dithering overlay -->
						{#if backgroundSettings.dithering}
							<div
								class="z-1 pointer-events-none absolute inset-0 h-full w-full"
								style={ditheringStyle}
							></div>
						{/if}

						<!-- Grid overlay for alignment -->
						{#if showGrid}
							<div class="absolute inset-0 z-10 grid grid-cols-6 grid-rows-8">
								{#each Array(48) as _}
									<div class="border border-primary-500 border-opacity-30"></div>
								{/each}
							</div>
						{/if}

						<!-- Header -->
						{#if headerSettings.position === 'top'}
							<div
								class="relative z-10 mt-6 flex w-full items-center justify-center px-6 py-4 {headerSettings.fontFamily}"
							>
								<div class="flex items-center">
									{#if headerSettings.logoSize !== 'none'}
										<img src="/brand/nimbus.png" alt="9takes Logo" class={currentLogoSize} />
									{/if}
									<div
										class="{headerSettings.fontSize} {headerSettings.fontWeight} {headerSettings.color} ml-3 {headerSettings.textShadow
											? 'drop-shadow-lg'
											: ''}"
									>
										{headerSettings.text}
									</div>
								</div>
							</div>
						{/if}

						<!-- Question Box -->
						<div class="z-10 flex flex-grow items-center justify-center px-8 py-6">
							<div class="rounded-lg {questionBgStyle} p-6 shadow-xl {questionSettings.fontFamily}">
								{#if headerSettings.position === 'center'}
									<div class="mb-4 flex items-center justify-center {headerSettings.fontFamily}">
										{#if headerSettings.logoSize !== 'none'}
											<img src="/brand/nimbus.png" alt="9takes Logo" class={currentLogoSize} />
										{/if}
										<div
											class="{headerSettings.fontSize} {headerSettings.fontWeight} {headerSettings.color} ml-3 {headerSettings.textShadow
												? 'drop-shadow-lg'
												: ''}"
										>
											{headerSettings.text}
										</div>
									</div>
								{/if}

								<h2
									class="{questionSettings.fontSize} {questionSettings.fontWeight} {questionSettings.color} text-center leading-tight {questionSettings.textShadow
										? 'drop-shadow-lg'
										: ''}"
								>
									{question}
								</h2>
							</div>
						</div>

						<!-- Footer -->
						<div class="z-10 mb-6 flex w-full items-end justify-between px-8">
							<!-- QR Code Box -->
							<div class="flex flex-col items-center rounded-lg bg-white p-4 shadow-xl">
								<p class="mb-2 text-center font-bold text-primary-700">{footerSettings.qrLabel}</p>
								{#if qrCodeData}
									<img src={qrCodeData} alt="QR Code" class="h-24 w-24 rounded-md" />
								{/if}
							</div>

							<!-- Footer Text Box -->
							<div class="rounded-lg bg-neutral-900 p-4 text-right shadow-xl">
								<p
									class="{footerSettings.fontSize} {footerSettings.fontWeight} {footerSettings.color} {footerSettings.textShadow
										? 'drop-shadow-md'
										: ''}"
								>
									{footerSettings.textPrimary}
								</p>
								<p
									class="text-xl font-bold {footerSettings.color} {footerSettings.textShadow
										? 'drop-shadow-md'
										: ''}"
								>
									{footerSettings.textSecondary}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-2 flex justify-between text-xs text-neutral-600">
					<p>Preview shows exactly what your exported poster will look like.</p>
					<button
						on:click={() => (activeTab = 'export')}
						class="text-primary-700 hover:text-primary-800 hover:underline"
					>
						Ready to export? Click here →
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Ensure container properly handles poster dimensions */
	:global(.font-serif) {
		font-family: 'Georgia', serif;
	}

	:global(.font-sans) {
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	:global(.font-mono) {
		font-family: 'Courier New', monospace;
	}

	/* Improved range input styling */
	input[type='range'] {
		@apply h-2 appearance-none rounded-lg bg-neutral-200;
	}

	input[type='range']::-webkit-slider-thumb {
		@apply h-4 w-4 cursor-pointer appearance-none rounded-full bg-primary-600;
	}

	/* Make color picker more visible */
	input[type='color'] {
		@apply cursor-pointer;
	}

	/* Ensure QR code is crisp */
	img[alt='QR Code'] {
		image-rendering: pixelated;
	}
</style>
