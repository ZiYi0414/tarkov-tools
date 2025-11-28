// 物品数据类型
// 所属任务名称( lv9-蛋卷冰淇凌)
// 必须带钩
// 物品类型（武器/配件/服装/藏身处/任务物品）
// 是否可存入scav垃圾箱
export interface Item {
    id: string
    name: string
    taskLevel: number
    category: string
    taskName: string // 所属任务名称
    required: number // 需要数量
    owned: number // 已拥有数量
    characterId: number // 关联的角色ID
    mustHook: boolean // 是否必带钩
    itemType: 'weapon' | 'accessory' | 'clothing' | 'hideout' | 'task' // 物品类型
    canStoreInScavCase: boolean // 是否可存入scav垃圾箱
    imageUrl: string // 物品图片路径，用作背景
    attributes?: {
        [key: string]: number | undefined
    }
}
