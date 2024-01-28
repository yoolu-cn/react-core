import React from './core/React';

let num = 1;
let num5 = 1;
let num6 = 1;
let props = { id: '1111' };
let isShowBar = false;

const Child3 = ({ num }) => <div>child-{num}</div>;

const Child4 = ({ num }) => <div>child-{num}</div>;

function Child5() {
    console.log('update child5')
    const update = React.update();
    function handleClick() {
        console.log('click child5');
        num5++;
        update();
    }
    return <div>child5-{num5}<button onClick={handleClick}>child5</button></div>
}
function Child6() {
    console.log('update child6')
    const update = React.update();
    function handleClick() {
        console.log('click child6');
        num6++;
        update();
    }
    return <div>child6-{num6} <button onClick={handleClick}>child6</button></div>
}

const App = () => {
    console.log('update app');
    const update = React.update();
    function handleClick() {
        console.log('click app');
        num++;
        props = {};
        isShowBar = !isShowBar;
        update();
    }
    const Foo = <div style="background-color: red;color:#fff;">div-foo</div>
    const Bar = <p style="background-color: blue;color:#fff;">p-bar</p>
    const multipleChildBar = <div style="background-color: blue;color:#fff;">p-bar<div>div-bar1</div><p>p-bar2</p></div>
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
            {/* <Child3 num={3} /> */}
            {/* <Child4 num={4} /> */}
            {/** type 不同，老节点为不同 dom, 删除老节点 */}
            {/* {isShowBar ? Foo : Bar} */}
            {/** type 不同，老节点为 function component, 删除老节点 */}
            {/* {isShowBar ? Foo : <FnBar />} */}
            {/** type 相同，老节点比新节点长, 删除老节点 */}
            {/* {isShowBar ? Foo : multipleChildBar} */}
            {/** 处理 && 边界问题, 1. 最后一个为 边界问题， 中午为边界问题*/}
            {/* {isShowBar && <FnBar />} */}
            {/* {<FnBar />} */}
            {<Child5 />}
            {<Child6 />}
        </div>
    );
};

export default App;