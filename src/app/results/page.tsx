'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { assessSeo, getIndex, IndexedPage } from '@/lib/indexer';

export default function IndexedResultsPage() {
  const [pages, setPages] = useState<IndexedPage[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPages(getIndex()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-black text-gray-200">
      <NavBar />
      <main className="flex-1 w-full max-w-4xl p-6 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Indexed Results</h1>
          <p className="text-sm text-gray-500 mt-2">
            On-page SEO score from basic checks, not search relevance or a Google ranking.
          </p>
        </div>

        {pages.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-800">
            {pages.map(page => {
              const assessment = assessSeo(page);

              return (
                <article key={page.url} className="py-6 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg text-blue-400 hover:underline"
                      >
                        {page.title || page.url}
                      </a>
                      <p className="text-sm text-gray-500 break-all mt-1">{page.url}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-200">
                        SEO score: {assessment.score}/100
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          assessment.isGood
                            ? 'text-green-400 border-green-900 bg-green-950/30'
                            : 'text-amber-400 border-amber-900 bg-amber-950/30'
                        }`}
                      >
                        {assessment.isGood ? 'Good SEO' : 'Needs improvement'}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    {assessment.checks.map(check => (
                      <li key={check.label} className="flex gap-2 text-gray-400">
                        <span className={check.passed ? 'text-green-400' : 'text-amber-400'} aria-hidden="true">
                          {check.passed ? '✓' : '·'}
                        </span>
                        <span>
                          <span className="text-gray-300">{check.label}:</span> {check.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">
            No pages have been indexed yet.{' '}
            <Link href="/crawler" className="text-blue-400 hover:underline">
              Add a website
            </Link>{' '}
            to see its SEO score here.
          </p>
        )}
      </main>
    </div>
  );
}
