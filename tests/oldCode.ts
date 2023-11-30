const jsonldString = {
	'@context': 'http://schema.org',
	'@type': 'SiteNavigationElement',
	mainEntity: [
		{
			'@type': 'WebPage',
			name: 'Home',
			url: {
				'@id': 'https://9takes.com/'
			}
		},
		{
			'@type': 'WebPage',
			hasPart: [
				{
					'@type': 'WebPage',
					hasPart: [
						{
							'@type': 'WebPage',
							name: 'Philosophy and Psychology gave birth to the Enneagram',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/philosophy-psychology-and-the-enneagram'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Enneagram TLDR',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-tldr'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Concepts and Principles',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-concepts'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Enneagram Influences',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-influences'
							}
						}
					],
					name: 'Overview'
				},
				{
					'@type': 'WebPage',
					hasPart: [
						{
							'@type': 'WebPage',
							name: 'Type 1: The Perfectionist',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-1'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 2: The Helper',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-2'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 3: The Achiever',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-3'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 4: The Individualist',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-4'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 5: The Investigator',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-5'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 6: The Loyalist',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-6'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 7: The Enthusiast',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-7'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 8: The Challenger',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-8'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Type 9: The Peacemaker',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-type-9'
							}
						}
					],
					name: '9 Types'
				},
				{
					'@type': 'WebPage',
					hasPart: [
						{
							'@type': 'WebPage',
							name: 'Determining your type',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-personality-test'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Self development',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-self-development'
							}
						},
						{
							'@type': 'WebPage',
							name: 'strengths 💪 and weaknesses',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-strengths-and-weaknesses'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Growth strategies',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-personal-growth'
							}
						}
					],
					name: 'Personal Development'
				},
				{
					'@type': 'WebPage',
					hasPart: [
						{
							'@type': 'WebPage',
							name: 'Types in relationships',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-types-in-relationships'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Communication tips',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-communication-tips'
							}
						},
						{
							'@type': 'WebPage',
							name: 'communication styles 🙊',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-communication-styles'
							}
						}
					],
					name: 'Relationships'
				},
				{
					'@type': 'WebPage',
					hasPart: [
						{
							'@type': 'WebPage',
							name: 'Team building',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-workplace-team-building'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Working in teams',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-types-working-in-teams'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Team dynamics',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-team-dynamics'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Team diversity',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-team-diversity'
							}
						}
					],
					name: 'Workplace'
				},
				{
					'@type': 'WebPage',
					hasPart: [
						{
							'@type': 'WebPage',
							name: 'FAQs',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-faqs'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Books, websites, and podcasts',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-books-websites-podcasts'
							}
						}
					],
					name: 'Resources'
				},
				{
					'@type': 'WebPage',
					hasPart: [
						{
							'@type': 'WebPage',
							name: 'Types at a party',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-types-at-party'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Impact of ghosting',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-types-being-ghosted'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Navigating stress',
							url: {
								'@id': 'https://9takes.com/blog/enneagram/enneagram-types-in-stress'
							}
						},
						{
							'@type': 'WebPage',
							name: 'Analysis of famous people',
							url: {
								'@id': '/blog/famous-enneagram-types'
							}
						}
					],
					name: 'Situational Topics'
				}
			],
			name: 'Enneagram Blog',
			url: {
				'@id': 'https://9takes.com/blog/'
			}
		},
		{
			'@type': 'WebPage',
			name: 'About',
			url: {
				'@id': 'https://9takes.com/about'
			}
		}
	]
};
const jsonld = JSON.stringify(jsonldString);
