// Dijksta's implementation of priority queue (Compares distance)
export default class PriorityQueue {
    constructor() {
      this.arr = [];
    }
    enqueue(node) {
      var added = false;
      for(let i = 0; i < this.arr.length; i++) {
        if(this.arr[i].dist > node.dist) { //Compares the distance for each node
          this.arr.splice(i, 0, node); //Makes the greater distance value higher in priority
          added = true;
          break; //Terminates for loop after node is added to the queue
        }
      }
      if(!added) this.arr.push(node); //If the node has not been added (due to a lower distance) push it to the end of the queue 
    }
    
    dequeue() {
      if(this.isEmpty()) return;
      return this.arr.shift();
    }
  
    front() {
      if(this.isEmpty()) return;
      return this.arr[0];
    }
  
    rear() {
      if(this.isEmpty()) return;
      return this.arr[this.arr.length - 1];
    }
    
    isEmpty() {
      return this.arr.length === 0;
    }
  }