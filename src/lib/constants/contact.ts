// src/lib/constants/contact.ts
// Public mailing address supplied by DJ on October 5, 2026.
// Keep EMAIL_FOOTER_ADDRESS in local and Vercel environments in sync.
export const MAILING_ADDRESS = {
	postOfficeBoxNumber: '662',
	streetAddress: 'PO Box 662',
	addressLocality: 'Glen Burnie',
	addressRegion: 'MD',
	postalCode: '21061-0662',
	addressCountry: 'US'
} as const;

export const MAILING_ADDRESS_LINE = `${MAILING_ADDRESS.streetAddress}, ${MAILING_ADDRESS.addressLocality}, ${MAILING_ADDRESS.addressRegion} ${MAILING_ADDRESS.postalCode}`;

export const MAILING_ADDRESS_JSON_LD = {
	'@type': 'PostalAddress',
	...MAILING_ADDRESS
} as const;
