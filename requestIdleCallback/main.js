// const root = document.querySelector('#root');
// console.log('hahahh')
// const str = 'hello'

// let i = 0
// while(i < 10000) {
//     console.log('bb')
//     i++;
//     root.append(document.createTextNode(str + i));
// }
let i = 0
function workLoop(IdleDeadline) {
    i++;
    let shouldLoop = false;
    while (!shouldLoop) {
        // run task
        console.log('run task: ', i);
        shouldLoop = IdleDeadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);