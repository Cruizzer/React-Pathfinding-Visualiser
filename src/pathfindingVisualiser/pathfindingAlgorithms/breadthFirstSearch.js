import Queue from "../dataStructures/queue";

// Iterative implementation of BFS
  function breadthFirstSearch(grid, animations, startNode, finishNode) {
    // Initialises the visitedNodesSet and makes use of a regular queue.
    let visitedNodesSet = [];
    let queue = new Queue();

    // Update the startNode isVisited property to true.
    startNode.isVisited = true;
    // If animations is == true based on the breadthFirstSearchAnimations method in pathfindingVisualiser.jsx
    if (animations === true) {
        startNode.isAnimated = true;
    }

    // Assign the startNode as visited to avoid backtracking.
    visitedNodesSet.push(startNode);
    queue.enqueue(startNode);

    // While there are still nodes in the queue.
    while (!queue.isEmpty()) {
      // Dequeue removes and returns the first element of the queue.
      const node = queue.dequeue();
      // Push the current node into the visited set
      visitedNodesSet.push(node);
      if (node === finishNode) return visitedNodesSet;
      let neighbours = getNeighbours(grid, node);
      // Iteratively go through each neighbour
      for (let i = 0; i < neighbours.length; i++) {
        // Update individual node properties
        neighbours[i].isVisited = true;
        neighbours[i].previousNode = node;
        if (animations) neighbours[i].isAnimated = true;
        queue.enqueue(neighbours[i]);
      }
    }
    return visitedNodesSet;
  }
  // Returns a list of neighbours around node that are unvisited
  function getNeighbours(grid, node) {
    const neighbours = [];
    const { column, row } = node;
    if (column > 0) neighbours.push(grid[row][column - 1]);
    if (row < grid.length - 1) neighbours.push(grid[row + 1][column]);
    if (column < grid[0].length - 1) neighbours.push(grid[row][column + 1]);
    if (row > 0) neighbours.push(grid[row - 1][column]);
    return neighbours.filter((node) => !node.isVisited && !node.isWall);
  }
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null && currentNode.isVisited) {
      currentNode.isShortestPath = true;
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

  export function breadthFirstSearchAlgorithm(grid, animations, startNode, finishNode) {
    let visitedNodesSet = breadthFirstSearch(grid, animations, startNode, finishNode);
    let nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    return [visitedNodesSet, nodesInShortestPathOrder];
  }