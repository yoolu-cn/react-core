const createTextNode = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children,
        },
    };
};

const render = (vdom, container) => {
    const dom =
        vdom.type === 'TEXT_ELEMENT'
            ? document.createTextNode('')
            : document.createElement(vdom.type);

    Object.keys(vdom.props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = vdom.props[key];
        }
    });

    vdom.props.children.forEach((child) => {
        render(typeof child === 'string' ? createTextNode(child) : child, container);
    });

    container.append(dom);
};

export default {
    createElement,
    createTextNode,
    render,
};