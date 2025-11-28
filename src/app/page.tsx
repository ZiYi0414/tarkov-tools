// 创建一个客户端组件包装客户端逻辑
import InventoryClient from './inventory-client'

// 注意：generateItems函数已替换为初始物品数据导入
// 如需添加更多物品，请直接编辑src/data/items.ts文件

export default function InventoryPage() {
  // 服务器端渲染的页面组件
  // 返回客户端组件，包含所有客户端交互逻辑
  return <InventoryClient />
}
