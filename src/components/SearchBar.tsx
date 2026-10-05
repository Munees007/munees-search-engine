'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Logo from '../../public/images/Logo.png';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchIndex } from '@/lib/indexer';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    
    // Debounce search query
    const timeoutId = setTimeout(() => {
      try {
        const results = searchIndex(query);
        setSuggestions(results.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      setShowSuggestions(false);
      
      // If user types a full URL, redirect to crawler and auto-crawl
      if (trimmedQuery.startsWith('http://') || trimmedQuery.startsWith('https://')) {
        router.push(`/crawler?url=${encodeURIComponent(trimmedQuery)}&auto=true`);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    }
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setShowSuggestions(false);
    
    if (title.startsWith('http://') || title.startsWith('https://')) {
      router.push(`/crawler?url=${encodeURIComponent(title)}&auto=true`);
    } else {
      router.push(`/search?q=${encodeURIComponent(title)}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearch} className='flex items-center gap-2 border border-gray-600 bg-gray-900 py-2 px-2 rounded-full w-full'>
          <Image src={Logo} width={30} height={30} className='rounded-full border border-gray-600' alt='MW Logo' />
          <input 
            className='outline-none w-full bg-transparent text-white text-lg px-2' 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search the web..."
          />
          <button type="submit" className='mr-2 text-gray-400 hover:text-white select-none cursor-pointer hover:scale-105 active:scale-95'>
            <FaSearch size={22} />
          </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
          {suggestions.map((s, idx) => (
            <div 
              key={idx} 
              onClick={() => handleSuggestionClick(s.title || s.url)}
              className="px-4 py-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3 border-b border-gray-800 last:border-0 transition-colors"
            >
              <FaSearch size={14} className="text-gray-500" />
              <div className="flex flex-col">
                <span className="text-white text-sm">{s.title}</span>
                <span className="text-gray-500 text-xs truncate max-w-100">{s.url}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}