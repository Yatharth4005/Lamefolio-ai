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
  minimalHero: (name: string, tagline: string) => [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ type: 'text', text: { content: name } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: tagline, annotations: { italic: true } } }],
      },
    },
    { object: 'block', type: 'divider', divider: {} }
  ],
  projectTracker: (projects: any[]) => [
    {
      object: 'block',
      type: 'table',
      table: {
        table_width: 3,
        has_column_header: true,
        has_row_header: false,
        children: [
          {
            object: 'block',
            type: 'table_row',
            table_row: {
              cells: [
                [{ type: 'text', text: { content: 'Project' } }],
                [{ type: 'text', text: { content: 'Stack' } }],
                [{ type: 'text', text: { content: 'Link' } }]
              ]
            }
          },
          ...projects.map(p => ({
            object: 'block',
            type: 'table_row',
            table_row: {
              cells: [
                [{ type: 'text', text: { content: p.title } }],
                [{ type: 'text', text: { content: (p.tech_stack || []).join(', ') } }],
                [{ type: 'text', text: { content: p.url || 'N/A' } }]
              ]
            }
          }))
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

