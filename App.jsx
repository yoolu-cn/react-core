import React from './core/React';

const Child3 = ({ num }) => <div>child-{num}</div>;

const Child4 = ({ num }) => <div>child-{num}</div>;

let num = 1;
let props = { id: '1111' };
let isShowBar = true;
const App = () => {
    function handleClick() {
        console.log('click');
        num++;
        props = {};
        isShowBar = !isShowBar;
        React.update();
    }
    const Foo = <div style="background-color: red;color:#fff;">div-foo</div>
    const Bar = <p style="background-color: blue;color:#fff;">p-bar</p>
    function FnBar() {
        return <p style="background-color: blue;color:#fff;">fn-bar</p>;
    }
    return (
        <div id="app">
            hello word!
            <p {...props}>
                child-1
                <p>child-child-1</p>
                <b>{num}</b>
                <button onClick={handleClick}>点我</button>
            </p>
            <p>
                child-2
                <p>child-child-2</p>
            </p>
            <Child3 num={3} />
            <Child4 num={4} />
            {/** type 不同，老节点为不同 dom, 删除老节点 */}
            {/* {isShowBar ? Foo : Bar} */}
            {/** type 不同，老节点为 function component, 删除老节点 */}
            {isShowBar ? Foo : <FnBar />}
        </div>
    );
};

export default App;