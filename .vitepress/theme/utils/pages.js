const pageFiles = import.meta.glob('/*.md', { eager: true });

const EXCLUDED = ['collections', 'html-styles', 'markdown-examples', 'index', 'CLAUDE'];
const SORT_ORDER = ['blog', 'about', 'uses'];

// Top-level pages for site navigation, in a fixed order: the known sections
// first, then anything else alphabetically.
export function getNavPages() {
  const pages = Object.entries(pageFiles)
    .map(([path, mod]) => {
      const slug = path.split('/').pop().replace(/\.md$/, '');
      return {
        slug,
        path: `/${slug}`,
        title: mod.__pageData?.frontmatter?.title || slug,
      };
    })
    .filter((p) => !EXCLUDED.includes(p.slug));

  return [
    ...SORT_ORDER.map((slug) => pages.find((p) => p.slug === slug)).filter(Boolean),
    ...pages
      .filter((p) => !SORT_ORDER.includes(p.slug))
      .sort((a, b) => a.title.localeCompare(b.title)),
  ];
}
