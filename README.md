# react-core 源码拆解分析

## react 源码学习方式
 - 大任务拆小，确保小任务足够简单
 - 通过问题来驱动自己主动思考
 - 每天进步一点点
 - 记录学习过程

## 实现最简洁 react，模拟 vdom，并在页面中渲染。 

#### 步骤拆分：

    1. 实现 js 插入 dom 到页面
    2. 模拟实现 vdom
    3. vdom => 动态创建 vdom
    4. 动态创建 dom 节点 (优化)
       1. 创建 node 节点
       2. 设置 props 参数
       3. 添加到父容器
    5. 构建 Api，与 React 行为保持一致
    6. 重构项目结构
    7. 接入 jsx (遗留错误)
        /**
        * @TODO 实现 function component
        * 原因： Uncaught DOMException: Failed to execute 'createElement' on 'Document': The tag name provided ('() => /\* @__PURE__ *\/ 
        * React.createElement("div", { id: "app" }, "hello word!")') is not a valid name.
        */
#### 遗留问题
> 超大量 vdom 渲染造成浏览器卡顿如何解决？
