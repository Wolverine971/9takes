// FAQ types for cluster pages SEO optimization

export interface FAQItem {
	question: string;
	answer: string;
}

export interface FAQSection {
	title?: string;
	items: FAQItem[];
}
