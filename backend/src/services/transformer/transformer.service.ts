import { PortfolioTemplates } from '../../templates/notion.templates.js';

export class TransformerService {
  
  convertToPortfolioBlocks(assetMap: any, templateId?: string) {
    const blocks: any[] = [];
    const hero = assetMap.hero || { tagline: "Professional Portfolio", bio: "Passionate developer building great things.", social_links: [] };
    const skills = assetMap.skills || {};
    const projects = Array.isArray(assetMap.projects) ? assetMap.projects : [];
    const title = assetMap.title || "My Portfolio";

    // --- TEMPLATE LOGIC ---
    
    // 1. Hero Section
    if (templateId === 'designer-minimal') {
      blocks.push(...PortfolioTemplates.minimalHero(title, hero.tagline));
      blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: hero.bio } }] } });
    } else if (templateId === 'hacker-dark') {
      blocks.push(PortfolioTemplates.sectionHeader(`SYSTEM_READY: ${title.toUpperCase()}`, '📟'));
      blocks.push({ object: 'block', type: 'code', code: { language: 'json', rich_text: [{ type: 'text', text: { content: JSON.stringify(hero, null, 2) } }] } });
    } else {
      blocks.push(...PortfolioTemplates.hero(title, hero.tagline, hero.bio));
    }

    // 2. Skills
    if (templateId !== 'designer-minimal') {
      blocks.push(PortfolioTemplates.sectionHeader(templateId === 'hacker-dark' ? 'COMPUTE_STACK' : 'My Stack', templateId === 'hacker-dark' ? '🛡️' : '📊'));
      blocks.push(...PortfolioTemplates.stackColumns(
        skills.frontend || [], 
        skills.backend || [], 
        skills.testing_devops || []
      ));
    }

    // 3. Experience
    if (assetMap.experience?.length > 0) {
      blocks.push(PortfolioTemplates.sectionHeader('Professional Experience', '💼'));
      for (const exp of assetMap.experience) {
        blocks.push(...PortfolioTemplates.experienceCard(
          exp.company || "Company",
          exp.role || "Role",
          exp.period || "",
          exp.achievements || []
        ));
      }
    }

    // 4. Projects
    blocks.push(PortfolioTemplates.sectionHeader(templateId === 'dev-pro' ? 'Project Case Studies' : 'Projects', '🚧'));
    
    if (templateId === 'dev-pro') {
      // Pro template uses a table tracker for projects
      blocks.push(...(PortfolioTemplates as any).projectTracker(projects));
      blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: 'Detailed breakdown of repositories below:' } }] } });
    }

    for (const project of projects) {
      blocks.push(...PortfolioTemplates.projectCard(
        project.title || "Project Title", 
        project.description || "Project description.", 
        project.tech_stack || [], 
        project.url || ""
      ));
    }

    // 4. Achievements
    if (assetMap.achievements?.length > 0) {
      blocks.push(PortfolioTemplates.sectionHeader('Achievements', '🏆'));
      blocks.push(...PortfolioTemplates.achievements(assetMap.achievements));
    }

    // 5. Connect
    blocks.push(PortfolioTemplates.sectionHeader('Connect', '🔗'));
    const socialLinks = Array.isArray(hero.social_links) ? hero.social_links : [];
    if (socialLinks.length > 0) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: socialLinks.map((link: string) => ({
              type: 'text',
              text: { 
                content: `${link}  `, 
                ...(link && link.startsWith('http') ? { link: { url: link } } : {})
              }
            }))
          }
        });
    }

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
