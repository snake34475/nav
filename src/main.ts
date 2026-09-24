import './styles.css'
import { createNavPage } from './app'

const root = document.querySelector<HTMLElement>('#app')
if (!root) throw new Error('找不到应用挂载节点。')
createNavPage(root)
