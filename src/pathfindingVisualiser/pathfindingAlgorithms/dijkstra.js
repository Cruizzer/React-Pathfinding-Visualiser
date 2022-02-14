import PriorityQueue from "../dataStructures/priorityQueueDijkstra";

// Core dijkstra's algorithm function
const dijkstra = (grid, animations, startNode, finishNode) => {
    const visitedOrder = []; // List of nodes visited
    startNode.dist = 0; // Set starting node to dist 0 (All other nodes are dist Infinity)
    const unvistedNodesPQ = new PriorityQueue() // List of unvisited nodes (Entire graph)
    unvistedNodesPQ.enqueue(startNode);
    // While List of unvisited nodes is not empty
    while (unvistedNodesPQ.arr.length > 0) {
      const closestNeighbor = unvistedNodesPQ.front(); // Find closest neighbor
      unvistedNodesPQ.dequeue();
      if (closestNeighbor.dist === Infinity) return visitedOrder; // Unable to search (Shortest path not found)
      closestNeighbor.isVisited = true; // Set visited boolean
      if(animations) closestNeighbor.isAnimated = true;
      visitedOrder.push(closestNeighbor); // Push visited node to visited list
      if (closestNeighbor === finishNode) return visitedOrder; // Found shortest path, return order of visited nodes
      updateUnvisitedNeighbors(closestNeighbor, grid, unvistedNodesPQ, animations); // Update distance and prev node of all neighbors to current node
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
  // Updates distance and prev node of all neighbors of current node
  function updateUnvisitedNeighbors(node, grid, unvistedNodesPQ, animations) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.dist = node.dist + 1;
      neighbor.previousNode = node;
      if(!neighbor.isVisited) unvistedNodesPQ.enqueue(neighbor);
      neighbor.isVisited = true;
      if(animations) neighbor.isAnimated = true;
    }
  }
  // Returns a list of neighbors around node that are unvisited
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((node) => !node.isVisited && !node.isWall);
  }
  
  export function dijkstraAlgorithm(grid, animations, startNode, finishNode) {
    const visitedOrder = dijkstra(grid, animations, startNode, finishNode);
    const nodesInShortestPathOrder = findShortestPath(finishNode);
    return [visitedOrder, nodesInShortestPathOrder];
  }
  