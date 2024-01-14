import React from './core/React';

// const App = () => <div id="app">hello word!</div>;

const App = (
    <div id="app">
        hello word!
        <p>
            child-1
            <p>child-child-1</p>
        </p>
        <p>
            child-2
            <p>child-child-2</p>
        </p>
    </div>);

console.log(App);

export default App;