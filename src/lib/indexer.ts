'use client';

export interface IndexedPage {
  url: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
}

export interface SeoCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export interface SeoAssessment {
  score: number;
  isGood: boolean;
  checks: SeoCheck[];
}

export function assessSeo(page: IndexedPage): SeoAssessment {
  const titleLength = page.title.trim().length;
  const descriptionLength = page.description.trim().length;
  const contentLength = page.content.trim().length;
  const checks: SeoCheck[] = [
    {
      label: 'Page title',
      passed: titleLength > 0,
      detail: titleLength > 0 ? 'A title is present.' : 'Add a page title.',
    },
    {
      label: 'Title length',
      passed: titleLength >= 30 && titleLength <= 60,
      detail: `${titleLength} characters (recommended: 30–60).`,
    },
    {
      label: 'Meta description',
      passed: descriptionLength > 0,
      detail: descriptionLength > 0 ? 'A description is present.' : 'Add a meta description.',
    },
    {
      label: 'Description length',
      passed: descriptionLength >= 120 && descriptionLength <= 160,
      detail: `${descriptionLength} characters (recommended: 120–160).`,
    },
    {
      label: 'Page content',
      passed: contentLength >= 300,
      detail: `${contentLength} characters of text (recommended: at least 300).`,
    },
  ];
  const score = Math.round((checks.filter(check => check.passed).length / checks.length) * 100);

  return {
    score,
    isGood: score >= 60,
    checks,
  };
}

export const defaultSites: IndexedPage[] = [
  {
    url: "https://nextjs.org",
    title: "Next.js by Vercel - The React Framework for the Web",
    description: "Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications by extending the latest React features.",
    keywords: ["react", "framework", "next.js", "vercel", "seo", "web", "javascript"],
    content: "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more."
  },
  {
    url: "https://developer.mozilla.org/en-US/",
    title: "MDN Web Docs",
    description: "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
    keywords: ["html", "css", "javascript", "web", "development", "mdn", "mozilla"],
    content: "Resources for developers, by developers. Documenting web technologies, including CSS, HTML, and JavaScript, since 2005."
  },
  {
    url: "https://berkshirehathaway.com",
    title: "Berkshire Hathaway Inc.",
    description: "",
    keywords: [],
    content: "Official Home Page. A Message from Warren E. Buffett. GEICO, BNSF, Berkshire Hathaway Energy. Letters to shareholders."
  },
  {
    url: "https://craigslist.org",
    title: "craigslist",
    description: "",
    keywords: [],
    content: "craigslist provides local classifieds and forums for jobs, housing, for sale, services, local community, and events"
  }
];

export function getIndex(): IndexedPage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('search_index');
    if (!data) return [];
    return JSON.parse(data) as IndexedPage[];
  } catch (error) {
    console.error('Failed to read index from localStorage:', error);
    return [];
  }
}

export function saveToIndex(page: IndexedPage) {
  if (typeof window === 'undefined') return;
  const index = getIndex();
  const existingIndex = index.findIndex(p => p.url === page.url);
  
  if (existingIndex !== -1) {
    index[existingIndex] = page;
  } else {
    index.push(page);
  }

  localStorage.setItem('search_index', JSON.stringify(index));
}

export function seedIndex(): number {
  if (typeof window === 'undefined') return 0;
  const index = getIndex();
  let addedCount = 0;
  
  for (const site of defaultSites) {
    const exists = index.some(p => p.url === site.url);
    if (!exists) {
      index.push(site);
      addedCount++;
    }
  }
  
  localStorage.setItem('search_index', JSON.stringify(index));
  return addedCount;
}

export interface SearchResult extends IndexedPage {
  score: number;
  breakdown: {
    title: number;
    keyword: number;
    description: number;
    content: number;
  }
}

export function searchIndex(query: string): SearchResult[] {
  if (!query || typeof window === 'undefined') return [];
  const index = getIndex();
  const results: SearchResult[] = [];
  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  for (const page of index) {
    let titleScore = 0;
    let keywordScore = 0;
    let descScore = 0;
    let contentScore = 0;

    const pageTitle = page.title.toLowerCase();
    const pageDesc = page.description.toLowerCase();
    const pageContent = page.content.toLowerCase();
    const pageKeywords = page.keywords.map(k => k.toLowerCase());

    for (const term of queryTerms) {
      if (pageTitle.includes(term)) titleScore += 5;
      if (pageKeywords.some(k => k.includes(term))) keywordScore += 3;
      if (pageDesc.includes(term)) descScore += 2;
      if (pageContent.includes(term)) contentScore += 1;
    }

    const totalScore = titleScore + keywordScore + descScore + contentScore;
    if (totalScore > 0) {
      results.push({
        ...page,
        score: totalScore,
        breakdown: {
          title: titleScore,
          keyword: keywordScore,
          description: descScore,
          content: contentScore
        }
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
