// scripts/unused-css.js
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
	// Paths to scan
	cssGlob: 'src/**/*.{css,scss,sass}',
	svelteGlob: 'src/**/*.svelte',
	jsGlob: 'src/**/*.{js,ts,jsx,tsx}',

	// Output files
	outputReportJson: 'unused-selectors-report.json',
	outputReportHtml: 'unused-selectors-report.html',

	// Patterns to ignore
	ignoreSelectors: [
		// Common reset/normalize selectors
		/^(html|body|:root|main|h[1-6]|p|a|ul|ol|li|dl|dt|dd|blockquote|figure|figcaption|header|footer|article|section|aside|nav|form|fieldset|legend|input|button|textarea|select|option|table|tr|td|th|code|pre|img|svg|video|audio|canvas|iframe)$/,
		// Commonly targeted pseudo-classes/elements
		/^(:hover|:focus|:active|:visited|:disabled|:checked|:first-child|:last-child|:nth-child|:before|:after|::before|::after|::placeholder)$/
	],

	// Extended selectors to explore (combinations, attributes, etc.)
	includeCombinatorSelectors: true,
	includeAttributeSelectors: true,
	includePseudoClasses: true,

	// Look for dynamic class usage in JS/TS files
	scanJsFiles: true,

	// Look for Svelte CSS within <style> tags in addition to imported CSS files
	scanSvelteStyles: true,

	// Timeout in ms for processing large files
	timeout: 30000,

	// Max number of detailed results to show in console
	maxConsoleResults: 15
};

// Initialize counters
let totalSelectorsFound = 0;
let totalUnusedSelectors = 0;
let complexSelectorsSkipped = 0;

// Stores for all the selectors and their usage data
let allCssSelectors = new Map(); // Maps selector text -> { type, origins, etc. }
let usedSelectors = new Set(); // Set of all selectors found in use

// Function to normalize a selector for consistency
function normalizeSelector(selector) {
	return selector.trim().replace(/\s+/g, ' ');
}

// Function to extract all selectors from a CSS/SCSS file
async function extractSelectorsFromFile(file) {
	try {
		const css = fs.readFileSync(file, 'utf8');
		const syntax = file.endsWith('.scss') || file.endsWith('.sass') ? scssSyntax : null;

		// Parse the CSS file
		const root = postcss.parse(css, { from: file, syntax });

		// Extract all rule selectors
		root.walkRules((rule) => {
			// Skip keyframe selectors
			if (rule.parent?.type === 'atrule' && rule.parent?.name === 'keyframes') {
				return;
			}

			// Split combined selectors and process each one
			const individualSelectors = rule.selector.split(',').map((s) => normalizeSelector(s));

			for (const selector of individualSelectors) {
				processSelector(selector, file, rule);
			}
		});
	} catch (error) {
		console.error(chalk.red(`Error processing ${file}:`), error.message);
	}
}

// Function to process a single selector and add it to our data store
function processSelector(selector, file, rule) {
	// Skip the selector if it's in the ignore list
	if (CONFIG.ignoreSelectors.some((pattern) => pattern.test(selector))) {
		return;
	}

	// Categorize the selector
	let type = 'unknown';
	let name = selector;

	// Class selector (.my-class)
	if (selector.startsWith('.')) {
		type = 'class';
		name =
			selector
				.substring(1)
				.split(/[:.#[]/)
				.shift() || '';
	}
	// ID selector (#my-id)
	else if (selector.startsWith('#')) {
		type = 'id';
		name = selector.substring(1).split(/[:.[]/).shift() || '';
	}
	// Element selector (div, span, etc.)
	else if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(selector)) {
		type = 'element';
		name = selector;
	}
	// Combinator selector (div > span, .class1 .class2, etc.)
	else if (
		selector.includes(' ') ||
		selector.includes('>') ||
		selector.includes('+') ||
		selector.includes('~')
	) {
		type = 'combinator';
		// For combinators, we still want to track the individual classes/IDs
		const classMatches = selector.match(/\.[a-zA-Z0-9_-]+/g);
		const idMatches = selector.match(/#[a-zA-Z0-9_-]+/g);

		// Process each class in the combinator
		if (classMatches) {
			for (const classSelector of classMatches) {
				const className = classSelector.substring(1);
				if (!CONFIG.ignoreSelectors.some((pattern) => pattern.test(className))) {
					trackSelector(`.${className}`, 'class', className, file, rule, selector);
				}
			}
		}

		// Process each ID in the combinator
		if (idMatches) {
			for (const idSelector of idMatches) {
				const idName = idSelector.substring(1);
				if (!CONFIG.ignoreSelectors.some((pattern) => pattern.test(idName))) {
					trackSelector(`#${idName}`, 'id', idName, file, rule, selector);
				}
			}
		}

		// Only track the full combinator if the option is enabled
		if (!CONFIG.includeCombinatorSelectors) {
			return;
		}
	}
	// Attribute selector ([data-attribute], input[type="text"], etc.)
	else if (selector.includes('[') && selector.includes(']')) {
		type = 'attribute';

		// Try to extract any classes or IDs from the attribute selector
		const classMatch = selector.match(/\.([a-zA-Z0-9_-]+)/);
		const idMatch = selector.match(/#([a-zA-Z0-9_-]+)/);

		if (classMatch) {
			trackSelector(`.${classMatch[1]}`, 'class', classMatch[1], file, rule, selector);
		}
		if (idMatch) {
			trackSelector(`#${idMatch[1]}`, 'id', idMatch[1], file, rule, selector);
		}

		// Only track the full attribute selector if the option is enabled
		if (!CONFIG.includeAttributeSelectors) {
			return;
		}
	}
	// Pseudo-class/element selector (:hover, ::before, etc.)
	else if (selector.includes(':')) {
		type = 'pseudo';

		// Try to extract the base selector before the pseudo-class/element
		const baseMatch = selector.match(/([.#]?[a-zA-Z0-9_-]+):/);
		if (baseMatch) {
			const baseSelector = baseMatch[1];
			// If it's a class or ID, track it
			if (baseSelector.startsWith('.')) {
				trackSelector(baseSelector, 'class', baseSelector.substring(1), file, rule, selector);
			} else if (baseSelector.startsWith('#')) {
				trackSelector(baseSelector, 'id', baseSelector.substring(1), file, rule, selector);
			}
		}

		// Only track the full pseudo selector if the option is enabled
		if (!CONFIG.includePseudoClasses) {
			return;
		}
	}

	// Track the selector in our data store
	trackSelector(selector, type, name, file, rule);
}

// Function to add a selector to our tracking Map
function trackSelector(selector, type, name, file, rule, parentSelector = null) {
	// Skip empty selectors
	if (!name || name.trim() === '') {
		return;
	}

	totalSelectorsFound++;

	// Add to the data store or update existing record
	if (!allCssSelectors.has(selector)) {
		allCssSelectors.set(selector, {
			type,
			name,
			origins: [
				{
					file,
					line: rule.source?.start?.line || 0,
					column: rule.source?.start?.column || 0,
					parentSelector
				}
			],
			declaration: rule.toString()
		});
	} else {
		// Add another origin if this selector appears in multiple places
		const existingData = allCssSelectors.get(selector);
		existingData.origins.push({
			file,
			line: rule.source?.start?.line || 0,
			column: rule.source?.start?.column || 0,
			parentSelector
		});
	}
}

// Function to scan a Svelte file for HTML/JSX to find selector usage
async function scanSvelteFile(file) {
	try {
		const content = fs.readFileSync(file, 'utf8');
		const lines = content.split('\n');

		// Extract selectors used in the file
		const foundClasses = findClassesInHtml(content);
		const foundIds = findIdsInHtml(content);

		// Add to the used selectors set
		for (const className of foundClasses) {
			usedSelectors.add(`.${className}`);
		}

		for (const id of foundIds) {
			usedSelectors.add(`#${id}`);
		}

		// If configured, also scan <style> tags in Svelte files
		if (CONFIG.scanSvelteStyles) {
			const styleTagMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
			if (styleTagMatches) {
				for (const styleTag of styleTagMatches) {
					// Extract just the CSS content
					const cssContent = styleTag.replace(/<style[^>]*>/, '').replace(/<\/style>/, '');

					// Create a temporary file name for processing
					const tempFileName = `${file}:style`;

					try {
						// Parse the CSS content and extract selectors
						const root = postcss.parse(cssContent, { from: tempFileName });

						root.walkRules((rule) => {
							// Skip keyframe selectors
							if (rule.parent?.type === 'atrule' && rule.parent?.name === 'keyframes') {
								return;
							}

							// Split combined selectors and process each one
							const individualSelectors = rule.selector.split(',').map((s) => normalizeSelector(s));

							for (const selector of individualSelectors) {
								processSelector(selector, tempFileName, rule);
							}
						});
					} catch (error) {
						console.error(chalk.red(`Error processing <style> in ${file}:`), error.message);
					}
				}
			}
		}
	} catch (error) {
		console.error(chalk.red(`Error scanning ${file}:`), error.message);
	}
}

// Function to find all classes in HTML content
function findClassesInHtml(content) {
	const foundClasses = new Set();

	// Match class="value" and className="value" patterns
	const classAttributePattern = /class(?:Name)?=["'`]([^"'`]+)["'`]/g;
	let match;
	while ((match = classAttributePattern.exec(content))) {
		if (match[1]) {
			const classes = match[1].split(/\s+/);
			for (const cls of classes) {
				foundClasses.add(cls.trim());
			}
		}
	}

	// Match Svelte's class:name={value} pattern
	const svelteClassPattern = /class:([a-zA-Z0-9_-]+)(?:=|\s)/g;
	while ((match = svelteClassPattern.exec(content))) {
		if (match[1]) {
			foundClasses.add(match[1].trim());
		}
	}

	return foundClasses;
}

// Function to find all IDs in HTML content
function findIdsInHtml(content) {
	const foundIds = new Set();

	// Match id="value" pattern
	const idAttributePattern = /id=["'`]([^"'`]+)["'`]/g;
	let match;
	while ((match = idAttributePattern.exec(content))) {
		if (match[1]) {
			foundIds.add(match[1].trim());
		}
	}

	return foundIds;
}

// Function to scan a JS/TS file for dynamic class usage
async function scanJsFile(file) {
	if (!CONFIG.scanJsFiles) return;

	try {
		const content = fs.readFileSync(file, 'utf8');

		// Look for common patterns of using classes in JS
		const patterns = [
			// document.querySelector('.class-name')
			/querySelector(?:All)?\(["'`]\.([a-zA-Z0-9_-]+)["'`]\)/g,

			// element.classList.add('class-name')
			/classList\.(?:add|toggle|replace|contains)\(["'`]([a-zA-Z0-9_-]+)["'`]\)/g,

			// className = 'class-name'
			/className\s*=\s*["'`]([^"'`]+)["'`]/g,

			// element.id = 'id-name'
			/\.id\s*=\s*["'`]([a-zA-Z0-9_-]+)["'`]/g,

			// document.getElementById('id-name')
			/getElementById\(["'`]([a-zA-Z0-9_-]+)["'`]\)/g
		];

		for (const pattern of patterns) {
			let match;
			while ((match = pattern.exec(content))) {
				if (match[1]) {
					if (pattern.toString().includes('class')) {
						// For class patterns
						const classes = match[1].split(/\s+/);
						for (const cls of classes) {
							usedSelectors.add(`.${cls.trim()}`);
						}
					} else {
						// For ID patterns
						usedSelectors.add(`#${match[1].trim()}`);
					}
				}
			}
		}
	} catch (error) {
		console.error(chalk.red(`Error scanning JS file ${file}:`), error.message);
	}
}

// Helper function to relativize file paths for the report
function relativizePath(filePath) {
	return path.relative(process.cwd(), filePath);
}

// Function to generate the HTML report
function generateHtmlReport(reportData) {
	const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unused CSS Selectors Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
    .controls {
      margin: 20px 0;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .search-container {
      flex-grow: 1;
    }
    #searchInput {
      padding: 8px;
      width: 100%;
      max-width: 400px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    .button-group {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }
    .toggle-btn {
      background-color: #4CAF50;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .toggle-btn:hover {
      background-color: #45a049;
    }
    .toggle-btn.secondary {
      background-color: #2196F3;
    }
    .toggle-btn.secondary:hover {
      background-color: #0b7dda;
    }
    .file-path {
      font-family: monospace;
      background-color: #f5f5f5;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 14px;
      word-break: break-all;
    }
    .selector {
      font-family: monospace;
      font-weight: bold;
    }
    .css-preview {
      font-family: monospace;
      background-color: #f8f8f8;
      padding: 10px;
      border-left: 3px solid #2196F3;
      margin: 5px 0;
      white-space: pre-wrap;
      overflow-x: auto;
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
      position: sticky;
      top: 0;
      z-index: 10;
    }
    tr:nth-child(even) {
      background-color: #f5f5f5;
    }
    .selector-type {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
      text-transform: uppercase;
    }
    .selector-type.class {
      background-color: #4CAF50;
    }
    .selector-type.id {
      background-color: #2196F3;
    }
    .selector-type.element {
      background-color: #ff9800;
    }
    .selector-type.combinator {
      background-color: #9c27b0;
    }
    .selector-type.pseudo {
      background-color: #607d8b;
    }
    .selector-type.attribute {
      background-color: #e91e63;
    }
    .selector-type.unknown {
      background-color: #9e9e9e;
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
    .expand-btn {
      background: none;
      border: none;
      color: #2196F3;
      cursor: pointer;
      padding: 5px;
      margin-top: 5px;
      font-weight: bold;
    }
    .expand-btn:hover {
      text-decoration: underline;
    }
    .details-container {
      margin-top: 10px;
    }
    .filter-label {
      margin-right: 10px;
      font-weight: bold;
    }
    #typeFilter {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>Unused CSS Selectors Report</h1>
  
  <div class="progress-container">
    <div class="progress-bar" style="width: ${reportData.usedPercentage}%">
      ${reportData.usedPercentage}% Used
    </div>
  </div>

  <div class="summary">
    <div class="summary-card total">
      <h2>Total Selectors</h2>
      <div class="number">${reportData.totalSelectors}</div>
    </div>
    <div class="summary-card used">
      <h2>Used Selectors</h2>
      <div class="number">${reportData.usedSelectors}</div>
    </div>
    <div class="summary-card unused">
      <h2>Unused Selectors</h2>
      <div class="number">${reportData.unusedSelectors} (${reportData.unusedPercentage}%)</div>
    </div>
  </div>

  <div class="controls">
    <div class="search-container">
      <input type="text" id="searchInput" placeholder="Search for selectors..." onkeyup="filterTable()">
    </div>
    
    <div>
      <label for="typeFilter" class="filter-label">Filter by type:</label>
      <select id="typeFilter" onchange="filterTable()">
        <option value="all">All Types</option>
        <option value="class">Classes</option>
        <option value="id">IDs</option>
        <option value="element">Elements</option>
        <option value="combinator">Combinators</option>
        <option value="pseudo">Pseudo</option>
        <option value="attribute">Attributes</option>
      </select>
    </div>
    
    <div class="button-group">
      <button class="toggle-btn" onclick="toggleUnusedSelectors()">Toggle Unused</button>
      <button class="toggle-btn secondary" onclick="expandAllDetails()">Expand All</button>
      <button class="toggle-btn secondary" onclick="collapseAllDetails()">Collapse All</button>
    </div>
  </div>

  <h2>Selector Details</h2>
  <table id="selectorTable">
    <thead>
      <tr>
        <th>Selector</th>
        <th>Type</th>
        <th>Status</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      ${reportData.selectors
				.map(
					(selector, index) => `
        <tr class="${selector.used ? 'used-selector' : 'unused-selector'}" data-type="${selector.type}">
          <td>
            <span class="selector">${selector.selector}</span>
          </td>
          <td>
            <span class="selector-type ${selector.type}">${selector.type}</span>
          </td>
          <td>
            ${
							selector.used
								? '<span style="color: green; font-weight: bold;">Used</span>'
								: '<span style="color: red; font-weight: bold;">Unused</span>'
						}
          </td>
          <td>
            <div>
              <strong>Defined in:</strong> 
              ${
								selector.origins.length > 1
									? `<span>${selector.origins.length} locations</span>`
									: `<span class="file-path">${selector.origins[0].file}:${selector.origins[0].line}</span>`
							}
              
              <button class="expand-btn" onclick="toggleDetails(${index})">
                Show Details
              </button>
              
              <div id="details-${index}" class="details-container hidden">
                ${selector.origins
									.map(
										(origin) => `
                  <div>
                    <div class="file-path">${origin.file}:${origin.line}</div>
                    ${
											origin.parentSelector
												? `<div>Part of selector: <code>${origin.parentSelector}</code></div>`
												: ''
										}
                    <div class="css-preview">${selector.declaration.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                  </div>
                `
									)
									.join('<hr>')}
              </div>
            </div>
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
      const typeFilter = document.getElementById('typeFilter').value;
      const table = document.getElementById('selectorTable');
      const rows = table.getElementsByTagName('tr');

      for (let i = 1; i < rows.length; i++) {
        const selectorCell = rows[i].cells[0];
        const rowType = rows[i].getAttribute('data-type');
        
        let displayRow = true;
        
        // Check text filter
        if (filter) {
          const text = selectorCell.textContent || selectorCell.innerText;
          if (text.toLowerCase().indexOf(filter) === -1) {
            displayRow = false;
          }
        }
        
        // Check type filter
        if (typeFilter !== 'all' && rowType !== typeFilter) {
          displayRow = false;
        }
        
        rows[i].style.display = displayRow ? '' : 'none';
      }
    }

    function toggleUnusedSelectors() {
      const rows = document.getElementsByClassName('unused-selector');
      for (let row of rows) {
        row.classList.toggle('hidden');
      }
    }
    
    function toggleDetails(index) {
      const detailsDiv = document.getElementById('details-\${index}');
      const button = detailsDiv.previousElementSibling;
      
      if (detailsDiv.classList.contains('hidden')) {
        detailsDiv.classList.remove('hidden');
        button.textContent = 'Hide Details';
      } else {
        detailsDiv.classList.add('hidden');
        button.textContent = 'Show Details';
      }
    }
    
    function expandAllDetails() {
      const detailsDivs = document.querySelectorAll('.details-container');
      const buttons = document.querySelectorAll('.expand-btn');
      
      detailsDivs.forEach(div => div.classList.remove('hidden'));
      buttons.forEach(button => button.textContent = 'Hide Details');
    }
    
    function collapseAllDetails() {
      const detailsDivs = document.querySelectorAll('.details-container');
      const buttons = document.querySelectorAll('.expand-btn');
      
      detailsDivs.forEach(div => div.classList.add('hidden'));
      buttons.forEach(button => button.textContent = 'Show Details');
    }
  </script>
</body>
</html>
  `;

	return htmlTemplate;
}

// Main function to run the scanner
async function findUnusedSelectors() {
	try {
		console.log(chalk.bold('\n=== Svelte Unused Selectors Scanner ===\n'));

		// 1. Find all CSS and SCSS files
		const cssFiles = glob.sync(CONFIG.cssGlob);
		console.log(chalk.blue(`Found ${cssFiles.length} CSS/SCSS files to scan`));

		// 2. Extract all selectors from CSS/SCSS files
		console.log(chalk.blue('Extracting selectors from CSS files...'));
		for (const file of cssFiles) {
			await extractSelectorsFromFile(file);
		}

		// 3. Find all Svelte files
		const svelteFiles = glob.sync(CONFIG.svelteGlob);
		console.log(chalk.blue(`Found ${svelteFiles.length} Svelte files to scan`));

		// 4. Scan Svelte files for HTML class and ID usage
		console.log(chalk.blue('Scanning Svelte files for selector usage...'));
		for (const file of svelteFiles) {
			await scanSvelteFile(file);
		}

		// 5. Scan JS/TS files for dynamic class usage if enabled
		if (CONFIG.scanJsFiles) {
			const jsFiles = glob.sync(CONFIG.jsGlob);
			console.log(chalk.blue(`Found ${jsFiles.length} JS/TS files to scan`));

			console.log(chalk.blue('Scanning JS/TS files for dynamic selector usage...'));
			for (const file of jsFiles) {
				await scanJsFile(file);
			}
		}

		// 6. Find unused selectors
		console.log(chalk.blue('Analyzing results...'));
		const unusedSelectors = [];
		const usedSelectorsData = [];

		for (const [selector, data] of allCssSelectors.entries()) {
			const isUsed = usedSelectors.has(selector);

			// Prepare data for reporting
			const selectorData = {
				selector,
				name: data.name,
				type: data.type,
				used: isUsed,
				origins: data.origins.map((origin) => ({
					file: relativizePath(origin.file),
					line: origin.line,
					column: origin.column,
					parentSelector: origin.parentSelector
				})),
				declaration: data.declaration
			};

			if (isUsed) {
				usedSelectorsData.push(selectorData);
			} else {
				unusedSelectors.push(selectorData);
				totalUnusedSelectors++;
			}
		}

		// 7. Generate report data
		const reportData = {
			totalSelectors: totalSelectorsFound,
			usedSelectors: totalSelectorsFound - totalUnusedSelectors,
			unusedSelectors: totalUnusedSelectors,
			usedPercentage:
				Math.round(((totalSelectorsFound - totalUnusedSelectors) / totalSelectorsFound) * 100) || 0,
			unusedPercentage: Math.round((totalUnusedSelectors / totalSelectorsFound) * 100) || 0,
			complexSelectorsSkipped: complexSelectorsSkipped,
			selectors: [...unusedSelectors, ...usedSelectorsData].sort((a, b) => {
				// Sort by used status first (unused first), then by type, then by name
				if (a.used !== b.used) return a.used ? 1 : -1;
				if (a.type !== b.type) return a.type.localeCompare(b.type);
				return a.selector.localeCompare(b.selector);
			})
		};

		// 8. Output results to console
		console.log(chalk.bold('\n=== Results ==='));
		console.log(chalk.bold(`Total selectors found: ${chalk.cyan(totalSelectorsFound)}`));
		console.log(
			chalk.bold(
				`Used selectors: ${chalk.green(reportData.usedSelectors)} (${reportData.usedPercentage}%)`
			)
		);
		console.log(
			chalk.bold(
				`Unused selectors: ${chalk.red(totalUnusedSelectors)} (${reportData.unusedPercentage}%)`
			)
		);

		// 9. Display some examples of unused selectors
		if (unusedSelectors.length > 0) {
			console.log(chalk.bold('\n=== Example Unused Selectors ==='));
			const displayCount = Math.min(CONFIG.maxConsoleResults, unusedSelectors.length);

			for (let i = 0; i < displayCount; i++) {
				const selector = unusedSelectors[i];
				const origin = selector.origins[0];

				console.log(
					chalk.red(`${i + 1}. ${chalk.bold(selector.selector)}`) +
						chalk.gray(` (${selector.type})`) +
						chalk.yellow(` - ${origin.file}:${origin.line}`)
				);
			}

			if (unusedSelectors.length > displayCount) {
				console.log(chalk.gray(`...and ${unusedSelectors.length - displayCount} more`));
			}
		}

		// 10. Save reports to files
		// Save JSON report
		fs.writeFileSync(CONFIG.outputReportJson, JSON.stringify(reportData, null, 2));
		console.log(chalk.green(`\nJSON report saved to ${CONFIG.outputReportJson}`));

		// Save HTML report
		const htmlReport = generateHtmlReport(reportData);
		fs.writeFileSync(CONFIG.outputReportHtml, htmlReport);
		console.log(chalk.green(`HTML report saved to ${CONFIG.outputReportHtml}`));

		console.log(chalk.bold('\n=== Scan Complete ==='));
		console.log(
			chalk.green(`Open ${CONFIG.outputReportHtml} in your browser to view the detailed report.`)
		);
	} catch (e) {
		console.log(e);
	}
}
// Execute the main function
findUnusedSelectors().catch((error) => {
	console.error(chalk.red('Error running unused selector scanner:'), error);
	process.exit(1);
});
