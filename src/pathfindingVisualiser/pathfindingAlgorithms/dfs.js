  // DFS implemented using recursion
  function dfsRecursive(grid, animations, node, finishNode, visitedNodesInOrder) {
    node.isVisited = true;
    if (animations) node.isAnimated = true;
    // Mark the node as visited so that the neightbouring node will not revisit it.
    visitedNodesInOrder.push(node);
    let neighbours = getNeighbours(grid, node);
    // First Base case
    while (neighbours.length !== 0) { 
      // If the last pushed node by getNeighbours is equal to the finishNode, end the recursive calls
      // Second Base case
      if (visitedNodesInOrder[visitedNodesInOrder.length - 1] === finishNode) return true;
      let working = neighbours.pop();
      node.previousNode = working;
      dfsRecursive(grid, animations, working, finishNode, visitedNodesInOrder);
    }
    return;
  }
  
  // Returns the neighbours list around nodes that are not visited
  function getNeighbours(grid, node) {
    const neighbours = []; // Array of the neighbouring nodes
    const { col, row } = node; // Holds the column and row of the current node
    if (col > 0) neighbours.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
    if (row > 0) neighbours.push(grid[row - 1][col]);
    return neighbours.filter((node) => !node.isVisited && !node.isWall);
  }

  export function dfsAlgorithm(grid, animations, startNode, finishNode) {
    let visitedNodesInOrder = [];
    dfsRecursive(grid, animations, startNode, finishNode, visitedNodesInOrder);
    return visitedNodesInOrder;
  }