// src/utils/portal.ts
export const portal = (node: HTMLElement) => {
	document.body.appendChild(node);

	return {
		destroy() {
			node.parentNode?.removeChild(node);
		}
	};
};
