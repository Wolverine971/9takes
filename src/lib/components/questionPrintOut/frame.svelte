<!-- lib/components/questionPrintOut/frame.svelte -->
<script lang="ts">
	export let width = '100%';
	export let height = '100%';
	export let color = 'currentColor';
	export let cornerSize = 80; // Size of the corner ornaments in pixels

	const viewBoxWidth = 1000;
	const viewBoxHeight = 1000;
	const contentLeft = 40;
	const contentTop = 40;
	const contentWidth = viewBoxWidth - 2 * contentLeft;
	const contentHeight = viewBoxHeight - 2 * contentTop;

	export const contentArea = {
		left: `${(contentLeft / viewBoxWidth) * 100}%`,
		top: `${(contentTop / viewBoxHeight) * 100}%`,
		width: `${(contentWidth / viewBoxWidth) * 100}%`,
		height: `${(contentHeight / viewBoxHeight) * 100}%`
	};
</script>

<svg
	class="greek-frame"
	{width}
	{height}
	viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
	preserveAspectRatio="none"
>
	<!-- Top border -->
	<path d="M{cornerSize},40 H{1000 - cornerSize}" stroke={color} stroke-width="2" fill="none" />

	<!-- Bottom border -->
	<path d="M{cornerSize},960 H{1000 - cornerSize}" stroke={color} stroke-width="2" fill="none" />

	<!-- Left border -->
	<path d="M40,{cornerSize} V{1000 - cornerSize}" stroke={color} stroke-width="2" fill="none" />

	<!-- Right border -->
	<path d="M960,{cornerSize} V{1000 - cornerSize}" stroke={color} stroke-width="2" fill="none" />

	<!-- Corner ornaments -->
	<!-- Top-left corner -->
	<g
		class="corner-ornament"
		transform="translate(167,40) rotate(90) scale({cornerSize / 1000})"
		fill={color}
	>
		<path
			d="M0 11645 l0 -1155 1155 0 1155 0 0 1155 0 1155 -1155 0 -1155 0 0 -1155z m1820 0 l0 -665 -665 0 -665 0 0 665 0 665 665 0 665 0 0 -665z"
		/>
		<path
			d="M2738,11433 l-3,-1368 l-1367,-3 l-1368,-2 l0,-5030 l0,-5030 l245,0 l0,2735 l0,2735 l440,0 l440,0 l0,-1595 l0,-1595 l930,0 l930,0 l-2,243 l-3,242 l-682,3 l-683,2 l0,1350 l0,1350 l683,2 l682,3 l0,1610 l0,1610 l-927,3 l-928,2 l0,-930 l0,-930 l245,0 l245,0 l0,685 l0,685 l438,-2 l437,-3 l3,-1122 l2,-1123 l-1125,0 l-1125,0 l0,1805 l0,1805 l1368,2 l1367,3 l3,1368 l2,1367 l1805,0 l1805,0 l0,-440 l0,-440 l-1370,0 l-1370,0 l3,-927 l2,-928 l1610,0 l1610,0 l3,683 l2,682 l1350,0 l1350,0 l2,-682 l3,-683 l243,-3 l242,-2 l0,930 l0,930 l-1595,0 l-1595,0 l0,440 l0,440 l2735,0 l2735,0 l0,245 l-5030,0 l-5030,0 Z m4102,-933 l0,-440 l-1122,2 l-1123,3 l-3,438 l-2,437 l1125,0 l1125,0 l0,-440 Z"
		/>
		<path
			d="M4106 8691 c-3 -5 -5 -526 -3 -1157 l2 -1149 1155 0 1155 0 0 1155 0 1155 -1152 2 c-667 2 -1154 -1 -1157 -6z m1824 -1151 l0 -670 -670 0 -670 0 0 670 0 670 670 0 670 0 0 -670z"
		/>
	</g>
	<!-- Top-right corner -->
	<g
		class="corner-ornament"
		transform="translate(957,167) rotate(180) scale({cornerSize / 1000})"
		fill={color}
	>
		<path
			d="M0 11645 l0 -1155 1155 0 1155 0 0 1155 0 1155 -1155 0 -1155 0 0 -1155z m1820 0 l0 -665 -665 0 -665 0 0 665 0 665 665 0 665 0 0 -665z"
		/>
		<path
			d="M2738,11433 l-3,-1368 l-1367,-3 l-1368,-2 l0,-5030 l0,-5030 l245,0 l0,2735 l0,2735 l440,0 l440,0 l0,-1595 l0,-1595 l930,0 l930,0 l-2,243 l-3,242 l-682,3 l-683,2 l0,1350 l0,1350 l683,2 l682,3 l0,1610 l0,1610 l-927,3 l-928,2 l0,-930 l0,-930 l245,0 l245,0 l0,685 l0,685 l438,-2 l437,-3 l3,-1122 l2,-1123 l-1125,0 l-1125,0 l0,1805 l0,1805 l1368,2 l1367,3 l3,1368 l2,1367 l1805,0 l1805,0 l0,-440 l0,-440 l-1370,0 l-1370,0 l3,-927 l2,-928 l1610,0 l1610,0 l3,683 l2,682 l1350,0 l1350,0 l2,-682 l3,-683 l243,-3 l242,-2 l0,930 l0,930 l-1595,0 l-1595,0 l0,440 l0,440 l2735,0 l2735,0 l0,245 l-5030,0 l-5030,0 Z m4102,-933 l0,-440 l-1122,2 l-1123,3 l-3,438 l-2,437 l1125,0 l1125,0 l0,-440 Z"
		/>
		<path
			d="M4106 8691 c-3 -5 -5 -526 -3 -1157 l2 -1149 1155 0 1155 0 0 1155 0 1155 -1152 2 c-667 2 -1154 -1 -1157 -6z m1824 -1151 l0 -670 -670 0 -670 0 0 670 0 670 670 0 670 0 0 -670z"
		/>
	</g>

	<!-- Bottom-right corner -->
	<g
		class="corner-ornament"
		transform="translate(830,960) rotate(270) scale({cornerSize / 1000})"
		fill={color}
	>
		<path
			d="M0 11645 l0 -1155 1155 0 1155 0 0 1155 0 1155 -1155 0 -1155 0 0 -1155z m1820 0 l0 -665 -665 0 -665 0 0 665 0 665 665 0 665 0 0 -665z"
		/>
		<path
			d="M2738,11433 l-3,-1368 l-1367,-3 l-1368,-2 l0,-5030 l0,-5030 l245,0 l0,2735 l0,2735 l440,0 l440,0 l0,-1595 l0,-1595 l930,0 l930,0 l-2,243 l-3,242 l-682,3 l-683,2 l0,1350 l0,1350 l683,2 l682,3 l0,1610 l0,1610 l-927,3 l-928,2 l0,-930 l0,-930 l245,0 l245,0 l0,685 l0,685 l438,-2 l437,-3 l3,-1122 l2,-1123 l-1125,0 l-1125,0 l0,1805 l0,1805 l1368,2 l1367,3 l3,1368 l2,1367 l1805,0 l1805,0 l0,-440 l0,-440 l-1370,0 l-1370,0 l3,-927 l2,-928 l1610,0 l1610,0 l3,683 l2,682 l1350,0 l1350,0 l2,-682 l3,-683 l243,-3 l242,-2 l0,930 l0,930 l-1595,0 l-1595,0 l0,440 l0,440 l2735,0 l2735,0 l0,245 l-5030,0 l-5030,0 Z m4102,-933 l0,-440 l-1122,2 l-1123,3 l-3,438 l-2,437 l1125,0 l1125,0 l0,-440 Z"
		/>
		<path
			d="M4106 8691 c-3 -5 -5 -526 -3 -1157 l2 -1149 1155 0 1155 0 0 1155 0 1155 -1152 2 c-667 2 -1154 -1 -1157 -6z m1824 -1151 l0 -670 -670 0 -670 0 0 670 0 670 670 0 670 0 0 -670z"
		/>
	</g>
	<!-- Bottom-left corner -->
	<g class="corner-ornament" transform="translate(42,832) scale({cornerSize / 1000})" fill={color}>
		<path
			d="M0 11645 l0 -1155 1155 0 1155 0 0 1155 0 1155 -1155 0 -1155 0 0 -1155z m1820 0 l0 -665 -665 0 -665 0 0 665 0 665 665 0 665 0 0 -665z"
		/>
		<path
			d="M2738,11433 l-3,-1368 l-1367,-3 l-1368,-2 l0,-5030 l0,-5030 l245,0 l0,2735 l0,2735 l440,0 l440,0 l0,-1595 l0,-1595 l930,0 l930,0 l-2,243 l-3,242 l-682,3 l-683,2 l0,1350 l0,1350 l683,2 l682,3 l0,1610 l0,1610 l-927,3 l-928,2 l0,-930 l0,-930 l245,0 l245,0 l0,685 l0,685 l438,-2 l437,-3 l3,-1122 l2,-1123 l-1125,0 l-1125,0 l0,1805 l0,1805 l1368,2 l1367,3 l3,1368 l2,1367 l1805,0 l1805,0 l0,-440 l0,-440 l-1370,0 l-1370,0 l3,-927 l2,-928 l1610,0 l1610,0 l3,683 l2,682 l1350,0 l1350,0 l2,-682 l3,-683 l243,-3 l242,-2 l0,930 l0,930 l-1595,0 l-1595,0 l0,440 l0,440 l2735,0 l2735,0 l0,245 l-5030,0 l-5030,0 Z m4102,-933 l0,-440 l-1122,2 l-1123,3 l-3,438 l-2,437 l1125,0 l1125,0 l0,-440 Z"
		/>
		<path
			d="M4106 8691 c-3 -5 -5 -526 -3 -1157 l2 -1149 1155 0 1155 0 0 1155 0 1155 -1152 2 c-667 2 -1154 -1 -1157 -6z m1824 -1151 l0 -670 -670 0 -670 0 0 670 0 670 670 0 670 0 0 -670z"
		/>
	</g>
</svg>

<style>
	.greek-frame {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}
</style>
