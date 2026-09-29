import { NextResponse } from 'next/server';
import { saveToIndex, getIndex, IndexedPage } from '@/lib/indexer';

const defaultSites: IndexedPage[] = [
  // Best SEO Examples
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
  // Worst SEO Examples (Famous but lack modern meta tags or have minimal text)
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

export async function POST() {
  try {
    const index = getIndex();
    let addedCount = 0;
    
    for (const site of defaultSites) {
      const exists = index.some(p => p.url === site.url);
      if (!exists) {
        saveToIndex(site);
        addedCount++;
      }
    }
    
    return NextResponse.json({ success: true, added: addedCount, total: index.length + addedCount });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
