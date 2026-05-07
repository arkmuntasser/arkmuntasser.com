const GITHUB_API = 'https://api.github.com';
const USERNAME = 'arkmuntasser';

export async function fetchGithubRepos(limit = 10) {
  const res = await fetch(
    `${GITHUB_API}/users/${USERNAME}/repos?sort=pushed&direction=desc&per_page=${limit}&type=public`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const repos = await res.json();
	const excludedRepos = ['arkm.xyz', 'arkmuntasser'];

  return repos
    .filter((r) => !r.fork && !excludedRepos.includes(r.name))
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
    }));
}
