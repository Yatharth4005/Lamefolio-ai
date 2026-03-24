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
        rich_text: [
          { type: 'text', text: { content: title }, annotations: { bold: true } },
          { type: 'text', text: { content: `\n${description}` } }
        ],
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
              rich_text: [
                { type: 'text', text: { content: 'Stack: ' }, annotations: { bold: true } },
                { type: 'text', text: { content: tech.join(', ') } }
              ],
            },
           }
        ]
      },
    },
  ],
  stackColumns: (frontend: string[], backend: string[], testing: string[]) => [
    {
      object: 'block',
      type: 'column_list',
      column_list: {
        children: [
          {
            object: 'block',
            type: 'column',
            column: {
              children: [
                {
                  object: 'block',
                  type: 'callout',
                  callout: {
                    rich_text: [{ type: 'text', text: { content: 'Frontend' }, annotations: { bold: true } }],
                    icon: { type: 'emoji', emoji: '🎨' },
                    color: 'blue_background',
                    children: frontend.filter(Boolean).map(s => ({
                      object: 'block',
                      type: 'bulleted_list_item',
                      bulleted_list_item: { rich_text: [{ type: 'text', text: { content: s } }] }
                    }))
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'column',
            column: {
              children: [
                {
                  object: 'block',
                  type: 'callout',
                  callout: {
                    rich_text: [{ type: 'text', text: { content: 'Backend' }, annotations: { bold: true } }],
                    icon: { type: 'emoji', emoji: '⚙️' },
                    color: 'purple_background',
                    children: backend.filter(Boolean).map(s => ({
                      object: 'block',
                      type: 'bulleted_list_item',
                      bulleted_list_item: { rich_text: [{ type: 'text', text: { content: s } }] }
                    }))
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'column',
            column: {
              children: [
                {
                  object: 'block',
                  type: 'callout',
                  callout: {
                    rich_text: [{ type: 'text', text: { content: 'Testing & DevOps' }, annotations: { bold: true } }],
                    icon: { type: 'emoji', emoji: '🧪' },
                    color: 'green_background',
                    children: testing.filter(Boolean).map(s => ({
                      object: 'block',
                      type: 'bulleted_list_item',
                      bulleted_list_item: { rich_text: [{ type: 'text', text: { content: s } }] }
                    }))
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ],
  achievements: (items: any[]) => [
    ...items.map(item => {
      const title = typeof item === 'string' ? item : (item.title || 'Achievement');
      const description = typeof item === 'string' ? '' : (item.description ? `: ${item.description}` : '');
      
      return {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            { type: 'text', text: { content: title }, annotations: { bold: true } },
            { type: 'text', text: { content: description } }
          ],
          icon: { type: 'emoji', emoji: '🏆' },
          color: 'yellow_background'
        }
      };
    })
  ]
};

