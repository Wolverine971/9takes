// docs/outreach/enneagram-monthly/build-docx.cjs
// Builds the Word submission for Enneagram Monthly from the article markdown, which is
// the single source: text, figure caption, Table 1 and sources all come from it.
// Run: NODE_PATH=<dir with docx installed> node build-docx.cjs
const fs = require('fs');
const path = require('path');
const {
	AlignmentType,
	BorderStyle,
	Document,
	ExternalHyperlink,
	Footer,
	HeadingLevel,
	ImageRun,
	LevelFormat,
	Packer,
	PageNumber,
	Paragraph,
	ShadingType,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType
} = require('docx');

const HERE = __dirname;
const SLUG = 'what-famous-peoples-types-can-and-cant-tell-us';
// HTML comments (path labels, notes to self) never reach the document.
const md = fs.readFileSync(path.join(HERE, `${SLUG}.md`), 'utf8').replace(/<!--[\s\S]*?-->\n?/g, '');

const BODY_FONT = 'Georgia';
const HEAD_FONT = 'Arial';

// Curly quotes and apostrophes for print.
function smart(text) {
	return text
		.replace(/(^|[\s(\[])"/g, '$1“')
		.replace(/"/g, '”')
		.replace(/(^|[\s(\[])'/g, '$1‘')
		.replace(/'/g, '’');
}

// Inline markdown: **bold**, *italic*, [text](url). Returns docx runs.
function inline(text, base = {}) {
	const out = [];
	const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
	let last = 0;
	let match;
	const plain = (value, extra = {}) =>
		value &&
		out.push(new TextRun({ text: smart(value), font: BODY_FONT, size: 22, ...base, ...extra }));
	while ((match = pattern.exec(text))) {
		plain(text.slice(last, match.index));
		if (match[1]) plain(match[1], { bold: true });
		else if (match[2]) plain(match[2], { italics: true });
		else
			out.push(
				new ExternalHyperlink({
					link: match[4],
					children: [
						new TextRun({
							text: match[3],
							style: 'Hyperlink',
							font: BODY_FONT,
							size: base.size ?? 22
						})
					]
				})
			);
		last = pattern.lastIndex;
	}
	plain(text.slice(last));
	return out;
}

const stripMarks = (text) => text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');

function figureImage(file, alt) {
	const width = 624; // 6.5 in at 96 px/in
	const height = Math.round((width * 2.75) / 6.6);
	return new Paragraph({
		alignment: AlignmentType.CENTER,
		spacing: { before: 120, after: 80 },
		keepNext: true,
		children: [
			new ImageRun({
				type: 'png',
				data: fs.readFileSync(path.join(HERE, file)),
				transformation: { width, height },
				altText: { title: 'Figure 1', description: alt, name: 'figure-1' }
			})
		]
	});
}

// "*Figure 1. Caption text*" -> bold label, italic caption.
function caption(text, { keepNext = false, before = 0 } = {}) {
	const body = text.replace(/^\*|\*$/g, '');
	const [, label, rest] = body.match(/^((?:Figure|Table) \d+\.)\s*(.*)$/);
	return new Paragraph({
		keepNext,
		spacing: { before, after: keepNext ? 120 : 240 },
		children: [
			new TextRun({ text: `${label} `, font: BODY_FONT, size: 18, bold: true }),
			new TextRun({ text: smart(rest), font: BODY_FONT, size: 18, italics: true })
		]
	});
}

function table(lines) {
	const rows = lines
		.filter((line) => !/^\|\s*:?-+/.test(line))
		.map((line) =>
			line
				.replace(/^\||\|$/g, '')
				.split('|')
				.map((cell) => cell.trim())
		);
	const [headerCells, ...bodyRows] = rows;
	const firstCol = 2702;
	const nCol = 700;
	const typeCol = 662;
	const columnWidths = [firstCol, nCol, ...headerCells.slice(2).map(() => typeCol)];
	const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
	const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
	const borders = { top: border, bottom: border, left: border, right: border };

	const cell = (raw, index, { header = false, keep = true } = {}) => {
		const bold = header || /^\*\*.*\*\*$/.test(raw);
		return new TableCell({
			width: { size: columnWidths[index], type: WidthType.DXA },
			borders,
			shading: header ? { type: ShadingType.CLEAR, color: 'auto', fill: 'EDEDED' } : undefined,
			margins: { top: 60, bottom: 60, left: 80, right: 80 },
			children: [
				new Paragraph({
					alignment: index === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
					keepNext: keep,
					children: [new TextRun({ text: stripMarks(raw), font: HEAD_FONT, size: 17, bold })]
				})
			]
		});
	};

	return new Table({
		width: { size: tableWidth, type: WidthType.DXA },
		columnWidths,
		rows: [
			new TableRow({
				tableHeader: true,
				cantSplit: true,
				children: headerCells.map((c, i) => cell(c, i, { header: true }))
			}),
			...bodyRows.map(
				(cells, r) =>
					new TableRow({
						cantSplit: true,
						children: cells.map((c, i) => cell(c, i, { keep: r < bodyRows.length - 1 }))
					})
			)
		]
	});
}

// Parse the markdown into blocks.
const children = [];
let section = '';
let seenDek = false;
let wordCount = 0;
const countWords = (text) => (wordCount += stripMarks(text).split(/\s+/).filter(Boolean).length);
const heading = (text, level, size, before, after) =>
	new Paragraph({
		heading: level,
		spacing: { before, after },
		keepNext: true,
		children: [
			new TextRun({ text: smart(text), font: HEAD_FONT, size, bold: true, color: '1F1F1F' })
		]
	});

for (const raw of md.split(/\n\s*\n/)) {
	const block = raw.trim();
	if (!block) continue;

	if (block.startsWith('# ')) {
		children.push(heading(block.slice(2), HeadingLevel.TITLE, 34, 0, 120));
	} else if (block.startsWith('## ')) {
		section = block.slice(3);
		children.push(heading(section, HeadingLevel.HEADING_1, 28, 360, 120));
	} else if (block.startsWith('### ')) {
		children.push(heading(block.slice(4), HeadingLevel.HEADING_2, 24, 240, 80));
	} else if (block.startsWith('![')) {
		const [, alt, file] = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
		children.push(figureImage(file, alt));
	} else if (/^\*Figure \d+\./.test(block)) {
		children.push(caption(block));
	} else if (/^\*Table \d+\./.test(block)) {
		children.push(caption(block, { keepNext: true, before: 360 }));
	} else if (block.startsWith('|')) {
		children.push(table(block.split('\n')));
	} else if (!seenDek && /^\*[^*].*\*$/.test(block)) {
		seenDek = true;
		children.push(
			new Paragraph({
				spacing: { after: 120 },
				children: inline(block.slice(1, -1), { italics: true, size: 26, color: '444444' })
			})
		);
	} else if (block.startsWith('By ')) {
		children.push(
			new Paragraph({
				spacing: { after: 360 },
				border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BFBFBF', space: 8 } },
				children: inline(block, { bold: true })
			})
		);
	} else if (block.startsWith('- ')) {
		const sources = section === 'Sources';
		for (const line of block.split('\n')) {
			const text = line.replace(/^- /, '');
			if (!sources) countWords(text);
			children.push(
				new Paragraph({
					numbering: { reference: 'bullets', level: 0 },
					spacing: { after: sources ? 80 : 100, line: sources ? 260 : 300 },
					children: inline(text, sources ? { size: 20 } : {})
				})
			);
		}
	} else {
		const text = block.replace(/\n/g, ' ');
		if (section !== 'Sources' && section !== 'About the author') countWords(text);
		children.push(new Paragraph({ children: inline(text), spacing: { after: 160, line: 300 } }));
	}
}

const doc = new Document({
	creator: 'DJ Wayne',
	title: stripMarks(md.match(/^# (.+)$/m)[1]),
	description: 'Submission draft for Enneagram Monthly',
	styles: { default: { document: { run: { font: BODY_FONT, size: 22 } } } },
	numbering: {
		config: [
			{
				reference: 'bullets',
				levels: [
					{
						level: 0,
						format: LevelFormat.BULLET,
						text: '•',
						alignment: AlignmentType.LEFT,
						style: { paragraph: { indent: { left: 540, hanging: 270 } } }
					}
				]
			}
		]
	},
	sections: [
		{
			properties: {
				page: {
					size: { width: 12240, height: 15840 },
					margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
				}
			},
			footers: {
				default: new Footer({
					children: [
						new Paragraph({
							alignment: AlignmentType.CENTER,
							children: [
								new TextRun({
									text: 'DJ Wayne · dj@9takes.com · page ',
									font: HEAD_FONT,
									size: 16,
									color: '777777'
								}),
								new TextRun({
									children: [PageNumber.CURRENT],
									font: HEAD_FONT,
									size: 16,
									color: '777777'
								})
							]
						})
					]
				})
			},
			children
		}
	]
});

const out = path.join(HERE, `${SLUG}.docx`);
Packer.toBuffer(doc).then((buffer) => {
	fs.writeFileSync(out, buffer);
	console.log(`wrote ${out} (${wordCount} words of body text)`);
});
