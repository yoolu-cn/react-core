import React from './core/React';

const Child3 = ({ num }) => <div>child-{num}</div>;

const Child4 = ({ num }) => <div>child-{num}</div>;

const App = () => {
    function handleClick() {
        console.log('click');
    }
    return (
        <div id="app">
            hello word!
            <p>
                child-1
                <p>child-child-1</p>
                <button onClick={handleClick}>点我</button>
            </p>
            <p>
                child-2
                <p>child-child-2</p>
            </p>
            <Child3 num={3} />
            <Child4 num={4} />
        </div>
    );
};

export default App;