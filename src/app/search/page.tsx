'use client';

import { NavBar } from '@/components/NavBar';
import { SearchBar } from '@/components/SearchBar';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

interface SearchResult {
  url: string;
  title: string;
  description: string;
  score: number;
  breakdown: {
    title: number;
    keyword: number;
    description: number;
    content: number;
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="flex flex-col w-full h-dvh overflow-auto">
      <div className="p-6 border-b border-gray-800 flex items-center gap-8 bg-black sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold tracking-widest text-white shrink-0">MW Search</Link>
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl p-6 mx-auto">
        <p className="text-sm text-gray-500 mb-6">
          Showing results for "{query}"
        </p>

        {loading ? (
          <div className="text-gray-400">Searching...</div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-8">
            {results.map((result, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{result.url}</span>
                  <div className="flex items-center gap-2 text-xs bg-gray-900 border border-gray-800 rounded-md px-3 py-1">
                    <span className="font-bold text-gray-300">Score: {result.score}</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-500">Title(x5): {result.breakdown.title}</span>
                    <span className="text-gray-500">Key(x3): {result.breakdown.keyword}</span>
                    <span className="text-gray-500">Desc(x2): {result.breakdown.description}</span>
                    <span className="text-gray-500">Content(x1): {result.breakdown.content}</span>
                  </div>
                </div>
                <Link href={result.url} target="_blank" className="text-xl text-blue-400 hover:underline">
                  {result.title || result.url}
                </Link>
                <p className="text-sm text-gray-300 mt-1">
                  {result.description || "No description available."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">
            No results found. Try <Link href="/crawler" className="text-blue-400 hover:underline">crawling some pages</Link> first.
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen"></div>}>
      <SearchContent />
    </Suspense>
  );
}
