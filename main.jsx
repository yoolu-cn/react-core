import React from './core/React';
import ReactDOM from './core/ReactDom';
import App from './App';

/**
 * @TODO 实现 function component
 * 原因： Uncaught DOMException: Failed to execute 'createElement' on 'Document': The tag name provided ('() => /\* @__PURE__ *\/ 
 * React.createElement("div", { id: "app" }, "hello word!")') is not a valid name.
 */
ReactDOM.createRoot(document.querySelector('#root')).render(<App />);