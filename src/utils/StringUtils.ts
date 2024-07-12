export const extractFirstURL = (comment: string) => {
	const urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/g;
	const matchedURLs = comment.match(urlRegex);
	const url = matchedURLs ? matchedURLs[0] : null;
	return {
		url,
		domain: url ? getDomain(url) : ''
	};
};

const getDomain = (inputUrl: string) => {
	const url = new URL(inputUrl);
	return url.hostname;
};
