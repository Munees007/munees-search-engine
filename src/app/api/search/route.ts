import { NextRequest, NextResponse } from 'next/server';
import { getIndex, IndexedPage } from '@/lib/indexer';

export interface SearchResult extends IndexedPage {
  score: number;
  breakdown: {
    title: number;
    keyword: number;
    description: number;
    content: number;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const index = getIndex();
  const results: SearchResult[] = [];

  const queryTerms = query.split(/\s+/).filter(Boolean);

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
      // Title match
      if (pageTitle.includes(term)) titleScore += 5;
      
      // Keyword match
      if (pageKeywords.some(k => k.includes(term))) keywordScore += 3;

      // Description match
      if (pageDesc.includes(term)) descScore += 2;

      // Content match
      // Count occurrences in content to give a slightly better score, 
      // but keeping it simple as per requirements. We'll just add 1 per term match.
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

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return NextResponse.json({ results });
}
