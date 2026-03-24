import { PortfolioTemplates } from '../../templates/notion.templates.js';

export class TransformerService {
  
  convertToPortfolioBlocks(assetMap: any) {
    const blocks: any[] = [];

    const hero = assetMap.hero || { tagline: "Professional Portfolio", bio: "Passionate developer building great things.", social_links: [] };

    // 1. Hero Section
    blocks.push(...PortfolioTemplates.hero(
      assetMap.title || "My Portfolio", 
      hero.tagline || "Professional Developer", 
      hero.bio || "Building modern web applications."
    ));

    // 2. Skills (Categorized Stack)
    blocks.push(PortfolioTemplates.sectionHeader('My Stack', '📊'));
    const skills = assetMap.skills || {};
    blocks.push(...PortfolioTemplates.stackColumns(
      skills.frontend || [], 
      skills.backend || [], 
      skills.testing_devops || []
    ));

    // 3. Projects
    blocks.push(PortfolioTemplates.sectionHeader('Projects', '🚧'));
    const projects = Array.isArray(assetMap.projects) ? assetMap.projects : [];
    
    for (const project of projects) {
      blocks.push(...PortfolioTemplates.projectCard(
        project.title || "Project Title", 
        project.description || "Project description.", 
        project.tech_stack || [], 
        project.url || "#"
      ));
    }

    // 4. Achievements (if any)
    if (assetMap.achievements && Array.isArray(assetMap.achievements) && assetMap.achievements.length > 0) {
      blocks.push(PortfolioTemplates.sectionHeader('Achievements', '🏆'));
      blocks.push(...PortfolioTemplates.achievements(assetMap.achievements));
    }

    // 5. Contact/Links
    blocks.push(PortfolioTemplates.sectionHeader('Connect', '🔗'));
    const socialLinks = Array.isArray(hero.social_links) ? hero.social_links : [];
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: socialLinks.map((link: string) => ({
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
