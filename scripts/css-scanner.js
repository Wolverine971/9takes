// scripts/css-scanner.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import chalk from 'chalk';

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Dynamically import dependencies
const globImport = await import('glob');
const glob = globImport.glob || globImport.default;

const postcssImport = await import('postcss');
const postcss = postcssImport.default;

const scssSyntaxImport = await import('postcss-scss');
const scssSyntax = scssSyntaxImport.default;

// Configuration
const CONFIG = {
	// Adjust these paths based on your SvelteKit project structure
	cssGlob: 'src/**/*.{css,scss,sass,less}',
	svelteGlob: 'src/**/*.svelte',
	jsGlob: 'src/**/*.{js,ts,jsx,tsx}',

	// Tailwind class patterns to ignore
	tailwindPatterns: [
		// Layout
		/^(container|block|inline(-block)?|flex|grid|table|contents|hidden|visible)$/,
		// Flexbox & Grid
		/^(flex|grid)-(row|col|wrap|nowrap|1|auto|initial|none|grow|shrink)$/,
		/^(justify|items|content|self|place)-(start|end|center|between|around|evenly|stretch)$/,
		/^(order|col|row)-[\w-]+$/,
		/^gap(-[xy])?-[\w-]+$/,
		// Spacing
		/^[mp][trblxy]?-[\w-]+$/,
		// Sizing
		/^[wh]-[\w-]+$/,
		/^(min|max)-[wh]-[\w-]+$/,
		// Typography
		/^text-[\w-]+$/,
		/^(font|tracking|leading|align)-[\w-]+$/,
		/^(uppercase|lowercase|capitalize|normal-case)$/,
		/^(font|tracking|leading|align|text|whitespace|break|hyphens|list|indent|align)-[\w-]+$/,
		// Backgrounds
		/^bg-[\w-]+$/,
		// Borders
		/^(border|rounded)(-[trblxy])?(-[\w-]+)?$/,
		// Effects
		/^(shadow|opacity|blur|brightness|contrast|grayscale|invert|saturate|sepia)-[\w-]+$/,
		// Transitions & Animation
		/^(transition|duration|ease|delay|animate)-[\w-]+$/,
		// Transforms
		/^(scale|rotate|translate|skew)-[\w-]+$/,
		// Interactivity
		/^(cursor|select|resize|scroll)-[\w-]+$/,
		// SVG
		/^(fill|stroke)-[\w-]+$/,
		// State variants
		/^(hover|focus|active|disabled|visited|group-hover|focus-within|focus-visible|motion-safe|motion-reduce|first|last|odd|even|children|siblings):/,
		// Responsive variants
		/^(sm|md|lg|xl|2xl):/,
		// Dark mode
		/^dark:/,
		// Arbitrary values
		/^\[.+\]$/
	],

	// Add additional non-Tailwind patterns to ignore
	otherIgnorePatterns: [
		// Bootstrap common patterns
		/^(btn|form|nav|card|alert|badge|modal|container|row|col|d|text|bg|border|rounded|justify|align|flex|float|position|w|h|m|p|shadow|fade)-[\w-]+$/,
		// General utility class patterns
		/^(clearfix|invisible|sr-only|sticky|fixed)$/,
		// CSS component libraries often use these patterns
		/^(is|has)-[\w-]+$/
	],

	outputReportJson: 'unused-css-report.json',
	outputReportHtml: 'unused-css-report.html',
	// Track file origins for better reporting
	trackOrigins: true
};

// Function to check if a class name is a Tailwind utility class
function isTailwindClass(className) {
	return CONFIG.tailwindPatterns.some((pattern) => pattern.test(className));
}

// Function to check if a class should be ignored (Tailwind or other ignored patterns)
function shouldIgnoreClass(className) {
	return (
		isTailwindClass(className) ||
		CONFIG.otherIgnorePatterns.some((pattern) => pattern.test(className))
	);
}

// Function to extract all CSS selectors from stylesheets
async function extractCssSelectors() {
	console.log(chalk.blue('Scanning CSS and SCSS files...'));
	const cssFiles = glob.sync(CONFIG.cssGlob);

	let allSelectors = new Map(); // Using Map to track selectors and their origins

	for (const file of cssFiles) {
		try {
			const css = fs.readFileSync(file, 'utf8');
			// Use specific syntax for SCSS files
			const syntax = file.endsWith('.scss') || file.endsWith('.sass') ? scssSyntax : null;

			// Parse the CSS file
			const root = postcss.parse(css, { from: file, syntax });

			// Extract class selectors
			root.walkRules((rule) => {
				if (rule.parent?.type === 'atrule' && rule.parent?.name === 'keyframes') {
					// Skip keyframe selectors
					return;
				}

				const selectors = rule.selector
					.split(',')
					.map((s) => s.trim())
					.filter((s) => s.startsWith('.')) // Only class selectors
					.map((s) => {
						// Extract the class name by removing the dot and any pseudo-elements/classes
						// This regex handles more complex selectors
						const match = s.match(/^\.([a-zA-Z0-9_-]+)(?:[:.[#].*)?$/);
						return match ? match[1] : null;
					})
					.filter(Boolean);

				selectors.forEach((selector) => {
					if (!shouldIgnoreClass(selector)) {
						// Store the selector with its file origin
						if (!allSelectors.has(selector)) {
							allSelectors.set(selector, {
								origins: [{ file, line: rule.source?.start?.line || 0 }],
								selector: rule.selector
							});
						} else {
							allSelectors.get(selector).origins.push({
								file,
								line: rule.source?.start?.line || 0
							});
						}
					}
				});
			});
		} catch (error) {
			console.error(chalk.red(`Error processing ${file}:`), error.message);
		}
	}

	console.log(
		chalk.green(
			`Found ${allSelectors.size} unique CSS class selectors (excluding Tailwind utilities)`
		)
	);
	return allSelectors;
}

// Function to find all class usages in Svelte components and JS files
async function findClassUsages() {
	console.log(chalk.blue('Scanning Svelte and JS files for class usages...'));
	const svelteFiles = glob.sync(CONFIG.svelteGlob);
	const jsFiles = glob.sync(CONFIG.jsGlob);
	const allFiles = [...svelteFiles, ...jsFiles];

	let usedClasses = new Map(); // Using Map to track usage locations
	let tailwindClassCounter = 0;

	// Regular expressions to match class usages in different contexts
	const patterns = [
		// class="foo bar" or className="foo bar"
		{ regex: /class(?:Name)?=["'`]([^"'`]+)["'`]/g, type: 'attribute' },

		// class:foo={condition}
		{ regex: /class:([a-zA-Z0-9_-]+)(?:=|\s)/g, type: 'directive' },

		// classList.add('foo')
		{ regex: /classList\.(?:add|toggle|replace)\(["'`]([^"'`]+)["'`]/g, type: 'js-method' },

		// Additional pattern for template literals and string concatenation
		{ regex: /(?:class|className)=`[^`]*\${([^}]+)}[^`]*`/g, type: 'template-literal' },

		// Dynamic classes in Svelte's class directive
		{ regex: /class:([a-zA-Z0-9_-]+)=/g, type: 'svelte-directive' }
	];

	for (const file of allFiles) {
		try {
			const content = fs.readFileSync(file, 'utf8');
			const lines = content.split('\n');

			// Apply each regex pattern to find class names
			for (const { regex, type } of patterns) {
				// Reset lastIndex for each file to avoid issues with global regexes
				regex.lastIndex = 0;

				let match;
				while ((match = regex.exec(content)) !== null) {
					if (match[1]) {
						// Find the line number for this match
						const matchPosition = match.index;
						let lineNumber = 0;
						let currentPos = 0;

						for (let i = 0; i < lines.length; i++) {
							currentPos += lines[i].length + 1; // +1 for the newline
							if (currentPos > matchPosition) {
								lineNumber = i + 1;
								break;
							}
						}

						// Split multiple classes if space-separated
						const classes = match[1].split(/\s+/);
						classes.forEach((cls) => {
							cls = cls.trim();
							if (cls && !cls.includes('{') && !cls.includes('$')) {
								// Check if this is a Tailwind class
								if (isTailwindClass(cls)) {
									tailwindClassCounter++;
									return; // Skip tracking this class
								}

								if (shouldIgnoreClass(cls)) {
									return; // Skip other ignored classes
								}

								if (!usedClasses.has(cls)) {
									usedClasses.set(cls, []);
								}

								usedClasses.get(cls).push({
									file,
									line: lineNumber,
									type
								});
							}
						});
					}
				}
			}
		} catch (error) {
			console.error(chalk.red(`Error reading ${file}:`), error.message);
		}
	}

	console.log(
		chalk.green(`Found ${usedClasses.size} used CSS class names (excluding Tailwind utilities)`)
	);
	console.log(
		chalk.blue(`Skipped approximately ${tailwindClassCounter} Tailwind utility class usages`)
	);
	return usedClasses;
}

// Generate HTML report
function generateHtmlReport(report) {
	const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unused CSS Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .summary {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }
    .summary-card {
      flex: 1;
      min-width: 200px;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .summary-card.total {
      background-color: #e3f2fd;
    }
    .summary-card.used {
      background-color: #e8f5e9;
    }
    .summary-card.unused {
      background-color: #ffebee;
    }
    .summary-card h2 {
      margin-top: 0;
      font-size: 16px;
      color: #555;
    }
    .summary-card .number {
      font-size: 32px;
      font-weight: bold;
    }
    .file-path {
      font-family: monospace;
      background-color: #f5f5f5;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f8f9fa;
    }
    tr:nth-child(even) {
      background-color: #f5f5f5;
    }
    .search-container {
      margin-bottom: 20px;
    }
    #searchInput {
      padding: 8px;
      width: 300px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    .toggle-btn {
      background-color: #4CAF50;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }
    .toggle-btn:hover {
      background-color: #45a049;
    }
    .selector-info {
      font-family: monospace;
      background-color: #f8f8f8;
      padding: 5px;
      border-left: 3px solid #2196F3;
      margin: 5px 0;
    }
    .hidden {
      display: none;
    }
    .progress-container {
      height: 20px;
      background-color: #f5f5f5;
      border-radius: 10px;
      margin: 30px 0;
    }
    .progress-bar {
      height: 100%;
      border-radius: 10px;
      background-color: #4caf50;
      text-align: center;
      line-height: 20px;
      color: white;
      font-weight: bold;
    }
    .note {
      background-color: #fff3e0;
      padding: 10px;
      border-left: 4px solid #ff9800;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>Unused CSS Report</h1>
  
  <div class="note">
    <strong>Note:</strong> This report excludes Tailwind CSS utility classes and other common utility patterns.
  </div>
  
  <div class="progress-container">
    <div class="progress-bar" style="width: ${100 - report.unusedPercentage}%">
      ${100 - report.unusedPercentage}% Used
    </div>
  </div>

  <div class="summary">
    <div class="summary-card total">
      <h2>Total CSS Classes</h2>
      <div class="number">${report.totalSelectors}</div>
    </div>
    <div class="summary-card used">
      <h2>Used Classes</h2>
      <div class="number">${report.usedSelectors}</div>
    </div>
    <div class="summary-card unused">
      <h2>Unused Classes</h2>
      <div class="number">${report.unusedSelectors} (${report.unusedPercentage}%)</div>
    </div>
  </div>

  <div class="search-container">
    <input type="text" id="searchInput" placeholder="Search for classes..." onkeyup="filterTable()">
    <button class="toggle-btn" onclick="toggleUnusedClasses()">Show/Hide Unused Classes</button>
    <button class="toggle-btn" onclick="toggleUsedClasses()">Show/Hide Used Classes</button>
  </div>

  <h2>Class Usage Details</h2>
  <table id="classTable">
    <thead>
      <tr>
        <th>Class Name</th>
        <th>Status</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      ${report.detailedClasses
				.map(
					(cls) => `
        <tr class="${cls.used ? 'used-class' : 'unused-class'}">
          <td>${cls.name}</td>
          <td>${
						cls.used
							? '<span style="color: green;">Used</span>'
							: '<span style="color: red;">Unused</span>'
					}</td>
          <td>
            ${
							cls.used
								? `<strong>Used in ${cls.usages.length} location(s):</strong><br>` +
									cls.usages
										.slice(0, 3)
										.map(
											(usage) =>
												`<div class="file-path">${path.relative('.', usage.file)}:${usage.line}</div>`
										)
										.join('') +
									(cls.usages.length > 3 ? `<div>...and ${cls.usages.length - 3} more</div>` : '')
								: `<strong>Defined in:</strong><br>` +
									cls.origins
										.map(
											(origin) =>
												`<div class="file-path">${path.relative('.', origin.file)}:${origin.line}</div>
                 <div class="selector-info">${cls.selector || ''}</div>`
										)
										.join('')
						}
          </td>
        </tr>
      `
				)
				.join('')}
    </tbody>
  </table>

  <script>
    function filterTable() {
      const input = document.getElementById('searchInput');
      const filter = input.value.toLowerCase();
      const table = document.getElementById('classTable');
      const rows = table.getElementsByTagName('tr');

      for (let i = 1; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[0];
        if (nameCell) {
          const text = nameCell.textContent || nameCell.innerText;
          if (text.toLowerCase().indexOf(filter) > -1) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      }
    }

    function toggleUnusedClasses() {
      const rows = document.getElementsByClassName('unused-class');
      for (let row of rows) {
        row.classList.toggle('hidden');
      }
    }

    function toggleUsedClasses() {
      const rows = document.getElementsByClassName('used-class');
      for (let row of rows) {
        row.classList.toggle('hidden');
      }
    }
  </script>
</body>
</html>
  `;

	return htmlTemplate;
}

// Main function
async function findUnusedCss() {
	try {
		console.log(chalk.bold('\n=== SvelteKit Unused CSS Scanner ===\n'));
		console.log(
			chalk.blue(
				'Note: Tailwind utility classes and other common utilities will be automatically excluded'
			)
		);

		// Extract all CSS selectors and find all class usages
		const allSelectors = await extractCssSelectors();
		const usedClasses = await findClassUsages();

		// Find unused selectors
		const unusedSelectors = new Set(
			[...allSelectors.keys()].filter((selector) => !usedClasses.has(selector))
		);

		// Prepare detailed class information for reporting
		const detailedClasses = [];

		// Add unused classes first
		for (const selector of unusedSelectors) {
			const selectorInfo = allSelectors.get(selector);
			detailedClasses.push({
				name: selector,
				used: false,
				origins: selectorInfo.origins,
				selector: selectorInfo.selector
			});
		}

		// Add used classes
		for (const [className, usages] of usedClasses.entries()) {
			if (allSelectors.has(className)) {
				const selectorInfo = allSelectors.get(className);
				detailedClasses.push({
					name: className,
					used: true,
					usages,
					origins: selectorInfo.origins,
					selector: selectorInfo.selector
				});
			} else {
				// This is a class that's used but not defined in CSS files
				// (might be from an external library or dynamically generated)
				detailedClasses.push({
					name: className,
					used: true,
					usages,
					origins: [],
					notes: 'Used but not defined in scanned CSS files'
				});
			}
		}

		// Sort classes alphabetically
		detailedClasses.sort((a, b) => a.name.localeCompare(b.name));

		// Generate report
		const report = {
			totalSelectors: allSelectors.size,
			usedSelectors: usedClasses.size,
			unusedSelectors: unusedSelectors.size,
			unusedList: [...unusedSelectors].sort(),
			unusedPercentage: Math.round((unusedSelectors.size / allSelectors.size) * 100) || 0,
			detailedClasses
		};

		// Write JSON report
		fs.writeFileSync(CONFIG.outputReportJson, JSON.stringify(report, null, 2));

		// Generate and write HTML report
		const htmlReport = generateHtmlReport(report);
		fs.writeFileSync(CONFIG.outputReportHtml, htmlReport);

		// Print summary
		console.log(chalk.bold('\n--- UNUSED CSS REPORT ---'));
		console.log(chalk.blue(`Total CSS classes (excluding Tailwind): ${report.totalSelectors}`));
		console.log(chalk.green(`Used CSS classes: ${report.usedSelectors}`));
		console.log(
			chalk.red(`Unused CSS classes: ${report.unusedSelectors} (${report.unusedPercentage}%)`)
		);
		console.log(chalk.blue(`\nFull reports written to:`));
		console.log(chalk.blue(`- JSON: ${CONFIG.outputReportJson}`));
		console.log(chalk.blue(`- HTML: ${CONFIG.outputReportHtml}`));

		// If there are too many unused selectors, just show a sample
		if (report.unusedList.length > 10) {
			console.log(chalk.yellow(`\nSample of unused classes:`));
			report.unusedList.slice(0, 10).forEach((selector) => {
				console.log(`- ${selector}`);
			});
			console.log(chalk.yellow(`... and ${report.unusedList.length - 10} more.`));
		} else if (report.unusedList.length > 0) {
			console.log(chalk.yellow(`\nAll unused classes:`));
			report.unusedList.forEach((selector) => {
				console.log(`- ${selector}`);
			});
		}

		console.log(chalk.bold('\nOpen the HTML report in your browser for an interactive view.'));
	} catch (error) {
		console.error(chalk.red('Error:'), error);
	}
}

// Run the scanner
findUnusedCss();
