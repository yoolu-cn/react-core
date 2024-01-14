import { findParent } from "../utils/tools";

function createTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) =>
                typeof child === 'string' ? createTextNode(child) : child
            ),
        },
    };
};

function render(vdom, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [vdom],
        },
    };
};

function createDom(type) {
    return type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type);
}

function updateProps(work, dom) {
    Object.keys(work.props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = work.props[key];
        }
    });
}

function initChildren(fiber) {
    const children = fiber.props.children;
    let prevChild = null;
    children.forEach((child, index) => {
        const newFiber = {
            ...child,
            dom: null,
            child: null,
            parent: fiber,
            sibling: null,
        };
        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevChild.sibling = newFiber;
        }
        prevChild = newFiber;
    });
}

function performUnitOfWork(fiber) {
    // 创建dom, 挂载dom, 挂载 props
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));
        fiber.parent.dom.append(dom);
        updateProps(fiber, dom);
    }
    // 初始化链表
    initChildren(fiber);

    if (fiber.child) {
        return fiber.child;
    }
    
    if (fiber.sibling) {
        return fiber.sibling;
    }

    return findParent(fiber);
}


let nextUnitOfWork = null;
/**
 * 浏览器空闲时永久执行
 * @param {*} IdleDeadline 
 */
function workLoop(IdleDeadline) {
    let shouldYield = false;
    while (!shouldYield && !!nextUnitOfWork) {
        // 执行任务并返回下一个任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = IdleDeadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

export default {
    createElement,
    createTextNode,
    render,
};