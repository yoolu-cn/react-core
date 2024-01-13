/**
 * step1: 实现 js 插入 dom 到页面
 * step2: 模拟实现 vdom
 * step3: vdom => 动态创建 vdom
 * step4: 动态创建 dom 节点 (优化)
 *   1. 创建 node 节点
 *   2. 设置 props 参数
 *   3. 添加到父容器
 * step5: 构建 Api，与 React 行为保持一致
 * step6: 重构项目结构
 */
import ReactDOM from './core/ReactDom';
import App from './App';

ReactDOM.createRoot(document.querySelector('#root')).render(App);