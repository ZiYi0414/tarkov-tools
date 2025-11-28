"use client"

import { useState, useEffect } from "react"
import type { Item } from "@/types"


interface ItemModalProps {
  isOpen: boolean
  item: Item
  onClose: () => void
  onSave: (owned: number) => void
}

const getItemTypeText = (type: string): string => {
  switch (type) {
    case 'weapon': return '武器';
    case 'accessory': return '配件';
    case 'clothing': return '服装';
    case 'hideout': return '藏身处';
    case 'task': return '任务物品';
    default: return type;
  }
}

export default function ItemModal({ isOpen, item, onClose, onSave }: ItemModalProps) {
  const [owned, setOwned] = useState(Math.min(Math.max(0, item.owned), item.required))

  useEffect(() => {
    setOwned(Math.min(Math.max(0, item.owned), item.required)) // 确保初始值在有效范围内
  }, [item.owned, item.required])

  if (!isOpen) return null

  const handleSave = () => {
    onSave(owned)
  }

  const progress = item.required > 0 ? Math.min((owned / item.required) * 100, 100) : 0
  const isComplete = owned >= item.required

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-600 bg-zinc-900 p-6 shadow-2xl">
        {/* 物品图片 */}
        <div className="mb-4 relative h-40 w-full overflow-hidden rounded-xl bg-zinc-800">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-contain object-center p-4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-zinc-900/40" />
        </div>

        {/* 标题 */}
        <div className="mb-4 border-b border-zinc-700 pb-4">
          <h3 className="text-xl font-medium text-zinc-100">{item.name}</h3>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-3 text-zinc-400">
              <span>任务等级 {item.taskLevel}</span>
              <span>·</span>
              <span>{item.category}</span>
            </div>
            <div className="text-zinc-500">{item.taskName}</div>
            <div className="flex items-center gap-2 flex-wrap">
              {item.mustHook && <span className="px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 text-xs">必带钩</span>}
              <span className="text-zinc-400">类型: {getItemTypeText(item.itemType)}</span>
              {item.canStoreInScavCase && <span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-400 font-medium text-xs">可存scav箱</span>}
            </div>
          </div>
        </div>

        {/* 数量输入 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-zinc-300">拥有数量</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOwned(owned - 1)}
              disabled={owned <= 0}
              className={`h-12 w-12 flex items-center justify-center rounded-xl border ${owned <= 0 ? 'border-zinc-800 bg-zinc-900 text-zinc-600' : 'border-zinc-700 bg-zinc-800 text-zinc-100 text-xl hover:bg-zinc-700'} focus:outline-none`}
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              max={item.required}
              value={owned}
              onChange={(e) => setOwned(Math.min(Math.max(0, Number.parseInt(e.target.value) || 0), item.required))}
              className="flex-1 h-12 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 text-center text-lg focus:border-zinc-500 focus:outline-none"
            />
            <button
              onClick={() => setOwned(owned + 1)}
              disabled={owned >= item.required}
              className={`h-12 w-12 flex items-center justify-center rounded-xl border ${owned >= item.required ? 'border-zinc-800 bg-zinc-900 text-zinc-600' : 'border-zinc-700 bg-zinc-800 text-zinc-100 text-xl hover:bg-zinc-700'} focus:outline-none`}
            >
              +
            </button>
          </div>
          <div className="mt-2 flex justify-between text-xs text-zinc-500">
            <span>需要数量: {item.required}</span>
            <span className={isComplete ? "text-green-500" : "text-zinc-500"}>
              {isComplete ? "✓ 已满足" : `还需 ${item.required - owned}`}
            </span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs text-zinc-400">
            <span>完成进度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all ${progress === 100 ? "bg-green-500" : progress === 0 ? "bg-zinc-600" : "bg-blue-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl border border-blue-600 bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
