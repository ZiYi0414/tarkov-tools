"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Item } from '@/types';
import ItemModal from './item-modal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onItemClick: (item: Item) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, items, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<Item[]>([]);
  // 移除不再需要的状态，因为弹窗切换由父组件处理
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理搜索逻辑
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.taskName.toLowerCase().includes(query)
    );
    setFilteredResults(results);
  }, [searchQuery, items]);

  // 弹窗打开时聚焦到搜索框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 短暂延迟确保弹窗已渲染
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // 阻止body滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = (item: Item) => {
    // 调用父组件的回调，让父组件处理弹窗切换逻辑
    onItemClick(item);
    // 不再在内部显示ItemModal，而是由父组件统一管理
  };

  // 移除不再需要的方法，因为弹窗切换由父组件处理

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-center pt-[13%] bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-xl rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95"
      >
        {/* 搜索框容器 */}
        <div className="relative px-6 pt-8 pb-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-3 pl-12 pr-14 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-lg"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索物品名称、分类或任务..."
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 rounded-full hover:bg-zinc-700/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  handleClear();
                }}
                aria-label="清除搜索"
              >
                <svg
                  className="w-4 h-4"
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
        </div>

        {/* 搜索结果列表 */}
        {filteredResults.length > 0 && (
          <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
            <div className="text-sm text-zinc-500 mb-2">找到 {filteredResults.length} 个结果</div>
            <div className="space-y-2">
              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer transition-all hover:border-blue-500/50 group"
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    handleResultClick(item);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* 物品图片预览 */}
                    {item.imageUrl && (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-700/50 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}

                    {/* 物品信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-xs bg-zinc-700/80 px-2 py-0.5 rounded-full text-zinc-300">
                          {item.category}
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between items-center text-xs text-zinc-400">
                        <span className="truncate">任务: {item.taskName}</span>
                        <div className="flex items-center gap-2">
                          <span>拥有: <span className="text-green-400">{item.owned}</span></span>
                          <span>需要: <span className="text-yellow-400">{item.required}</span></span>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 ease-out"
                          style={{
                            width: `${Math.min((item.owned / item.required) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 无结果提示 */}
        {searchQuery.trim() !== '' && filteredResults.length === 0 && (
          <div className="px-6 pb-8 text-center">
            <div className="text-zinc-500 text-sm">未找到匹配的物品</div>
          </div>
        )}
      </div>

      {/* 物品编辑弹窗由父组件统一管理 */}
    </div>
  );
};

export default SearchModal;