<!-- src/routes/admin/asset-generators/zine-creator/+page.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { tick } from 'svelte';
	import QRCode from 'qrcode';
	import type { PageData } from './$types';
	import {
		ENNEAGRAM_COLOR_SCHEMES,
		ZINE_FORMATS,
		estimateTotalPages,
		generateHalfPageImposition,
		generateQuarterPageImposition,
		getDefaultColorScheme,
		getMiniZineLayout,
		getValidPageCounts,
		paginateSections,
		recommendPageCount,
		type ColorScheme,
		type ImportedZineBlog,
		type ZineFormatId,
		type ZineSection
	} from './zine-utils';

	let { data }: { data: PageData } = $props();

	type ActiveTab = 'import' | 'layout' | 'style' | 'export';
	type HeadingFont = 'serif' | 'sans' | 'display';
	type PageNumberPosition = 'bottom-center' | 'bottom-outside';
	type PullQuoteMode = 'auto' | 'manual';
	type ImageStyle = 'full-bleed' | 'inset' | 'rounded';
	type RenderPageType = 'cover' | 'content' | 'back-cover';

	interface RenderPage {
		id: string;
		type: RenderPageType;
		pageNumber: number;
		totalPages: number;
		title: string;
		subtitle?: string;
		text: string;
		footer?: string;
		sectionTitle?: string;
		imageSrc?: string;
	}

	// Import state
	let activeTab = $state<ActiveTab>('import');
	let blogUrl = $state('');
	let loadingBlog = $state(false);
	let importError = $state('');
	let importNotice = $state('Paste a 9takes blog URL or pick a recent post.');
	let importedBlog = $state<ImportedZineBlog | null>(null);
	let sections = $state<ZineSection[]>([]);

	// Layout + style state
	let formatId = $state<ZineFormatId>('half');
	let pageCount = $state(12);
	let headingFont = $state<HeadingFont>('serif');
	let bodyFontSizePt = $state<9 | 10 | 11>(10);
	let includePageNumbers = $state(true);
	let pageNumberPosition = $state<PageNumberPosition>('bottom-center');
	let pullQuotesMode = $state<PullQuoteMode>('auto');
	let manualPullQuotes = $state('');
	let includeInteriorImages = $state(true);
	let imageStyle = $state<ImageStyle>('inset');
	let colorScheme = $state<ColorScheme>(getDefaultColorScheme(null));

	let coverTitle = $state('');
	let coverSubtitle = $state('');
	let coverAuthor = $state('');
	let coverDate = $state('');
	let coverImage = $state('');
	let backCtaText = $state('See the emotions behind every take');
	let backBranding = $state('9takes.com');
	let includeBackQr = $state(true);
	let allowTruncation = $state(false);
	let draggingSectionId = $state<string | null>(null);

	// Preview + export state
	let spreadView = $state(false);
	let previewZoom = $state(1);
	let previewPage = $state(1);
	let qrCodeData = $state('');
	let exporting = $state(false);

	let pageRefs = $state<Array<HTMLElement | null>>([]);
	let toPng: any = null;
	let jsPDFCtor: any = null;

	const headingFontFamily: Record<HeadingFont, string> = {
		serif: "'Iowan Old Style', 'Times New Roman', serif",
		sans: "'Avenir Next', 'Segoe UI', sans-serif",
		display: "'Palatino', 'Book Antiqua', serif"
	};

	const exportDpi = 300;
	const stagingDpi = 150;

	let format = $derived(ZINE_FORMATS[formatId]);
	let validPageCounts = $derived(getValidPageCounts(formatId));
	let selectedSections = $derived.by(() => sections.filter((section) => section.include));
	let estimatedPageCount = $derived.by(() =>
		estimateTotalPages(selectedSections, formatId, bodyFontSizePt)
	);
	let recommendedPageCount = $derived(recommendPageCount(formatId, estimatedPageCount));

	let pullQuotes = $derived.by(() => {
		if (!importedBlog) return [];
		if (pullQuotesMode === 'manual') {
			const manual = manualPullQuotes
				.split('\n')
				.map((entry) => entry.trim())
				.filter(Boolean);
			if (manual.length > 0) return manual;
		}
		return importedBlog.pullQuotes ?? [];
	});
	let orderedIncludedSections = $derived.by(() =>
		[...selectedSections].sort((a, b) => a.order - b.order)
	);
	let availableContentPages = $derived(Math.max(1, pageCount - 2));
	let contentDraftPages = $derived.by(() =>
		paginateSections(orderedIncludedSections, formatId, bodyFontSizePt)
	);
	let wouldTruncate = $derived(contentDraftPages.length > availableContentPages);

	let zinePages = $derived.by(() => buildZinePages());
	let previewPair = $derived.by(() => {
		if (zinePages.length === 0) return [];
		if (!spreadView) {
			return [zinePages[Math.max(0, previewPage - 1)]];
		}

		const left = zinePages[Math.max(0, previewPage - 1)] ?? null;
		const right = zinePages[Math.max(0, previewPage)] ?? null;
		return [left, right].filter(Boolean) as RenderPage[];
	});

	let previewWidth = $derived(Math.round(format.pageWidthIn * 68 * previewZoom));
	let previewHeight = $derived(Math.round(format.pageHeightIn * 68 * previewZoom));
	let stageWidth = $derived(Math.round(format.pageWidthIn * stagingDpi));
	let stageHeight = $derived(Math.round(format.pageHeightIn * stagingDpi));

	$effect(() => {
		if (!validPageCounts.includes(pageCount)) {
			pageCount = recommendPageCount(formatId, estimatedPageCount);
		}
	});

	$effect(() => {
		if (!importedBlog?.sourceUrl) {
			qrCodeData = '';
			return;
		}

		generateQrCode(importedBlog.sourceUrl);
	});

	$effect(() => {
		if (zinePages.length === 0) {
			previewPage = 1;
			return;
		}

		if (previewPage > zinePages.length) {
			previewPage = zinePages.length;
		}
	});

	async function generateQrCode(url: string) {
		try {
			qrCodeData = await QRCode.toDataURL(url, {
				errorCorrectionLevel: 'H',
				margin: 1,
				width: 240,
				color: { dark: '#1f2937', light: '#ffffff' }
			});
		} catch (error) {
			console.error('Failed to generate QR code:', error);
			qrCodeData = '';
		}
	}

	function normalizePickedUrl(rawUrl: string): string {
		if (!rawUrl) return '';
		if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
		if (rawUrl.startsWith('/')) return `https://9takes.com${rawUrl}`;
		return `https://9takes.com${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
	}

	async function importBlog() {
		if (!blogUrl.trim()) {
			importError = 'Please enter a URL first.';
			return;
		}

		loadingBlog = true;
		importError = '';
		importNotice = 'Loading blog content...';

		try {
			const formData = new FormData();
			formData.set('url', blogUrl.trim());
			const response = await fetch('?/fetchBlog', {
				method: 'POST',
				body: formData
			});
			const text = await response.text();
			const result = deserialize(text) as { type: string; data?: Record<string, any> };

			if (result.type === 'success' && result.data?.blog) {
				const blog = result.data.blog as ImportedZineBlog;
				applyImportedBlog(blog);
				importNotice = `Loaded "${blog.title}".`;
				activeTab = 'layout';
			} else {
				importError = result.data?.error ?? 'Could not load the blog.';
			}
		} catch (error) {
			console.error('Import failed:', error);
			importError = 'Failed to load blog from server action.';
		} finally {
			loadingBlog = false;
		}
	}

	async function pickRecent(url: string) {
		blogUrl = normalizePickedUrl(url);
		await importBlog();
	}

	function applyImportedBlog(blog: ImportedZineBlog) {
		importedBlog = blog;
		sections = blog.sections.map((section, index) => ({ ...section, include: true, order: index }));

		coverTitle = blog.title;
		coverSubtitle =
			blog.enneagram !== null ? `Enneagram Type ${blog.enneagram}` : blog.description.slice(0, 90);
		coverAuthor = blog.author || '9takes';
		coverDate = formatDateForCover(blog.date);
		coverImage = blog.images[0]?.src ?? '';

		colorScheme = getDefaultColorScheme(blog.enneagram ?? null);
		pageCount = recommendPageCount(
			formatId,
			estimateTotalPages(blog.sections, formatId, bodyFontSizePt)
		);
		allowTruncation = false;
		previewPage = 1;
		spreadView = false;
	}

	function formatDateForCover(dateInput: string): string {
		if (!dateInput) return '';
		const parsed = new Date(dateInput);
		if (Number.isNaN(parsed.getTime())) return dateInput;
		return parsed.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function toggleSection(sectionId: string) {
		sections = sections.map((section) =>
			section.id === sectionId ? { ...section, include: !section.include } : section
		);
	}

	function moveSection(sectionId: string, direction: -1 | 1) {
		const sorted = [...sections].sort((a, b) => a.order - b.order);
		const index = sorted.findIndex((section) => section.id === sectionId);
		if (index < 0) return;
		const newIndex = index + direction;
		if (newIndex < 0 || newIndex >= sorted.length) return;

		[sorted[index], sorted[newIndex]] = [sorted[newIndex], sorted[index]];
		sections = sorted.map((section, order) => ({ ...section, order }));
	}

	function reorderSection(sourceSectionId: string, targetSectionId: string) {
		if (sourceSectionId === targetSectionId) return;
		const sorted = [...sections].sort((a, b) => a.order - b.order);
		const fromIndex = sorted.findIndex((section) => section.id === sourceSectionId);
		const toIndex = sorted.findIndex((section) => section.id === targetSectionId);
		if (fromIndex < 0 || toIndex < 0) return;
		const [moved] = sorted.splice(fromIndex, 1);
		sorted.splice(toIndex, 0, moved);
		sections = sorted.map((section, order) => ({ ...section, order }));
	}

	function handleSectionDrop(targetSectionId: string) {
		if (!draggingSectionId) return;
		reorderSection(draggingSectionId, targetSectionId);
		draggingSectionId = null;
	}

	function applyRecommendedPageCount() {
		pageCount = recommendedPageCount;
	}

	function applyEnneagramPreset(typeNumber: number) {
		const preset = ENNEAGRAM_COLOR_SCHEMES[typeNumber];
		if (!preset) return;
		colorScheme = { ...preset };
	}

	function getCoverImage(): string {
		if (!importedBlog) return '';
		if (coverImage) return coverImage;
		if (!includeInteriorImages) return '';
		return importedBlog.images[0]?.src ?? '';
	}

	function buildZinePages(): RenderPage[] {
		const blog = importedBlog;
		if (!blog) return [];

		const contentDrafts = contentDraftPages;
		const contentPages = contentDrafts.slice(0, availableContentPages);
		const didTruncate = contentDrafts.length > availableContentPages;

		if (didTruncate && allowTruncation && contentPages.length > 0) {
			const last = contentPages[contentPages.length - 1];
			contentPages[contentPages.length - 1] = {
				sectionTitle: last.sectionTitle,
				text: `${last.text}\n\nRead more online: ${blog.sourceUrl}`
			};
		}

		while (contentPages.length < availableContentPages) {
			const quote = pullQuotes[contentPages.length % (pullQuotes.length || 1)] ?? '';
			contentPages.push({
				sectionTitle: 'Notes',
				text: quote ? `"${quote}"` : ' '
			});
		}

		const total = contentPages.length + 2;
		const pages: RenderPage[] = [];

		pages.push({
			id: 'cover',
			type: 'cover',
			pageNumber: 1,
			totalPages: total,
			title: coverTitle || blog.title,
			subtitle: coverSubtitle,
			text: blog.description || '',
			footer: `${coverAuthor || blog.author || '9takes'}${coverDate ? ` - ${coverDate}` : ''}`,
			imageSrc: getCoverImage()
		});

		contentPages.forEach((contentPage, index) => {
			const hasImage = includeInteriorImages && blog.images.length > 0 && index % 3 === 1;
			pages.push({
				id: `content-${index + 1}`,
				type: 'content',
				pageNumber: index + 2,
				totalPages: total,
				title: contentPage.sectionTitle,
				sectionTitle: contentPage.sectionTitle,
				text: contentPage.text,
				imageSrc: hasImage ? blog.images[index % blog.images.length]?.src : undefined
			});
		});

		pages.push({
			id: 'back-cover',
			type: 'back-cover',
			pageNumber: total,
			totalPages: total,
			title: 'Read online',
			text: blog.sourceUrl,
			footer: backCtaText
		});

		return pages;
	}

	function nextPage() {
		if (spreadView) {
			previewPage = Math.min(zinePages.length, previewPage + 2);
			return;
		}
		previewPage = Math.min(zinePages.length, previewPage + 1);
	}

	function previousPage() {
		if (spreadView) {
			previewPage = Math.max(1, previewPage - 2);
			return;
		}
		previewPage = Math.max(1, previewPage - 1);
	}

	function pageFooter(page: RenderPage): string {
		if (!includePageNumbers) return '';
		if (page.type === 'cover') return '';
		if (page.type === 'back-cover') return `${page.pageNumber}`;
		return `${page.pageNumber}`;
	}

	function filenameBase(): string {
		const slug = importedBlog?.slug || 'zine';
		return `9takes-${slug}-${formatId}-${pageCount}p`;
	}

	async function ensureExportLibraries() {
		if (toPng && jsPDFCtor) return;
		const [htmlToImage, jsPDFModule] = await Promise.all([
			import('html-to-image'),
			import('jspdf')
		]);
		toPng = htmlToImage.toPng;
		jsPDFCtor = jsPDFModule.jsPDF;
	}

	async function collectPageImages(): Promise<string[]> {
		if (!importedBlog || zinePages.length === 0) {
			throw new Error('No pages to export.');
		}

		await tick();
		await ensureExportLibraries();

		const output: string[] = [];
		for (let i = 0; i < zinePages.length; i++) {
			const node = pageRefs[i];
			if (!node) {
				throw new Error('A render target is missing.');
			}

			const dataUrl = await toPng(node, {
				quality: 1,
				pixelRatio: exportDpi / stagingDpi,
				backgroundColor: '#ffffff',
				cacheBust: true
			});
			output.push(dataUrl);
		}

		return output;
	}

	function getPageImage(images: string[], pageNumber: number): string | null {
		if (pageNumber < 1 || pageNumber > images.length) return null;
		return images[pageNumber - 1] ?? null;
	}

	function downloadDataUrl(dataUrl: string, filename: string) {
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = filename;
		link.click();
	}

	async function exportReaderPdf() {
		if (!importedBlog) return;
		exporting = true;
		importError = '';

		try {
			const images = await collectPageImages();
			const orientation = format.pageHeightIn >= format.pageWidthIn ? 'portrait' : 'landscape';
			const pdf = new jsPDFCtor({
				orientation,
				unit: 'in',
				format: [format.pageWidthIn, format.pageHeightIn]
			});

			images.forEach((image, index) => {
				if (index > 0) {
					pdf.addPage([format.pageWidthIn, format.pageHeightIn], orientation);
				}
				pdf.addImage(
					image,
					'PNG',
					0,
					0,
					format.pageWidthIn,
					format.pageHeightIn,
					undefined,
					'FAST'
				);
			});

			pdf.save(`${filenameBase()}-reader.pdf`);
		} catch (error) {
			console.error('Reader PDF export failed:', error);
			importError = 'Could not export reader PDF.';
		} finally {
			exporting = false;
		}
	}

	async function exportPrintReadyPdf() {
		if (!importedBlog) return;
		exporting = true;
		importError = '';

		try {
			const images = await collectPageImages();
			if (formatId === 'mini') {
				await exportMiniPrintReady(images);
				return;
			}

			if (formatId === 'half') {
				await exportHalfPrintReady(images);
				return;
			}

			await exportQuarterPrintReady(images);
		} catch (error) {
			console.error('Print-ready export failed:', error);
			importError = 'Could not export print-ready PDF.';
		} finally {
			exporting = false;
		}
	}

	async function exportHalfPrintReady(images: string[]) {
		const totalPages = zinePages.length;
		const sheets = generateHalfPageImposition(totalPages);
		const pdf = new jsPDFCtor({ orientation: 'landscape', unit: 'in', format: 'letter' });
		let firstSide = true;

		for (const sheet of sheets) {
			const sides = [sheet.front, sheet.back];
			for (const side of sides) {
				if (!firstSide) {
					pdf.addPage('letter', 'landscape');
				}
				firstSide = false;

				const leftImage = getPageImage(images, side.left);
				const rightImage = getPageImage(images, side.right);
				if (leftImage) {
					pdf.addImage(leftImage, 'PNG', 0, 0, 5.5, 8.5, undefined, 'FAST');
				}
				if (rightImage) {
					pdf.addImage(rightImage, 'PNG', 5.5, 0, 5.5, 8.5, undefined, 'FAST');
				}
			}
		}

		pdf.save(`${filenameBase()}-print-ready.pdf`);
	}

	async function exportQuarterPrintReady(images: string[]) {
		const totalPages = zinePages.length;
		const sheets = generateQuarterPageImposition(totalPages);
		const pdf = new jsPDFCtor({ orientation: 'portrait', unit: 'in', format: 'letter' });
		let firstSide = true;

		for (const sheet of sheets) {
			const sides = [sheet.front, sheet.back];
			for (const side of sides) {
				if (!firstSide) {
					pdf.addPage('letter', 'portrait');
				}
				firstSide = false;

				const slots = [
					{ page: side.topLeft, x: 0, y: 0 },
					{ page: side.topRight, x: 4.25, y: 0 },
					{ page: side.bottomLeft, x: 0, y: 5.5 },
					{ page: side.bottomRight, x: 4.25, y: 5.5 }
				];

				for (const slot of slots) {
					const image = getPageImage(images, slot.page);
					if (!image) continue;
					pdf.addImage(image, 'PNG', slot.x, slot.y, 4.25, 5.5, undefined, 'FAST');
				}
			}
		}

		pdf.save(`${filenameBase()}-print-ready.pdf`);
	}

	async function exportMiniPrintReady(images: string[]) {
		const pdf = new jsPDFCtor({ orientation: 'landscape', unit: 'in', format: 'letter' });
		const layout = getMiniZineLayout();

		for (const slot of layout) {
			const image = getPageImage(images, slot.page);
			if (!image) continue;
			pdf.addImage(
				image,
				'PNG',
				slot.col * 2.75,
				slot.row * 4.25,
				2.75,
				4.25,
				undefined,
				'FAST',
				slot.rotation
			);
		}

		pdf.setDrawColor(120);
		pdf.setLineDashPattern([0.1, 0.1], 0);
		pdf.line(5.5, 2.125, 5.5, 6.375);
		pdf.setLineDashPattern([], 0);
		pdf.save(`${filenameBase()}-print-ready.pdf`);
	}

	async function exportInstructionSheet() {
		if (!importedBlog) return;
		exporting = true;
		importError = '';

		try {
			await ensureExportLibraries();
			const pdf = new jsPDFCtor({ orientation: 'portrait', unit: 'in', format: 'letter' });

			pdf.setFontSize(18);
			pdf.text('Zine Assembly Instructions', 0.75, 1);
			pdf.setFontSize(11);
			pdf.text(`${importedBlog.title} (${format.label})`, 0.75, 1.35);

			const lines = getInstructionLines();
			let y = 1.9;
			for (const line of lines) {
				pdf.text(line, 0.9, y);
				y += 0.3;
			}

			pdf.setFontSize(10);
			pdf.text(
				'Tip: print a test sheet first to confirm your printer duplex direction.',
				0.75,
				10.2
			);
			pdf.save(`${filenameBase()}-instructions.pdf`);
		} catch (error) {
			console.error('Instruction sheet export failed:', error);
			importError = 'Could not export instruction sheet.';
		} finally {
			exporting = false;
		}
	}

	function getInstructionLines(): string[] {
		if (formatId === 'half') {
			return [
				'1. Print all pages duplex, flip on short edge.',
				'2. Keep sheets in order and fold all sheets together in half.',
				'3. Staple along the fold line to finish the booklet.'
			];
		}

		if (formatId === 'quarter') {
			return [
				'1. Print all pages duplex, flip on short edge.',
				'2. Cut each sheet horizontally into top and bottom halves.',
				'3. Fold each half at the vertical center.',
				'4. Nest leaves in sheet order (sheet 1 outermost), then staple spine.'
			];
		}

		return [
			'1. Print single-sided only.',
			'2. Fold lengthwise, then fold widthwise and unfold.',
			'3. Cut the marked center slit only.',
			'4. Refold and collapse into an 8-page mini booklet.'
		];
	}

	async function exportPageImages() {
		if (!importedBlog) return;
		exporting = true;
		importError = '';

		try {
			const images = await collectPageImages();
			images.forEach((image, index) => {
				downloadDataUrl(image, `${filenameBase()}-page-${String(index + 1).padStart(2, '0')}.png`);
			});
		} catch (error) {
			console.error('PNG export failed:', error);
			importError = 'Could not export page images.';
		} finally {
			exporting = false;
		}
	}

	function canExport(): boolean {
		return (
			!!importedBlog && zinePages.length > 0 && !exporting && (!wouldTruncate || allowTruncation)
		);
	}

	function setSpreadMode(enabled: boolean) {
		spreadView = enabled;
		if (enabled && previewPage % 2 === 0) {
			previewPage = Math.max(1, previewPage - 1);
		}
	}
</script>

<div class="zine-creator">
	<div class="header">
		<div>
			<h1>Zine Creator</h1>
			<p>Import a blog post, format pages, and export print-ready zines.</p>
		</div>
		<div class="header-actions">
			<button class="btn btn-secondary" onclick={exportInstructionSheet} disabled={!canExport()}>
				Instruction Sheet
			</button>
			<button class="btn btn-primary" onclick={exportPrintReadyPdf} disabled={!canExport()}>
				Print-Ready PDF
			</button>
		</div>
	</div>

	<div class="main-grid">
		<div class="controls-panel">
			<div class="tabs">
				<button
					class="tab"
					class:active={activeTab === 'import'}
					onclick={() => (activeTab = 'import')}
				>
					Import
				</button>
				<button
					class="tab"
					class:active={activeTab === 'layout'}
					onclick={() => (activeTab = 'layout')}
				>
					Layout
				</button>
				<button
					class="tab"
					class:active={activeTab === 'style'}
					onclick={() => (activeTab = 'style')}
				>
					Style
				</button>
				<button
					class="tab"
					class:active={activeTab === 'export'}
					onclick={() => (activeTab = 'export')}
				>
					Export
				</button>
			</div>

			<div class="tab-content">
				{#if activeTab === 'import'}
					<div class="section">
						<label class="label" for="blog-url">Blog URL</label>
						<div class="row gap">
							<input
								id="blog-url"
								class="input"
								type="text"
								bind:value={blogUrl}
								placeholder="https://9takes.com/enneagram-corner/..."
							/>
							<button class="btn btn-primary" onclick={importBlog} disabled={loadingBlog}>
								{loadingBlog ? 'Loading...' : 'Load Blog'}
							</button>
						</div>
						<p class="hint">
							Supports main Enneagram posts, mental-health posts, and personality-analysis posts.
						</p>
						{#if importNotice}
							<p class="notice">{importNotice}</p>
						{/if}
						{#if importError}
							<p class="error">{importError}</p>
						{/if}
					</div>

					<div class="section">
						<p class="label">Recent Enneagram</p>
						<div class="picker-list">
							{#each data.enneagramBlogs ?? [] as post}
								<button class="picker-item" onclick={() => pickRecent(post.url)}>
									<div class="picker-title">{post.title}</div>
									<div class="picker-meta">
										{post.source}
										{post.lastmod ? `- ${post.lastmod}` : ''}
									</div>
								</button>
							{/each}
						</div>
					</div>

					<div class="section">
						<p class="label">Recent Personality Analysis</p>
						<div class="picker-list">
							{#each data.peopleBlogs ?? [] as post}
								<button class="picker-item" onclick={() => pickRecent(post.url)}>
									<div class="picker-title">{post.title}</div>
									<div class="picker-meta">
										{post.slug}
										{post.lastmod ? `- ${post.lastmod}` : ''}
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}

				{#if activeTab === 'layout'}
					<div class="section">
						<label class="label" for="zine-format-select">Format</label>
						<select id="zine-format-select" class="input" bind:value={formatId}>
							<option value="half">{ZINE_FORMATS.half.label}</option>
							<option value="quarter">{ZINE_FORMATS.quarter.label}</option>
							<option value="mini">{ZINE_FORMATS.mini.label}</option>
						</select>
					</div>

					<div class="section">
						<label class="label" for="zine-page-count-select">Page Count</label>
						<select id="zine-page-count-select" class="input" bind:value={pageCount}>
							{#each validPageCounts as count}
								<option value={count}>{count} pages</option>
							{/each}
						</select>
						<p class="hint">
							Estimated content: {estimatedPageCount} pages. Recommended: {recommendedPageCount}.
						</p>
						<button class="btn btn-ghost" onclick={applyRecommendedPageCount}
							>Use recommended count</button
						>
						{#if wouldTruncate}
							<p class="error">
								Content currently overflows by {contentDraftPages.length - availableContentPages}
								page(s).
							</p>
							<label class="toggle">
								<input type="checkbox" bind:checked={allowTruncation} />
								<span>Allow truncation and append a "Read more online" marker</span>
							</label>
						{/if}
					</div>

					<div class="section">
						<p class="label">Cover</p>
						<input class="input" type="text" bind:value={coverTitle} placeholder="Cover title" />
						<input
							class="input"
							type="text"
							bind:value={coverSubtitle}
							placeholder="Subtitle / persona"
						/>
						<input class="input" type="text" bind:value={coverAuthor} placeholder="Author" />
						<input class="input" type="text" bind:value={coverDate} placeholder="Date" />
						<input
							class="input"
							type="text"
							bind:value={coverImage}
							placeholder="Cover image URL (optional)"
						/>
					</div>

					<div class="section">
						<p class="label">Sections</p>
						{#if sections.length === 0}
							<p class="hint">Load a blog first.</p>
						{:else}
							<p class="hint">Drag to reorder sections, or use Up/Down for precise moves.</p>
							<div class="section-list" role="list">
								{#each [...sections].sort((a, b) => a.order - b.order) as section, index}
									<div
										class="section-item"
										role="listitem"
										class:dragging={draggingSectionId === section.id}
										draggable="true"
										ondragstart={() => (draggingSectionId = section.id)}
										ondragend={() => (draggingSectionId = null)}
										ondragover={(event) => event.preventDefault()}
										ondrop={() => handleSectionDrop(section.id)}
									>
										<label>
											<input
												type="checkbox"
												checked={section.include}
												onchange={() => toggleSection(section.id)}
											/>
											<span>{section.title}</span>
										</label>
										<div class="section-actions">
											<button
												class="mini-btn"
												onclick={() => moveSection(section.id, -1)}
												disabled={index === 0}>Up</button
											>
											<button
												class="mini-btn"
												onclick={() => moveSection(section.id, 1)}
												disabled={index === sections.length - 1}
											>
												Down
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<div class="section">
						<p class="label">Back Cover</p>
						<input
							class="input"
							type="text"
							bind:value={backCtaText}
							placeholder="Back cover call to action"
						/>
						<input
							class="input"
							type="text"
							bind:value={backBranding}
							placeholder="Branding text"
						/>
						<label class="toggle">
							<input type="checkbox" bind:checked={includeBackQr} />
							<span>Show QR code on back cover</span>
						</label>
					</div>
				{/if}

				{#if activeTab === 'style'}
					<div class="section">
						<p class="label">Color Presets</p>
						<div class="preset-grid">
							{#each Object.entries(ENNEAGRAM_COLOR_SCHEMES) as [typeNumber, _palette]}
								<button class="mini-btn" onclick={() => applyEnneagramPreset(Number(typeNumber))}
									>Type {typeNumber}</button
								>
							{/each}
						</div>
						<div class="color-row">
							<label>Primary <input type="color" bind:value={colorScheme.primary} /></label>
							<label>Accent <input type="color" bind:value={colorScheme.accent} /></label>
							<label>BG <input type="color" bind:value={colorScheme.background} /></label>
						</div>
					</div>

					<div class="section">
						<label class="label" for="heading-font-select">Typography</label>
						<select id="heading-font-select" class="input" bind:value={headingFont}>
							<option value="serif">Serif</option>
							<option value="sans">Sans-serif</option>
							<option value="display">Display</option>
						</select>
						<select id="body-font-size-select" class="input" bind:value={bodyFontSizePt}>
							<option value={9}>Small (9pt)</option>
							<option value={10}>Medium (10pt)</option>
							<option value={11}>Large (11pt)</option>
						</select>
					</div>

					<div class="section">
						<label class="label" for="pull-quotes-select">Pull Quotes</label>
						<select id="pull-quotes-select" class="input" bind:value={pullQuotesMode}>
							<option value="auto">Auto (from content)</option>
							<option value="manual">Manual</option>
						</select>
						{#if pullQuotesMode === 'manual'}
							<textarea
								class="input"
								rows="4"
								bind:value={manualPullQuotes}
								placeholder="One quote per line"
							></textarea>
						{/if}
					</div>

					<div class="section">
						<p class="label">Page Numbers</p>
						<label class="toggle">
							<input type="checkbox" bind:checked={includePageNumbers} />
							<span>Show page numbers</span>
						</label>
						<select
							id="page-number-position-select"
							class="input"
							bind:value={pageNumberPosition}
							disabled={!includePageNumbers}
						>
							<option value="bottom-center">Bottom center</option>
							<option value="bottom-outside">Bottom outside</option>
						</select>
					</div>

					<div class="section">
						<p class="label">Images</p>
						<label class="toggle">
							<input type="checkbox" bind:checked={includeInteriorImages} />
							<span>Include interior images</span>
						</label>
						<select id="image-style-select" class="input" bind:value={imageStyle}>
							<option value="full-bleed">Full-bleed</option>
							<option value="inset">Inset with border</option>
							<option value="rounded">Rounded corners</option>
						</select>
					</div>
				{/if}

				{#if activeTab === 'export'}
					<div class="section">
						<p class="hint">
							Print-ready includes only imposed booklet pages. Instruction sheet is exported
							separately.
						</p>
						{#if wouldTruncate && !allowTruncation}
							<p class="error">
								Exports are locked until you increase page count or enable truncation.
							</p>
						{/if}
						<div class="export-buttons">
							<button class="export-btn" onclick={exportPrintReadyPdf} disabled={!canExport()}>
								Print-Ready PDF
							</button>
							<button class="export-btn" onclick={exportReaderPdf} disabled={!canExport()}>
								Reader PDF
							</button>
							<button class="export-btn" onclick={exportPageImages} disabled={!canExport()}>
								Page PNGs
							</button>
							<button class="export-btn" onclick={exportInstructionSheet} disabled={!canExport()}>
								Instruction Sheet
							</button>
						</div>
						<p class="hint">
							Format: {format.label} | Pages: {zinePages.length} | Sheets:
							{format.sheetsPerBooklet(zinePages.length)}
						</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="preview-panel">
			<div class="preview-toolbar">
				<div class="toolbar-left">
					<button class="mini-btn" onclick={previousPage} disabled={zinePages.length === 0}
						>Prev</button
					>
					<button class="mini-btn" onclick={nextPage} disabled={zinePages.length === 0}>Next</button
					>
					<span>
						Page {Math.min(previewPage, zinePages.length || 1)}
						{#if spreadView}
							-
							{Math.min(previewPage + 1, zinePages.length || 1)}
						{/if}
						of {zinePages.length || 0}
					</span>
				</div>
				<div class="toolbar-right">
					<label class="toggle compact">
						<input
							type="checkbox"
							checked={spreadView}
							onchange={(e) => setSpreadMode((e.target as HTMLInputElement).checked)}
						/>
						<span>Spread</span>
					</label>
					<label class="compact" for="preview-zoom-range">Zoom</label>
					<input
						id="preview-zoom-range"
						class="zoom-range"
						type="range"
						min="0.7"
						max="1.4"
						step="0.05"
						bind:value={previewZoom}
					/>
				</div>
			</div>

			{#if zinePages.length === 0}
				<div class="preview-empty">
					<p>Load a blog to preview zine pages.</p>
				</div>
			{:else}
				<div class="preview-canvas" class:spread={spreadView}>
					{#each previewPair as page}
						<article
							class={`zine-page-preview ${page.type}`}
							style={`width:${previewWidth}px;height:${previewHeight}px;--primary:${colorScheme.primary};--accent:${colorScheme.accent};--bg:${colorScheme.background};--heading-font:${headingFontFamily[headingFont]};--body-size:${bodyFontSizePt}pt;`}
						>
							{#if page.type === 'cover'}
								{#if page.imageSrc}
									<img class={`cover-image ${imageStyle}`} src={page.imageSrc} alt="Cover" />
								{/if}
								<div class="cover-overlay">
									{#if importedBlog?.enneagram}
										<span class="type-badge">Type {importedBlog.enneagram}</span>
									{/if}
									<h2>{page.title}</h2>
									{#if page.subtitle}
										<p class="subtitle">{page.subtitle}</p>
									{/if}
									<p class="cover-footer">{page.footer}</p>
								</div>
							{:else if page.type === 'content'}
								{#if page.imageSrc}
									<img class={`content-image ${imageStyle}`} src={page.imageSrc} alt="" />
								{/if}
								<h3>{page.sectionTitle}</h3>
								<p class="body-text">{page.text}</p>
							{:else}
								<div class="back-body">
									{#if includeBackQr && qrCodeData}
										<img class="qr" src={qrCodeData} alt="QR code" />
									{/if}
									<h3>Read online</h3>
									<p class="body-text">{page.text}</p>
									<p class="subtitle">{page.footer}</p>
									{#if backBranding}
										<p class="branding">{backBranding}</p>
									{/if}
								</div>
							{/if}
							{#if includePageNumbers && pageFooter(page)}
								<div class={`page-number ${pageNumberPosition}`}>{pageFooter(page)}</div>
							{/if}
						</article>
					{/each}
				</div>

				<div class="thumbnail-strip">
					{#each zinePages as page}
						<button
							class="thumb"
							class:active={previewPage === page.pageNumber}
							onclick={() => {
								previewPage = page.pageNumber;
								if (spreadView && previewPage % 2 === 0) previewPage -= 1;
							}}
						>
							{page.pageNumber}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Hidden staging area for export capture -->
	<div class="export-staging" aria-hidden="true">
		{#each zinePages as page, index}
			<article
				bind:this={pageRefs[index]}
				class={`zine-page-preview ${page.type}`}
				style={`width:${stageWidth}px;height:${stageHeight}px;--primary:${colorScheme.primary};--accent:${colorScheme.accent};--bg:${colorScheme.background};--heading-font:${headingFontFamily[headingFont]};--body-size:${bodyFontSizePt}pt;`}
			>
				{#if page.type === 'cover'}
					{#if page.imageSrc}
						<img class={`cover-image ${imageStyle}`} src={page.imageSrc} alt="Cover" />
					{/if}
					<div class="cover-overlay">
						{#if importedBlog?.enneagram}
							<span class="type-badge">Type {importedBlog.enneagram}</span>
						{/if}
						<h2>{page.title}</h2>
						{#if page.subtitle}
							<p class="subtitle">{page.subtitle}</p>
						{/if}
						<p class="cover-footer">{page.footer}</p>
					</div>
				{:else if page.type === 'content'}
					{#if page.imageSrc}
						<img class={`content-image ${imageStyle}`} src={page.imageSrc} alt="" />
					{/if}
					<h3>{page.sectionTitle}</h3>
					<p class="body-text">{page.text}</p>
				{:else}
					<div class="back-body">
						{#if includeBackQr && qrCodeData}
							<img class="qr" src={qrCodeData} alt="QR code" />
						{/if}
						<h3>Read online</h3>
						<p class="body-text">{page.text}</p>
						<p class="subtitle">{page.footer}</p>
						{#if backBranding}
							<p class="branding">{backBranding}</p>
						{/if}
					</div>
				{/if}
				{#if includePageNumbers && pageFooter(page)}
					<div class={`page-number ${pageNumberPosition}`}>{pageFooter(page)}</div>
				{/if}
			</article>
		{/each}
	</div>
</div>

<style>
	.zine-creator {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		color: var(--text-primary);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background: var(--void-deep);
		border: 1px solid var(--void-elevated);
		border-radius: 0.75rem;
	}

	.header h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.header p {
		margin: 0.35rem 0 0;
		color: var(--text-muted);
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.main-grid {
		display: grid;
		grid-template-columns: minmax(340px, 430px) 1fr;
		gap: 1rem;
		min-height: 720px;
	}

	.controls-panel {
		display: flex;
		flex-direction: column;
		background: var(--void-deep);
		border: 1px solid var(--void-elevated);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.tabs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.3rem;
		padding: 0.65rem;
		background: var(--void-elevated);
	}

	.tab {
		padding: 0.6rem 0.5rem;
		background: transparent;
		border: 1px solid var(--void-highlight);
		border-radius: 0.5rem;
		color: var(--text-secondary);
		font-weight: 600;
		cursor: pointer;
	}

	.tab.active {
		background: color-mix(in srgb, var(--nebula-primary) 22%, transparent);
		border-color: color-mix(in srgb, var(--nebula-primary) 55%, var(--void-highlight));
		color: var(--text-primary);
	}

	.tab-content {
		padding: 0.85rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.65rem;
		border: 1px solid var(--void-elevated);
		border-radius: 0.6rem;
		background: color-mix(in srgb, var(--void-deep) 88%, black);
	}

	.label {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.01em;
	}

	.row {
		display: flex;
		align-items: center;
	}

	.row.gap {
		gap: 0.5rem;
	}

	.input {
		width: 100%;
		padding: 0.55rem 0.65rem;
		border-radius: 0.45rem;
		border: 1px solid var(--void-highlight);
		background: var(--void-deep);
		color: var(--text-primary);
		font: inherit;
	}

	textarea.input {
		resize: vertical;
		min-height: 90px;
	}

	.hint {
		margin: 0;
		font-size: 0.82rem;
		color: var(--text-muted);
	}

	.notice,
	.error {
		margin: 0;
		font-size: 0.84rem;
	}

	.notice {
		color: #8ec5ff;
	}

	.error {
		color: #ff9ba2;
	}

	.picker-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		max-height: 180px;
		overflow: auto;
	}

	.picker-item {
		text-align: left;
		padding: 0.5rem;
		border-radius: 0.45rem;
		border: 1px solid var(--void-highlight);
		background: var(--void-deep);
		color: var(--text-primary);
		cursor: pointer;
	}

	.picker-title {
		font-size: 0.88rem;
		font-weight: 600;
		line-height: 1.25;
	}

	.picker-meta {
		font-size: 0.72rem;
		color: var(--text-muted);
		margin-top: 0.2rem;
	}

	.section-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		max-height: 260px;
		overflow: auto;
	}

	.section-item {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.45rem;
		border-radius: 0.45rem;
		border: 1px solid var(--void-highlight);
		align-items: center;
		cursor: grab;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.section-item.dragging {
		opacity: 0.65;
		border-color: color-mix(in srgb, var(--nebula-primary) 60%, var(--void-highlight));
		background: color-mix(in srgb, var(--nebula-primary) 12%, transparent);
	}

	.section-item label {
		display: flex;
		gap: 0.45rem;
		align-items: center;
		font-size: 0.84rem;
	}

	.section-actions {
		display: flex;
		gap: 0.3rem;
	}

	.preset-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.35rem;
	}

	.color-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.color-row label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.76rem;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.84rem;
	}

	.toggle.compact {
		font-size: 0.78rem;
	}

	.export-buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.export-btn {
		padding: 0.65rem;
		border-radius: 0.5rem;
		border: 1px solid var(--void-highlight);
		background: var(--void-deep);
		color: var(--text-primary);
		cursor: pointer;
		font-weight: 600;
	}

	.preview-panel {
		display: flex;
		flex-direction: column;
		background: linear-gradient(150deg, #0f172a, #101a2c 50%, #141e31);
		border: 1px solid var(--void-elevated);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.preview-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		border-bottom: 1px solid var(--void-elevated);
		background: rgba(2, 6, 23, 0.65);
	}

	.toolbar-left,
	.toolbar-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.82rem;
	}

	.preview-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 520px;
		color: var(--text-muted);
	}

	.preview-canvas {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.2rem;
		min-height: 560px;
		overflow: auto;
	}

	.thumbnail-strip {
		display: flex;
		gap: 0.35rem;
		padding: 0.7rem;
		border-top: 1px solid var(--void-elevated);
		overflow-x: auto;
		background: rgba(2, 6, 23, 0.55);
	}

	.thumb {
		min-width: 34px;
		height: 30px;
		border-radius: 0.4rem;
		border: 1px solid var(--void-highlight);
		background: var(--void-deep);
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.76rem;
		font-weight: 600;
	}

	.thumb.active {
		background: color-mix(in srgb, var(--nebula-primary) 24%, transparent);
		color: var(--text-primary);
	}

	.zine-page-preview {
		position: relative;
		border-radius: 0.3rem;
		background: var(--bg);
		color: #111827;
		box-shadow: 0 16px 32px rgba(0, 0, 0, 0.35);
		overflow: hidden;
		padding: 0.45in;
		display: flex;
		flex-direction: column;
		gap: 0.12in;
	}

	.zine-page-preview h2,
	.zine-page-preview h3 {
		margin: 0;
		line-height: 1.16;
		font-family: var(--heading-font);
		color: var(--primary);
	}

	.zine-page-preview h2 {
		font-size: 0.29in;
	}

	.zine-page-preview h3 {
		font-size: 0.22in;
	}

	.zine-page-preview .subtitle,
	.zine-page-preview .cover-footer {
		margin: 0;
		font-size: 0.12in;
		color: #334155;
	}

	.body-text {
		margin: 0;
		font-size: var(--body-size);
		line-height: 1.45;
		white-space: pre-wrap;
		overflow: hidden;
	}

	.content-image {
		width: 100%;
		max-height: 1.7in;
		object-fit: cover;
		border: 1px solid rgba(15, 23, 42, 0.16);
	}

	.content-image.full-bleed {
		width: calc(100% + 0.9in);
		margin: -0.45in -0.45in 0.08in;
		max-height: 2.1in;
	}

	.content-image.inset {
		border-radius: 0.08in;
	}

	.content-image.rounded {
		border-radius: 0.2in;
	}

	.cover-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.28;
	}

	.cover-image.inset {
		inset: 0.22in;
		width: calc(100% - 0.44in);
		height: calc(100% - 0.44in);
		border: 1px solid rgba(15, 23, 42, 0.16);
	}

	.cover-image.rounded {
		inset: 0.22in;
		width: calc(100% - 0.44in);
		height: calc(100% - 0.44in);
		border-radius: 0.16in;
	}

	.cover-overlay {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.14in;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.88) 0%,
			rgba(255, 255, 255, 0.8) 100%
		);
		padding: 0.22in;
		border-radius: 0.12in;
		margin-top: auto;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		padding: 0.04in 0.1in;
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent) 18%, #ffffff);
		font-size: 0.11in;
		font-weight: 700;
		color: var(--primary);
	}

	.back-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		justify-content: center;
		height: 100%;
		gap: 0.14in;
	}

	.qr {
		width: 1.1in;
		height: 1.1in;
		background: #fff;
		padding: 0.08in;
		border-radius: 0.08in;
	}

	.branding {
		margin: 0;
		font-size: 0.11in;
		color: #475569;
		font-weight: 700;
	}

	.page-number {
		position: absolute;
		bottom: 0.12in;
		font-size: 0.11in;
		color: #475569;
	}

	.page-number.bottom-center {
		left: 50%;
		transform: translateX(-50%);
	}

	.page-number.bottom-outside {
		right: 0.18in;
	}

	.btn {
		border: 1px solid var(--void-highlight);
		padding: 0.58rem 0.75rem;
		border-radius: 0.5rem;
		font-weight: 700;
		cursor: pointer;
		background: var(--void-deep);
		color: var(--text-primary);
	}

	.btn-primary {
		background: linear-gradient(130deg, #2563eb, #1d4ed8);
		border-color: #1d4ed8;
		color: white;
	}

	.btn-secondary {
		background: color-mix(in srgb, var(--void-deep) 80%, #020617);
	}

	.btn-ghost,
	.mini-btn {
		border: 1px solid var(--void-highlight);
		background: transparent;
		color: var(--text-secondary);
		padding: 0.35rem 0.55rem;
		border-radius: 0.42rem;
		font-size: 0.76rem;
		font-weight: 600;
		cursor: pointer;
	}

	.zoom-range {
		width: 110px;
	}

	.export-staging {
		position: fixed;
		top: 0;
		left: -100000px;
		pointer-events: none;
		opacity: 0;
		z-index: -1;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	@media (max-width: 1200px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.preview-canvas {
			min-height: 450px;
		}
	}
</style>
