"use client"

import { useEffect, useState } from "react"
import { characters, levels, allTab } from "@/context/characters"
import CharacterTab from "@/components/character-tab"
import LevelFilter from "@/components/level-filter"
import ItemCard from "@/components/item-card"
import ItemModal from "@/components/item-modal"
import SearchBox from "@/components/search-box"
import SearchModal from "@/components/search-modal"
import { Item } from "@/types"
import { initialItems } from "../data/items"

// 注意：generateItems函数已替换为初始物品数据导入
// 如需添加更多物品，请直接编辑src/data/items.ts文件

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<Item[]>(() => {
    // 尝试从localStorage加载物品数据
    const savedItems = localStorage.getItem('inventory-items')
    if (savedItems) {
      return JSON.parse(savedItems)
    }
    // 如果没有保存的数据，使用初始物品数据
    return initialItems
  })
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hideCompleted, setHideCompleted] = useState(() => {
    // 从localStorage加载初始状态，如果没有则默认为false
    const saved = localStorage.getItem('hide-completed-items')
    return saved ? JSON.parse(saved) : false
  })
  const [showSearchModal, setShowSearchModal] = useState(false)

  // 当hideCompleted状态变更时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('hide-completed-items', JSON.stringify(hideCompleted))
  }, [hideCompleted])

  useEffect(() => {
    if (activeTab === 0) {
      // 全部选项卡时，加载所有角色的数据
      characters.forEach((char) => {
        const saved = localStorage.getItem(`character-${char.id}-items`)
        if (saved) {
          try {
            const savedData = JSON.parse(saved)
            setItems((prevItems) =>
              prevItems.map((item) => ({
                ...item,
                owned: item.characterId === char.id ? savedData[item.id] || 0 : item.owned,
              })),
            )
          } catch (e) {
            console.error("Failed to load data:", e)
          }
        }
      })
    } else {
      // 单个角色时，只加载该角色的数据
      const saved = localStorage.getItem(`character-${activeTab}-items`)
      if (saved) {
        try {
          const savedData = JSON.parse(saved)
          setItems((prevItems) =>
            prevItems.map((item) => ({
              ...item,
              owned: item.characterId === activeTab ? savedData[item.id] || 0 : item.owned,
            })),
          )
        } catch (e) {
          console.error("Failed to load data:", e)
        }
      }
    }
  }, [activeTab])

  // 保存到 localStorage
  const saveItems = (updatedItems: Item[]) => {
    const data: Record<string, number> = {}
    updatedItems.forEach((item) => {
      if (item.characterId === activeTab || activeTab === 0) {
        data[item.id] = item.owned
      }
    })
    updatedItems.forEach((item) => {
      if (item.id === updatedItems.find((i) => i.id === item.id)?.id) {
        const charData = JSON.parse(localStorage.getItem(`character-${item.characterId}-items`) || "{}")
        charData[item.id] = item.owned
        localStorage.setItem(`character-${item.characterId}-items`, JSON.stringify(charData))
      }
    })
  }

  // 更新物品拥有数量
  const updateItemOwned = (itemId: string, owned: number) => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, owned } : item))
    setItems(updatedItems)
    saveItems(updatedItems)
  }

  const filteredItems = items.filter((item) => {
    // 检查物品是否已完成
    const isCompleted = item.owned >= item.required
    // 如果开启了隐藏已满足选项且物品已满足，则过滤掉
    if (hideCompleted && isCompleted) return false

    // 如果是全部选项卡，显示所有角色的物品
    if (activeTab === 0) {
      // 搜索过滤：如果有搜索词，物品名称必须包含搜索词
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) {
        return false
      }

      // 等级筛选
      if (selectedLevel === "all") return true
      const levelMap: Record<string, [number, number]> = {
        lv1: [1, 10],
        lv2: [11, 20],
        lv3: [21, 30],
        lv4: [31, 40],
        lv5: [41, 50],
        lv6: [51, 100],
      }
      const range = levelMap[selectedLevel]
      return item.taskLevel >= range[0] && item.taskLevel <= range[1]
    }

    // 单个角色时，筛选该角色的物品
    if (item.characterId !== activeTab) return false

    // 搜索过滤：如果有搜索词，物品名称必须包含搜索词
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) {
      return false
    }

    // 然后按等级筛选
    if (selectedLevel === "all") return true
    const levelMap: Record<string, [number, number]> = {
      lv1: [1, 10],
      lv2: [11, 20],
      lv3: [21, 30],
      lv4: [31, 40],
      lv5: [41, 50],
      lv6: [51, 100],
    }
    const range = levelMap[selectedLevel]
    return item.taskLevel >= range[0] && item.taskLevel <= range[1]
  })

  // 计算统计数据
  const totalOwned = filteredItems.reduce((sum, item) => sum + item.owned, 0)
  const totalRequired = filteredItems.reduce((sum, item) => sum + item.required, 0)
  const completionRate = totalRequired > 0 ? Math.round((totalOwned / totalRequired) * 100) : 0

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleModalSave = (owned: number) => {
    if (selectedItem) {
      updateItemOwned(selectedItem.id, owned)
    }
    handleModalClose()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100">
      {/* 顶部选项卡区域 */}
      <div className="border-b border-zinc-700/50 bg-zinc-900/80 px-6 pt-4">
        <div className="flex">
          <CharacterTab
            key={allTab.id}
            character={allTab}
            isActive={activeTab === allTab.id}
            onClick={() => setActiveTab(allTab.id)}
          />
          {characters.map((character) => (
            <CharacterTab
              key={character.id}
              character={character}
              isActive={activeTab === character.id}
              onClick={() => setActiveTab(character.id)}
            />
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <div className="bg-zinc-950 p-8">
        <div className="flex gap-6">
          {/* 左侧等级筛选 */}
          <LevelFilter
            levels={levels}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            itemCount={filteredItems.length}
          />

          {/* 右侧物品网格 */}
          <div className="flex-1">
            {/* 状态栏 */}
            <div className="mb-4 rounded-2xl border border-zinc-700/50 bg-zinc-900/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-zinc-500">
                    当前:
                    <span className="text-zinc-300 font-medium">
                      {activeTab === 0 ? "全部" : characters.find((c) => c.id === activeTab)?.name}
                    </span>
                  </span>
                  <span className="text-zinc-500">
                    筛选:
                    <span className="text-zinc-300 font-medium">
                      {levels.find((l) => l.id === selectedLevel)?.label}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">隐藏已满足</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={hideCompleted}
                        onChange={(e) => setHideCompleted(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>搜索</span>
                  </button>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-zinc-500">
                    拥有: <span className="text-zinc-300 font-medium">{totalOwned}</span>
                  </span>
                  <span className="text-zinc-500">
                    需要: <span className="text-zinc-300 font-medium">{totalRequired}</span>
                  </span>
                  <span className="text-zinc-500">
                    完成度: <span className="text-zinc-300 font-medium">{completionRate}%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 物品网格 */}
            <div className="rounded-2xl border border-zinc-700/50 bg-zinc-900/50 p-6">
              <div className="grid grid-cols-8 gap-3">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 物品编辑弹窗 */}
      {selectedItem && (
        <ItemModal isOpen={isModalOpen} item={selectedItem} onClose={handleModalClose} onSave={handleModalSave} />
      )}

      {/* 搜索弹窗 */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => {
          // 只有当物品编辑弹窗没有打开时，才关闭搜索弹窗
          if (!isModalOpen) {
            setShowSearchModal(false)
          }
        }}
        items={items}
        onItemClick={(item) => {
          setSelectedItem(item);
          setIsModalOpen(true);
          // 保留搜索弹窗，不设置为false
        }}
      />
    </div>
  )
}
