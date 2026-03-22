export const PortfolioTemplates = {
  hero: (name: string, tagline: string, bio: string) => [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ type: 'text', text: { content: `👋 ${name}'s Portfolio` } }],
      },
    },
    {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [{ type: 'text', text: { content: bio } }],
        icon: { type: 'emoji', emoji: '✨' },
        color: 'gray_background',
      },
    },
  ],
  sectionHeader: (title: string, emoji: string = '🚀') => ({
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: `${emoji} ${title}` } }],
    },
  }),
  projectCard: (title: string, description: string, tech: string[], url: string) => [
    {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [{ type: 'text', text: { content: `**${title}**\n${description}` } }],
        icon: { type: 'emoji', emoji: '🛠️' },
        color: 'default',
        children: [
           {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: `🔗 ${url}`, link: { url } } }],
            },
           },
           {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: `Stack: ${tech.join(', ')}` } }],
            },
           }
        ]
      },
    },
  ],
  skillsCloud: (skills: string[]) => [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: skills.map((skill, index) => ({
          type: 'text',
          text: { content: (index === 0 ? '' : ' • ') + skill },
          annotations: { bold: true, code: true }
        }))
      }
    }
  ]
};
