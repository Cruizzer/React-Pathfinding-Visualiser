import PriorityQueue from "../dataStructures/priorityQueueDijkstra";

// Core dijkstra's algorithm function
const dijkstra = (grid, animations, startNode, finishNode) => {
  // List of nodes visited
    const visitedOrder = []; 
    // Instantiate the starting node to distance 0 (Keep the other nodes are a distanceance of Infinity).
    startNode.distance = 0;
    // List of unvisited nodes (Entire graph at this point).
    const unvistedNodesPQ = new PriorityQueue()
    unvistedNodesPQ.enqueue(startNode);
    // While List of unvisited nodes is not empty.
    while (unvistedNodesPQ.arr.length > 0) {
      // Find the closest neighbour using the front method in the priority queue
      const closestNeighbour = unvistedNodesPQ.front(); 
      unvistedNodesPQ.dequeue();
      // Unable to search (Shortest path not found).
      if (closestNeighbour.distance === Infinity) return visitedOrder;
      // Change node isVisited property.
      closestNeighbour.isVisited = true;
      if(animations === true){
        closestNeighbour.isAnimated = true;
      }
      // Push the visited node to visited set
      visitedOrder.push(closestNeighbour);
      // Shortest path found, return order of visited nodes
      if (closestNeighbour === finishNode) {
        return visitedOrder;
      }
      updateUnvisitedNeighbours(closestNeighbour, grid, unvistedNodesPQ, animations); // Update distanceance and prev node of all neighbours to current node
    }
    return visitedOrder;
  };
  
  function findShortestPath(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null && currentNode.isVisited) {
      currentNode.isShortestPath = true;
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  // Updates distances and previous node of all neighbours of the current node
  function updateUnvisitedNeighbours(node, grid, unvistedNodesPQ, animations) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
    for (const neighbour of unvisitedNeighbours) {
      neighbour.distance = node.distance + 1;
      neighbour.previousNode = node;
      if(!neighbour.isVisited) unvistedNodesPQ.enqueue(neighbour);
      neighbour.isVisited = true;
      if(animations === true){
         neighbour.isAnimated = true;
      }
    }
  }

// Returns a list of neighbours around node that are unvisited.
function getUnvisitedNeighbours(node, grid) {
  // Initialise neighbours node and grab the column and row property from the node in the parameter
  const neighbours = [];
  const { column, row } = node;

  // Push the neighbouring node above.
  if (row > 0) {
    neighbours.push(grid[row - 1][column]);
  } 
  // Push the neighbouring node below.
  if (row < grid.length - 1) {
    neighbours.push(grid[row + 1][column]);
  }
  // Push the neigbouring node to the left.
  if (column > 0) {
    neighbours.push(grid[row][column - 1]);
  }
  // Push the neighbouring node to the right.
  if (column < grid[0].length - 1) {
    neighbours.push(grid[row][column + 1]);
  }
  // Only return the neighbouring nodes that have not been visited and that is not a wall.
  return neighbours.filter((node) => !node.isVisited && !node.isWall);
}
  
  export function dijkstraAlgorithm(grid, animations, startNode, finishNode) {
    const visitedOrder = dijkstra(grid, animations, startNode, finishNode);
    const nodesInShortestPathOrder = findShortestPath(finishNode);
    return [visitedOrder, nodesInShortestPathOrder];
  }
  