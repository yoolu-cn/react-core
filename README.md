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

#### 步骤拆分
    1. 启动浏览器空闲时永久调用任务
    2. render 时，初始化要渲染的第一个节点，空闲时调用 performUnitOfWork 渲染当前节点，并返回下一个要渲染的节点
    3. 实现 performUnitOfWork
       1. 创建 dom
       2. 把 dom 添加到父容器内
       3. 设置 dom 的props
       4. 生成链表，建立关系 child sibling parent
       5. 返回下一个节点
    4. 代码重构

#### 遗留问题
> requestIdleCallback 分帧运算，在特殊情况下中间没有空闲时间，用户会看到渲染一半的 dom。这种情况如何解决？
   
## 统一提交

#### 遗留问题的解决方案

计算结束后统一添加到屏幕里面

#### 步骤拆分

    1. 记录初始 root 节点
    2. 当链表执行结束，遍历 dom 树，挂载dom

## 支持 function component

#### 解决思路
把 fc 当成一个盒子，然后拆盒子，盒子里的内容是普通的 dom 树。

#### 步骤拆分

    1. type 的区分处理
    2. 区分 fc 和 非 fc
    3. 添加到视图
    4. porps 的处理

## 实现绑定事件

#### 如何点击触发更新
基于 onClick 来注册点击事件, onClick 为属性，props 判断 key 为事件时，给 dom 绑定事件监听。

## 实现更新

#### 问题
    1. 如何触发更新？
    2. 如何获取新老fiber？
    3. 老的 fiber 存在哪里？

#### 解决方案

    1. 将新的root 赋值给执行工作单元，触发更新
    2. 使用链表，每一个节点一一对应
    3. 使用链表将老的 fiber 通过引用，存储到新的 fiber

#### 拆分步骤

    1. 存储旧的root
    2. 通过 type 是否一致来判断，是否更新节点，还是新增节点，重新生成链表，标记更新还是新增
       1. 难点： 新的节点和老的节点一一对应
    3. 新增时，挂载dom, 修改时，更新 props
       1. new 无，old 有， 删除
       2. new 有，old 无， 新增
       3. new 有，old 有， 更新

## 实现更新children

#### 步骤拆分

###### 1. type 不同，删除老节点。
```jsx
// 1. 老节点为普通dom
{showFoo ? <div>Foo</div> : <p>bar</p>}

function Bar() { return (<p>bar</p>)}
// 2. 老节点为 function componment
{showFoo ? <div>Foo</div> : <Bar/>}
```
###### 2. type 相同，新节点比老节点短，diff 删除多余的老节点
```jsx
{showFoo ? <div>Foo</div> : <p>p-bar<div>div-bar1</div><p>p-bar2</p></p>}
```
