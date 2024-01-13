import React from './React';

const ReactDOM = {
    createRoot: (container) => {
        return {
            render(App) {
                React.render(App, container)
            },
        }
    },
};

export default ReactDOM;
