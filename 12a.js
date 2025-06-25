
import { Stack } from './stack.js';
import { Queue } from './queue.js';

const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log('Stack size:', stack.size());
console.log('Stack peek:', stack.peek());
console.log('Stack pop:', stack.pop());
console.log('Stack after pop:', stack.items);

const queue = new Queue();
queue.enqueue('a');
queue.enqueue('b');
queue.enqueue('c');
console.log('Queue size:', queue.size());
console.log('Queue front:', queue.front());
console.log('Queue dequeue:', queue.dequeue());
console.log('Queue after dequeue:', queue.items);