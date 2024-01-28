import { isFunctionComponent } from "../utils/tools";

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


let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = [];
function render(vdom, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [vdom],
        },
    };
    nextUnitOfWork = wipRoot;
};

function update() {
    wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
};

function createDom(type) {
    return type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
    // 1. old 有 new 无，删除
    Object.keys(prevProps).forEach((key) => {
        if (key !== 'children') {
            if (!(key in nextProps)) {
                dom.removeAttribute(key);
            }
        }
    });
    // 2. old 无 new 有，新增
    // 3. old 有 new 有，修改
    Object.keys(nextProps).forEach((key) => {
        if (key !== 'children') {
            if (key.startsWith('on')) {
                const eventType = key.slice(2).toLowerCase();
                dom.removeEventListener(eventType, prevProps[key]);
                dom.addEventListener(eventType, nextProps[key]);
            } else {
                dom[key] = nextProps[key];
            }
        }
    });
}

function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child;
    let prevChild = null;
    children.forEach((child, index) => {
        const isSameType = oldFiber && oldFiber.type === child.type;
        let newFiber
        if (isSameType) {
            newFiber = {
                type: child.type,
                props: child.props,
                dom: oldFiber.dom,
                child: null,
                parent: fiber,
                sibling: null,
                EffectTag: 'update',
                alternate: oldFiber,
            };
        } else {
            newFiber = {
                type: child.type,
                props: child.props,
                dom: null,
                child: null,
                parent: fiber,
                sibling: null,
                EffectTag: 'placement',
            };
            if (oldFiber) {
                deletions.push(oldFiber);
            }
        }
        /**
         * 重点计算fiber节点的下一个节点
         */
        if (oldFiber) {
            oldFiber = oldFiber?.sibling;
        }
        
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
    reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
    // 创建dom, 挂载dom, 挂载 props
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));
        updateProps(dom, fiber.props, {});
    }
    const children = fiber.props.children;

    // 初始化链表
    reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
    if (!isFunctionComponent(fiber)) {
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

    if (!nextUnitOfWork && !!wipRoot) {
        commitRoot(wipRoot);
    }
    requestIdleCallback(workLoop);
}

function commitRoot() {
    deletions.forEach(commitDeletion);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    deletions = [];
    wipRoot = null;
}

function commitDeletion(fiber) {
    if (fiber.dom) {
        let fiberParent = fiber.parent;
        while(!fiberParent.dom) {
            fiberParent = fiberParent.parent;
        }
        fiberParent.dom.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child);
    }
}

function commitWork(fiber) {
    if (!fiber) return;

    let fiberParent = fiber.parent;
    while(!fiberParent.dom) {
        fiberParent = fiberParent.parent;
    }
    if (fiber.EffectTag === 'placement') {
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom);
        } 
    } else if (fiber.EffectTag === 'update') {
        if (!isFunctionComponent(fiber)) {
            updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
        }
    }
    
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

requestIdleCallback(workLoop);

export default {
    createElement,
    createTextNode,
    render,
    update,
};