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
                typeof child === 'string' || typeof child === 'number' ? createTextNode(child) : child
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
    rootNode = nextUnitOfWork;
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

function initChildren(fiber, children) {
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

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)];
    initChildren(fiber, children);
}

function updateHostComponent(fiber) {
    // 创建dom, 挂载dom, 挂载 props
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));
        updateProps(fiber, dom);
    }
    const children = fiber.props.children;

    // 初始化链表
    initChildren(fiber, children);
}

function performUnitOfWork(fiber) {
    const isFunctionComponent = typeof fiber.type === 'function';
    if (!isFunctionComponent) {
        updateHostComponent(fiber);
    } else {
        updateFunctionComponent(fiber);
    }

    if (fiber.child) {
        return fiber.child;
    }
    
    let nextFiber = fiber;
    while(nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling;
        nextFiber = nextFiber.parent;
    }
}

let nextUnitOfWork = null;
let rootNode = null;
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

    if (!nextUnitOfWork && !!rootNode) {
        commitRoot(rootNode);
    }
    requestIdleCallback(workLoop);
}

function commitRoot() {
    commitWork(rootNode.child);
    rootNode = null;
}

function commitWork(fiber) {
    if (!fiber) return;

    let fiberParent = fiber.parent;
    while(!fiberParent.dom) {
        fiberParent = fiberParent.parent;
    }
    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

requestIdleCallback(workLoop);

export default {
    createElement,
    createTextNode,
    render,
};