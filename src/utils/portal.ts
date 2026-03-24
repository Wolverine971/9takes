// src/utils/portal.ts
export const portal = (node: HTMLElement) => {
	const target = document.querySelector('main') ?? document.body;
	target.appendChild(node);
	node.focus();

	return {
		destroy() {
			node.parentNode?.removeChild(node);
		}
	};
};
