"use client"

import { useEffect, useRef, useState } from "react"
import type { Item } from "@/types"

interface ItemCardProps {
    item: Item
    onClick: () => void
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

export default function ItemCard({ item, onClick }: ItemCardProps) {
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ x: "right", y: "top" })
    const cardRef = useRef<HTMLDivElement>(null)

    const progress = item.required > 0 ? Math.min((item.owned / item.required) * 100, 100) : 0
    const isComplete = item.owned >= item.required

    useEffect(() => {
        if (showTooltip && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect()
            const tooltipWidth = 256 // w-64 = 16rem = 256px
            const tooltipHeight = 200 // 预估高度
            const padding = 16

            let xPos = "right"
            let yPos = "top"

            // 检测右侧空间
            if (rect.right + tooltipWidth + padding > window.innerWidth) {
                xPos = "left"
            }

            // 检测左侧空间（当右侧不够且左侧也不够时）
            if (xPos === "left" && rect.left - tooltipWidth - padding < 0) {
                xPos = "center"
            }

            // 检测下方空间
            if (rect.bottom + tooltipHeight + padding > window.innerHeight) {
                yPos = "bottom"
            }

            // 检测上方空间
            if (yPos === "bottom" && rect.top - tooltipHeight - padding < 0) {
                yPos = "middle"
            }

            setTooltipPosition({ x: xPos, y: yPos })
        }
    }, [showTooltip])

    const getTooltipClasses = () => {
        const baseClasses = "absolute z-50 w-64 rounded-xl border border-zinc-600 bg-zinc-900 p-4 shadow-xl"

        let positionClasses = ""

        // 水平位置
        if (tooltipPosition.x === "right") {
            positionClasses += "left-full ml-2 "
        } else if (tooltipPosition.x === "left") {
            positionClasses += "right-full mr-2 "
        } else {
            positionClasses += "left-1/2 -translate-x-1/2 "
        }

        // 垂直位置
        if (tooltipPosition.y === "top") {
            positionClasses += "top-0"
        } else if (tooltipPosition.y === "bottom") {
            positionClasses += "bottom-0"
        } else {
            positionClasses += "top-1/2 -translate-y-1/2"
        }

        return `${baseClasses} ${positionClasses}`
    }

    return (
        <div
            ref={cardRef}
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button
                onClick={onClick}
                className={`
          aspect-square w-full rounded-xl border p-2 transition-all 
          hover:border-zinc-600 cursor-pointer 
          flex flex-col items-center justify-center relative overflow-hidden
          ${isComplete
                        ? "border-zinc-500 opacity-70 filter brightness-75"
                        : "border-zinc-700/50 filter brightness-110"}
        `}
            >
                {/* 物品背景图片 */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20 transition-opacity hover:opacity-30"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                {/* 进度背景 */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-zinc-900/40 backdrop-blur-sm transition-all"
                    style={{ height: `${progress}%` }}
                />

                {/* 物品内容 */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="text-xs font-medium text-zinc-300">{item.name}</div>
                    <div className="text-[10px] text-zinc-500">任务Lv.{item.taskLevel}</div>
                    <div className="text-[10px] text-zinc-400">
                        {item.owned}/{item.required}
                    </div>
                </div>

                {/* 已完成标记 */}
                {isComplete && (
                    <div className="absolute top-1 right-1 rounded-full bg-green-500/80 p-1 text-white">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </button>

            {/* 悬浮提示 */}
            {showTooltip && (
                <div className={getTooltipClasses()}>
                    <div className="space-y-2">
                        {/* 物品图片 */}
                        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-zinc-800">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-contain object-center p-2"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                        </div>

                        <div className="border-b border-zinc-700 pb-2">
                            <h4 className="font-medium text-zinc-100">{item.name}</h4>
                            <div className="mt-1 flex flex-col gap-1 text-xs">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <span>任务等级 {item.taskLevel}</span>
                                    <span>·</span>
                                    <span>{item.category}</span>
                                </div>
                                <div className="text-zinc-500">{item.taskName}</div>
                                <div className="flex items-center gap-2">
                                    {item.mustHook && <span className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 text-xs">必带钩</span>}
                                    {item.canStoreInScavCase && <span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-400 font-medium text-xs">可存scav箱</span>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 text-xs">
                            <div className="flex justify-between text-zinc-400">
                                <span>拥有数量</span>
                                <span className="text-zinc-300">
                                    {item.owned} / {item.required}
                                </span>
                            </div>
                            <div className="mt-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                    className={`h-full transition-all ${progress === 100 ? "bg-green-500" : progress === 0 ? "bg-zinc-600" : "bg-blue-500"}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


