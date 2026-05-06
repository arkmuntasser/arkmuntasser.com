const postFiles = import.meta.glob('/posts/*.md', { eager: true });

export function getBlogPosts() {
  const posts = Object.entries(postFiles).map(([path, mod]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '');
    return {
      path: `/posts/${slug}`,
      title: mod.__pageData?.frontmatter?.title || slug,
      date: mod.__pageData?.frontmatter?.date,
      excerpt: mod.__pageData?.frontmatter?.excerpt || null,
      categories: mod.__pageData?.frontmatter?.category || [],
    };
  });

  posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return a.title.localeCompare(b.title);
  });

  return posts;
}
