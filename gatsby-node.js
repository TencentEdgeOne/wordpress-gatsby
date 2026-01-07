/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

// WordPress API configuration
const WORDPRESS_URL = process.env.GATSBY_WORDPRESS_URL;

// New: control API mode through environment variable
defaultApiMode = process.env.GATSBY_WORDPRESS_API_MODE || 'default'; // 'default' or 'acf'

// Auto-detect API base URL
const getApiBase = (url) => {
  if (!url) return null;
  if (url.includes('wordpress.com')) {
    // WordPress.com official
    const site = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://public-api.wordpress.com/wp/v2/sites/${site}`;
  } else {
    // Self-hosted WordPress
    return `${url.replace(/\/$/, '')}/wp-json/wp/v2`;
  }
};

const API_BASE = getApiBase(WORDPRESS_URL);

// Import unified fallback data
const {
  fallbackPosts,
  fallbackPostsMeta,
  defaultAuthor,
  defaultAuthorAvatar
} = require('./src/data/fallbackData');

// WordPress API data fetch function (compatible with two modes)
const fetchWordPressData = async () => {
  try {
    if (defaultApiMode === 'acf') {
      // Paid/custom REST route mode, request each path separately
      const [
        postsResponse,
        heroResponse,
        footerResponse,
        aboutResponse,
        contactResponse,
        socialsResponse,
        commentsResponse,
        skillsResponse,
        projectsResponse
      ] = await Promise.all([
        fetch(`${API_BASE}/posts?_embed&per_page=100`),
        fetch(`${API_BASE}/hero`),
        fetch(`${API_BASE}/footer`),
        fetch(`${API_BASE}/about`),
        fetch(`${API_BASE}/contact`),
        fetch(`${API_BASE}/socials`),
        fetch(`${API_BASE}/comments`),
        fetch(`${API_BASE}/skills`),
        fetch(`${API_BASE}/projects`)
      ]);
      const posts = await postsResponse.json();
      const hero = await heroResponse.json();
      const footer = await footerResponse.json();
      const about = await aboutResponse.json();
      const contact = await contactResponse.json();
      const socials = await socialsResponse.json();
      const comments = await commentsResponse.json();
      const skills = await skillsResponse.json();
      const projects = await projectsResponse.json();
      // Assemble into categories compatible structure
      const categories = [
        { slug: 'hero', acf: hero },
        { slug: 'footer', acf: footer },
        { slug: 'about', acf: about },
        { slug: 'contact', acf: contact },
        { slug: 'socials', acf: socials },
        { slug: 'comments', acf: comments },
        { slug: 'skills', acf: skills },
        { slug: 'projects', acf: projects }
      ];
      // pages still fetched from REST API
      const pagesResponse = await fetch(`${API_BASE}/pages?_embed&per_page=50`);
      const pages = await pagesResponse.json();
      return {
        posts,
        categories,
        pages,
        siteName: WORDPRESS_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
      };
    } else {
      // Default mode, compatible with free version, fetch from categories
      const [
        postsResponse,
        categoriesResponse,
        pagesResponse
      ] = await Promise.all([
        fetch(`${API_BASE}/posts?_embed&per_page=100`),
        fetch(`${API_BASE}/categories`),
        fetch(`${API_BASE}/pages?_embed&per_page=50`)
      ]);
      const posts = await postsResponse.json();
      const categories = await categoriesResponse.json();
      const pages = await pagesResponse.json();
      return {
        posts,
        categories,
        pages,
        siteName: WORDPRESS_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
      };
    }
  } catch (error) {
    console.error('Error fetching WordPress data:', error);
    return null;
  }
};

// Parse JSON data from category description
const parseCategoryData = (description) => {
  if (!description) return null;
  try {
    // Directly parse description with eval, compatible with objects and arrays
    return eval('(' + description + ')');
  } catch (e) {
    console.log('Error parsing category data with eval:', e.message);
    console.log('Description:', description.substring(0, 100));
    return null;
  }
};
// Simple HTML decode function (not relying on DOM)
const decodeHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&#8242;/g, "'")
    .replace(/&#8243;/g, '"')
    .replace(/&#8482;/g, '™')
    .replace(/&#169;/g, '©')
    .replace(/&#174;/g, '®')
    .replace(/&#215;/g, '×')
    .replace(/&#247;/g, '÷')
    .replace(/&#176;/g, '°')
    .replace(/&#177;/g, '±')
    .replace(/&#181;/g, 'µ')
    .replace(/&#183;/g, '·')
    .replace(/&#187;/g, '»')
    .replace(/&#171;/g, '«')
    .replace(/&#150;/g, '–')
    .replace(/&#151;/g, '—')
    .replace(/&#133;/g, '…');
};

/**
 * @type {import('gatsby').GatsbyNode['sourceNodes']}
 */
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  
  if (!process.env.GATSBY_WORDPRESS_URL || process.env.GATSBY_WORDPRESS_URL === 'https://your-wordpress-site.com') {
    // If WordPress is not configured, use fallbackData for everything
    const {
      fallbackPosts,
      fallbackHero,
      fallbackAbout,
      fallbackContact,
      fallbackSocials,
      fallbackComments,
      fallbackFooter,
      fallbackSkills,
      fallbackProjects
    } = require('./src/data/fallbackData');
    fallbackPosts.forEach(post => {
      const nodeId = createNodeId(`wordpress-post-${post.id}`);
      createNode({
        id: nodeId,
        internal: {
          type: 'WordPressPost',
          contentDigest: createContentDigest(post),
        },
        // Post data
        wordpressId: post.id,
        title: decodeHtml(post.title?.rendered || ''),
        content: post.content?.rendered || '',
        excerpt: post.excerpt?.rendered || '',
        slug: post.slug,
        date: post.date,
        modified: post.modified,
        author: defaultAuthor,
        authorAvatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || defaultAuthorAvatar,
        featuredImage: post.jetpack_featured_media_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        categories: post._embedded?.['wp:term']?.[0]?.map(cat => cat.name) || [],
        tags: post._embedded?.['wp:term']?.[1]?.map(tag => tag.name) || [],
        // Calculate read time (based on content length)
        readTime: Math.ceil((post.content?.rendered?.length || 0) / 1000) + ' min read',
      });
    });
    // Inject all category data
    const fallbackCategories = [
      { name: 'hero', slug: 'hero', description: '', parsedData: fallbackHero },
      { name: 'about', slug: 'about', description: '', parsedData: fallbackAbout }, 
      { name: 'contact', slug: 'contact', description: '', parsedData: fallbackContact },
      { name: 'socials', slug: 'socials', description: '', parsedData: fallbackSocials },
      { name: 'comments', slug: 'comments', description: '', parsedData: fallbackComments },
      { name: 'footer', slug: 'footer', description: '', parsedData: fallbackFooter },
      { name: 'skills', slug: 'skills', description: '', parsedData: fallbackSkills },
      { name: 'projects', slug: 'projects', description: '', parsedData: fallbackProjects },
    ];
    fallbackCategories.forEach((cat, idx) => {
      createNode({
        id: createNodeId(`fallback-category-${cat.slug}`),
        internal: {
          type: 'WordPressCategory',
          contentDigest: createContentDigest(cat),
        },
        wordpressId: idx + 1,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        count: 1,
        parsedData: cat.parsedData,
      });
    });
    return;
  }
  
  console.log('🔄 Fetching WordPress data...');
  
  // Fetch WordPress data
  const wpData = await fetchWordPressData();
  
  if (!wpData) {
    console.log('⚠️  WordPress data fetch failed, using fallback data');
    return;
  }
  
  const { posts, categories, pages, siteName } = wpData;
  
  console.log(`✅ Fetched ${posts.length} posts, ${categories.length} categories, ${pages.length} pages`);

  console.log("posts",JSON.stringify(posts));
  
  // Create WordPress post nodes
  posts.forEach((post, index) => {
    const nodeId = createNodeId(`wordpress-post-${post.id}`);
    
    createNode({
      id: nodeId,
      internal: {
        type: 'WordPressPost',
        contentDigest: createContentDigest(post),
      },
      // Post data
      wordpressId: post.id,
      title: decodeHtml(post.title?.rendered || ''),
      content: post.content?.rendered || '',
      excerpt: post.excerpt?.rendered || '',
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      author: defaultAuthor,
      authorAvatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || defaultAuthorAvatar,
      featuredImage: post.jetpack_featured_media_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      categories: post._embedded?.['wp:term']?.[0]?.map(cat => cat.name) || [],
      tags: post._embedded?.['wp:term']?.[1]?.map(tag => tag.name) || [],
      // Calculate read time (based on content length)
      readTime: Math.ceil((post.content?.rendered?.length || 0) / 1000) + ' min read',
    });
  });
  
  // Create WordPress category nodes
  console.log('📋 Processing categories:');
  categories.forEach((category) => {
    console.log(`  - ${category.name} (${category.slug})`);
  });
  
  categories.forEach((category) => {
    const nodeId = createNodeId(`wordpress-category-${category.id}`);
    
    // Determine corresponding fallback data based on category slug
    const isHero = category.slug === 'hero';
    const isContact = category.slug === 'contact';
    const isSocials = category.slug === 'socials';
    const isComments = category.slug === 'comments';
    const isPosts = category.slug === 'posts';
    const isAbout = category.slug === 'about';
    const isFooter = category.slug === 'footer';
    const isSkills = category.slug === 'skills';
    const isProjects = category.slug === 'projects';
    
    let parsedData = null;
    if (category.acf && Object.keys(category.acf).length > 0) {
      parsedData = category.acf;
    } else {
      parsedData = parseCategoryData(category.description);
    }
    let description = category.description;
    
    // Set fallback data for each category
    if (isHero && (!parsedData || !parsedData.basic || !parsedData.basic.title)) {
      console.log('🔍 Hero category found, but data is missing or invalid:');
      console.log('  - Category name:', category.name);
      console.log('  - Category slug:', category.slug);
      console.log('  - Raw description:', category.description);
      console.log('  - Parsed data:', parsedData);
      console.log('  - Using fallback data:', fallbackHero);
      parsedData = fallbackHero;
    }
    if (isContact && (!parsedData || !parsedData.title)) {
      parsedData = fallbackContact;
    }
    if (isSocials && (!parsedData || !parsedData.socials)) {
      parsedData = fallbackSocials;
    }
    if (isComments) {
      if (!parsedData || !Array.isArray(parsedData.rules)) {
        parsedData = fallbackComments;
      }
      if (!description || !description.trim()) {
        description = fallbackComments.description;
      }
    }
    if (isPosts && (!parsedData || !parsedData.title)) {
      parsedData = fallbackPostsMeta;
    }
    if (isAbout && (!parsedData || !parsedData.title)) {
      parsedData = fallbackAbout;
    }
    if (isFooter && (!parsedData || !parsedData.text)) {
      parsedData = fallbackFooter;
    }
    if (isSkills && (!parsedData || !Array.isArray(parsedData))) {
      parsedData = fallbackSkills;
    }
    if (isProjects && (!parsedData || !Array.isArray(parsedData))) {
      parsedData = fallbackProjects;
    }
    
    createNode({
      id: nodeId,
      internal: {
        type: 'WordPressCategory',
        contentDigest: createContentDigest(category),
      },
      // Category data
      wordpressId: category.id,
      name: category.name,
      slug: category.slug,
      description: description,
      count: category.count,
      // Parse JSON data from category description
      parsedData: parsedData,
    });
  });
  
  // Create WordPress page nodes
  pages.forEach((page) => {
    const nodeId = createNodeId(`wordpress-page-${page.id}`);
    
    createNode({
      id: nodeId,
      internal: {
        type: 'WordPressPage',
        contentDigest: createContentDigest(page),
      },
      // Page data
      wordpressId: page.id,
      title: page.title?.rendered || '',
      content: page.content?.rendered || '',
      excerpt: page.excerpt?.rendered || '',
      slug: page.slug,
      date: page.date,
      modified: page.modified,
      featuredImage: page.jetpack_featured_media_url || page._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    });
  });
  
  // Create site config node
  const siteConfigNodeId = createNodeId('wordpress-site-config');
  createNode({
    id: siteConfigNodeId,
    internal: {
      type: 'WordPressSiteConfig',
      contentDigest: createContentDigest(siteName),
    },
    siteName,
    wordpressUrl: WORDPRESS_URL,
  });
  
  console.log('✅ WordPress data nodes created successfully');
};

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  
  console.log('🔄 Creating pages from WordPress data...');
  
  // Query WordPress post data
  const result = await graphql(`
    query {
      allWordPressPost {
        nodes {
          wordpressId
          title
          slug
          excerpt
          content
          date
          author
          authorAvatar
          featuredImage
          categories
          tags
          readTime
        }
      }
    }
  `);
  
  if (result.errors) {
    console.error('GraphQL query error:', result.errors);
    // If query fails, use fallback data
    fallbackPosts.forEach(post => {
      createPage({
        path: `/post/${post.slug}`,
        component: require.resolve("./src/pages/post/[slug].js"),
        context: {
          slug: post.slug,
          post: post
        },
      });
    });
    return;
  }
  
  const posts = result.data.allWordPressPost.nodes;
  
  // Create page for each WordPress post
  posts.forEach(post => {
    createPage({
      path: `/post/${post.slug}`,
      component: require.resolve("./src/pages/post/[slug].js"),
      context: {
        slug: post.slug,
        post: {
          id: post.wordpressId,
          title: post.title,
          subtitle: post.title, // Can be obtained from WordPress custom fields later
          author: post.author,
          authorAvatar: post.authorAvatar,
          tags: post.tags,
          readTime: post.readTime,
          date: post.date,
          excerpt: post.excerpt,
          content: post.content,
        }
      },
    });
  });
  
  console.log(`✅ Created ${posts.length} post pages`);
};

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  
  const typeDefs = `
    type WordPressPost implements Node {
      wordpressId: Int!
      title: String!
      content: String!
      excerpt: String!
      slug: String!
      date: Date! @dateformat
      modified: Date! @dateformat
      author: String!
      authorAvatar: String
      featuredImage: String
      categories: [String!]!
      tags: [String!]!
      readTime: String!
    }
    
    type WordPressCategory implements Node {
      wordpressId: Int!
      name: String!
      slug: String!
      description: String!
      count: Int!
      parsedData: JSON
    }
    
    type WordPressPage implements Node {
      wordpressId: Int!
      title: String!
      content: String!
      excerpt: String!
      slug: String!
      date: Date! @dateformat
      modified: Date! @dateformat
      featuredImage: String
    }
    
    type WordPressSiteConfig implements Node {
      siteName: String!
      wordpressUrl: String!
    }
  `;
  
  createTypes(typeDefs);
};
