// General queue
export default class Queue {
    constructor() {
      this.arr = [];
    }
    enqueue(val) {
      this.arr.push(val);
    }
    dequeue() {
      return this.arr.shift();
    }
    isEmpty() {
      return this.arr.length === 0;
    }
  }