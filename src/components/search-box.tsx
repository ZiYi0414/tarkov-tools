"use client"

import React, { useState, useEffect } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, placeholder = '搜索物品名称...' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full px-4 py-2 pl-10 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
        value={searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {searchQuery && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 hover:text-zinc-400"
          onClick={handleClear}
          aria-label="清除搜索"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBox;