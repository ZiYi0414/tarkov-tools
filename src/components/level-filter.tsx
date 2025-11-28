"use client"

interface LevelFilterProps {
    levels: Array<{ id: string; label: string }>
    selectedLevel: string
    onSelectLevel: (level: string) => void
    itemCount: number
}

export default function LevelFilter({ levels, selectedLevel, onSelectLevel, itemCount }: LevelFilterProps) {
    return (
        <div className="w-56 flex-shrink-0">
            <div className="rounded-2xl border border-zinc-700/50 bg-zinc-900/50 overflow-hidden">
                {/* 标题栏 */}
                <div className="border-b border-zinc-700/50 bg-zinc-800/30 px-5 py-3">
                    <h3 className="text-sm font-medium text-zinc-300">等级筛选</h3>
                </div>

                {/* 选项列表 */}
                <div className="p-3 space-y-2">
                    {levels.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => onSelectLevel(level.id)}
                            className={`
                relative w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all
                ${selectedLevel === level.id
                                    ? "bg-zinc-800 text-zinc-100 border border-zinc-600"
                                    : "bg-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent"
                                }
              `}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>

                {/* 统计 */}
                <div className="border-t border-zinc-700/50 bg-zinc-800/30 p-4 text-center">
                    <div className="text-xs text-zinc-500">物品数</div>
                    <div className="mt-2 text-2xl font-medium text-zinc-200">{itemCount}</div>
                </div>
            </div>
        </div>
    )
}
