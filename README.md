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

## 实现任务调度器

#### dom 树特别大导致的渲染卡顿原理，以及解决方案
###### 原理
浏览器单线程等等（后续补充）
###### 解决思路
把大任务拆解为多个 task 里面完成，采用 requestIdleCallback 分帧运算

###### 补充学习 requestIdleCallback
    1. requestIdleCallback 是什么？
    2. requestIdleCallback 和 React fiber 架构有什么关系？
    3. requestIdleCallback 对于性能优化有什么帮助？
    4. requestIdleCallback 优缺点？
    5. requestIdleCallback 和 requestAnimationFrame 有什么区别？
    6. 模拟实现 requestIdleCallback？

https://blog.csdn.net/KlausLily/article/details/122852531
https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback

#### 遗留问题
> 如何做到每次只渲染几个节点呢？在下次执行的时候依然从之前的位置执行？

## 实现 fiber 架构

#### 实现任务调度器的解决方案

###### 解决思路
把树结构转变成链表结构，产生两种方案：
  
  - 一次转化完成 vdom
  - 边执行边转换
  
这里选择第二种，不会卡任务，单次渲染耗时低

###### 补充学习

#### 实现 performUnitOfWork 
    1. 创建 dom
    2. 把 dom 添加到父容器内
    3. 设置 dom 的props
    4. 建立关系 child sibling parent
    5. 返回下一个节点


