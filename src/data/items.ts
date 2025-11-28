import { Item } from '../types'

// 初始物品数据
export const initialItems: Item[] = [
  {
    id: 'ak-74n',
    name: '60发弹匣',
    taskLevel: 9,
    category: '配件',
    taskName: 'LV9-蛋卷冰淇淋',
    required: 3,
    owned: 0,
    characterId: 1,
    mustHook: true,
    itemType: 'weapon',
    canStoreInScavCase: false,
    imageUrl: '/goods/1.png'
  },
  {
    id: 'face-cover',
    name: '面巾',
    taskLevel: 9,
    category: '服装',
    taskName: 'LV19-惩罚者',
    required: 6,
    owned: 0,
    characterId: 1,
    mustHook: true,
    itemType: 'clothing',
    canStoreInScavCase: false,
    imageUrl: '/goods/2.png'
  },
]

// 默认导出
export default initialItems