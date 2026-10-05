'use client';

import { SearchBar } from '@/components/SearchBar';
import { useSearchParams } from 'next/navigation';
import { startTransition, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { assessSeo, searchIndex, SearchResult } from '@/lib/indexer';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      const timer = setTimeout(() => {
        setResults([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    startTransition(() => setLoading(true));
    // Add small delay to simulate search latency
    const timer = setTimeout(() => {
      try {
        const data = searchIndex(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col w-full h-dvh overflow-auto">
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-800 bg-black px-4 py-4 sm:gap-8 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-widest text-white sm:text-xl">MW Search</Link>
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-7 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            Results for <span className="font-medium text-gray-200">&quot;{query}&quot;</span>
          </p>
          {!loading && results.length > 0 && (
            <p className="text-xs text-gray-600">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-gray-400">Searching...</div>
        ) : results.length > 0 ? (
          <div className="flex flex-col">
            {results.map(result => {
              const seo = assessSeo(result);

              return (
                <article key={result.url} className="border-b border-gray-800 py-6 first:pt-0 last:border-0">
                  <div className="min-w-0">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all text-xs text-gray-500 transition-colors hover:text-gray-300"
                    >
                      {result.url}
                    </a>
                    <Link
                      href={result.url}
                      target="_blank"
                      className="mt-1 block text-lg font-medium leading-7 text-blue-400 decoration-blue-400/50 underline-offset-4 hover:underline sm:text-xl"
                    >
                      {result.title || result.url}
                    </Link>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-300">
                      {result.description || 'No description available.'}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="rounded-md border border-gray-700 bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-gray-200">
                        Query score <span className="ml-1 text-white">{result.score}</span>
                      </span>
                      <span className="text-xs text-gray-600">Match details</span>
                      <span className="text-xs text-gray-500">Title {result.breakdown.title}</span>
                      <span className="text-xs text-gray-500">Keywords {result.breakdown.keyword}</span>
                      <span className="text-xs text-gray-500">Description {result.breakdown.description}</span>
                      <span className="text-xs text-gray-500">Content {result.breakdown.content}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-gray-400">SEO {seo.score}/100</span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          seo.isGood
                            ? 'border-green-900 bg-green-950/30 text-green-400'
                            : 'border-amber-900 bg-amber-950/30 text-amber-400'
                        }`}
                      >
                        {seo.isGood ? 'Good' : 'Needs work'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
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
