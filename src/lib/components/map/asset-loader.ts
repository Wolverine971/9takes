// src/lib/components/map/asset-loader.ts
type Asset = {
	type: 'script' | 'link';
	value: string;
	id: string;
};

function load(assets: Asset[], cb: () => void): void {
	for (const { type, value, id } of assets) {
		const existing = document.getElementById(id);

		if (existing) {
			if (type === 'script') {
				cb();
			}
			return;
		}

		const tag = document.createElement(type);
		tag.id = id;
		if (type === 'script') {
			const scriptTag = tag as HTMLScriptElement;
			scriptTag.async = true;
			scriptTag.defer = true;
			scriptTag.src = value;
			scriptTag.onload = () => cb();
		} else {
			const linkTag = tag as HTMLLinkElement;
			linkTag.rel = 'stylesheet';
			linkTag.href = value;
		}
		document.body.appendChild(tag);
	}
}

export { load };
