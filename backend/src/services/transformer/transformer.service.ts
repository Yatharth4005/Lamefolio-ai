import { PortfolioTemplates } from '../../templates/notion.templates.js';

export class TransformerService {
  
  convertToPortfolioBlocks(assetMap: any) {
    const blocks: any[] = [];

    // 1. Hero Section
    blocks.push(...PortfolioTemplates.hero(assetMap.title, assetMap.hero.tagline, assetMap.hero.bio));

    // 2. Skills (Categorized Stack)
    blocks.push(PortfolioTemplates.sectionHeader('My Stack', '📊'));
    blocks.push(...PortfolioTemplates.stackColumns(
      assetMap.skills.frontend || [], 
      assetMap.skills.backend || [], 
      assetMap.skills.testing_devops || []
    ));

    // 3. Projects
    blocks.push(PortfolioTemplates.sectionHeader('Projets', '🚧'));
    
    for (const project of assetMap.projects) {
      blocks.push(...PortfolioTemplates.projectCard(
        project.title, 
        project.description, 
        project.tech_stack, 
        project.url
      ));
    }

    // 4. Achievements (if any)
    if (assetMap.achievements && assetMap.achievements.length > 0) {
      blocks.push(PortfolioTemplates.sectionHeader('Achievements', '🏆'));
      blocks.push(...PortfolioTemplates.achievements(assetMap.achievements));
    }

    // 5. Contact/Links
    blocks.push(PortfolioTemplates.sectionHeader('Connect', '🔗'));
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: assetMap.hero.social_links.map((link: string) => ({
          type: 'text',
          text: { content: `${link}  `, link: { url: link } }
        }))
      }
    });

    return blocks;
  }


  convertToDocsBlocks(docSchema: any) {
    const blocks: any[] = [];
    
    blocks.push({
       object: 'block',
       type: 'heading_1',
       heading_1: { rich_text: [{ type: 'text', text: { content: 'Project Documentation' } }] }
    });

    blocks.push({
       object: 'block',
       type: 'heading_2',
       heading_2: { rich_text: [{ type: 'text', text: { content: 'Introduction' } }] }
    });
    blocks.push({
       object: 'block',
       type: 'paragraph',
       paragraph: { rich_text: [{ type: 'text', text: { content: docSchema.intro } }] }
    });

    // etc.
    return blocks;
  }
}
