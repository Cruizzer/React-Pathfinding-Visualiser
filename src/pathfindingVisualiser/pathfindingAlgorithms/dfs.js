  // DFS implemented using recursion
  function dfsRecursive(grid, animations, node, endNode, visitedOrder) {
    node.isVisited = true;
    if (animations) node.isAnimated = true;
    visitedOrder.push(node);
    let neighbors = getNeighbors(node, grid);
    while (neighbors.length !== 0) { // Base case
      if (visitedOrder[visitedOrder.length - 1] === endNode) return true;
      let working = neighbors.pop();
      node.previousNode = working;
      dfsRecursive(grid, animations, working, endNode, visitedOrder);
    }
    return;
  }
  
  // Returns a list of neighbors around node that are unvisited
  function getNeighbors(node, grid) {
    const neighbors = []; // Array of the neighbouring nodes
    const { col, row } = node; // Holds the column and row of the current node
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    return neighbors.filter((node) => !node.isVisited && !node.isWall);
  }

  export function dfsAlgorithm(grid, animations, startNode, endNode) {
    let visitedOrder = [];
    dfsRecursive(grid, animations, startNode, endNode, visitedOrder);
    return visitedOrder;
  }