import './styles.css'
import { createNavPage } from './app'
import { navigation } from './nav-data'
import { fetchRemoteCategory } from './remote-pages'

const root = document.querySelector<HTMLElement>('#app')
if (!root) throw new Error('找不到应用挂载节点。')

// 先拉取 my-pages 的远程清单（内部带超时与失败兜底，不会抛错），
// 把「我的页面」分类追加到静态数据末尾，再一次性渲染整站。
const boot = async () => {
  const remoteCategory = await fetchRemoteCategory()
  createNavPage(root, [...navigation, remoteCategory])
}

boot()
