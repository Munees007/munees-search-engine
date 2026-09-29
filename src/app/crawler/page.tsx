'use client';

import { NavBar } from '@/components/NavBar';
import { useState } from 'react';
import Link from 'next/link';
import { IndexedPage, saveToIndex, seedIndex } from '@/lib/indexer';

export default function CrawlerPage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'extracting' | 'indexing' | 'ready' | 'error'>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<IndexedPage | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus('fetching');
    setError('');
    setResult(null);

    try {
      // Fake delays for visualization
      await new Promise(r => setTimeout(r, 800));
      setStatus('extracting');
      
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to crawl');
      }

      await new Promise(r => setTimeout(r, 800));
      setStatus('indexing');
      
      // Save to localStorage!
      saveToIndex(data.data);
      
      await new Promise(r => setTimeout(r, 800));
      setStatus('ready');
      setResult(data.data);
      setUrl('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setStatus('error');
    }
  };

  const handleLoadDemo = () => {
    setSeeding(true);
    try {
      const added = seedIndex();
      alert(`Successfully loaded ${added} demo sites into your local storage!`);
    } catch (err) {
      alert('Error saving to local storage.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-black text-gray-200">
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
        
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Add Website to Index</h1>
          <button 
            onClick={handleLoadDemo}
            disabled={seeding}
            className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 border border-gray-700"
          >
            {seeding ? 'Loading...' : 'Load Demo Sites'}
          </button>
        </div>
        
        <form onSubmit={handleCrawl} className="flex w-full gap-2 mb-12">
          <input
            type="url"
            required
            className="flex-1 bg-gray-900 border border-gray-600 rounded-md px-4 py-2 outline-none focus:border-gray-400 text-white"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={status !== 'idle' && status !== 'ready' && status !== 'error'}
          />
          <button
            type="submit"
            disabled={status !== 'idle' && status !== 'ready' && status !== 'error'}
            className="bg-gray-100 text-black px-6 py-2 rounded-md font-medium hover:bg-white disabled:opacity-50"
          >
            Crawl
          </button>
        </form>

        {error && (
          <div className="text-red-400 mb-8 p-4 border border-red-900 bg-red-950/30 rounded-md w-full">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 w-full max-w-md">
          <Step 
            active={status === 'fetching'} 
            done={['extracting', 'indexing', 'ready'].includes(status)} 
            label="Fetch HTML" 
          />
          <Arrow />
          <Step 
            active={status === 'extracting'} 
            done={['indexing', 'ready'].includes(status)} 
            label="Extract Content" 
          />
          <Arrow />
          <Step 
            active={status === 'indexing'} 
            done={status === 'ready'} 
            label="Create Index" 
          />
          <Arrow />
          <Step 
            active={status === 'ready'} 
            done={status === 'ready'} 
            label="Ready For Search" 
            highlight={status === 'ready'}
          />
        </div>

        {status === 'ready' && result && (
          <div className="mt-12 p-6 border border-gray-800 bg-gray-900 rounded-md w-full animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Indexed Data</h2>
            <div className="flex flex-col gap-3 text-sm">
              <p><span className="text-gray-500 w-24 inline-block">Title:</span> {result.title}</p>
              <p><span className="text-gray-500 w-24 inline-block">URL:</span> {result.url}</p>
              <p><span className="text-gray-500 w-24 inline-block">Keywords:</span> {result.keywords.length > 0 ? result.keywords.join(', ') : 'None'}</p>
              <p><span className="text-gray-500 w-24 inline-block">Content:</span> {result.content.substring(0, 100)}...</p>
            </div>
            <div className="mt-6 flex gap-4">
              <Link href="/" className="text-blue-400 hover:underline text-sm">Go to Search</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Step({ active, done, label, highlight }: { active: boolean, done: boolean, label: string, highlight?: boolean }) {
  let borderClass = 'border-gray-800 text-gray-500';
  if (active) borderClass = 'border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
  if (done) borderClass = 'border-green-500 text-green-400';
  if (highlight) borderClass = 'border-white text-white font-bold bg-white/5';

  return (
    <div className={`p-4 border rounded-md text-center transition-all duration-500 ${borderClass}`}>
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center text-gray-700">
      ↓
    </div>
  );
}
