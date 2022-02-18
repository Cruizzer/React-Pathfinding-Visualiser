  // DFS implemented using recursion.
  function depthFirstSearchRecursive(grid, animations, node, finishNode, visitedNodesSet) {
    node.isVisited = true;
    if (animations) node.isAnimated = true;
    // Mark the node as visited so that the neightbouring nodes will not revisit it in the next stack frame.
    visitedNodesSet.push(node);
    let neighbours = getNeighbours(grid, node);
    // First Base case
    while (neighbours.length !== 0) { 
      // If the last pushed node by getNeighbours is equal to the finishNode, end the recursive calls.
      // Second Base case.
      if (visitedNodesSet[visitedNodesSet.length - 1] === finishNode){
          return true;
      }
      let working = neighbours.pop();
      node.previousNode = working;
      depthFirstSearchRecursive(grid, animations, working, finishNode, visitedNodesSet);
    }
    return;
  }
  
  // Returns the neighbours list around nodes that are not visited.
  function getNeighbours(grid, node) {
      // Array of the neighbouring nodes.
      const neighbours = [];
      // Holds the columnumn and row of the current node.
      const { column, row } = node;

      // Push the neigbouring node to the left.
      if (column > 0) {
          neighbours.push(grid[row][column - 1]);
      }
      // Push the neighbouring node below.
      if (row < grid.length - 1) {
          neighbours.push(grid[row + 1][column]);
      }
      // Push the neighbouring node the right.
      if (column < grid[0].length - 1) {
          neighbours.push(grid[row][column + 1]);
      }
      // Push the neighbouring node above.
      if (row > 0) {
          neighbours.push(grid[row - 1][column]);
      }
      
      return neighbours.filter((node) => !node.isVisited && !node.isWall);
  }

// Helper function that returns the values of the depthFirstSearch algorithm.
export function depthFirstSearchAlgorithm(grid, animations, startNode, finishNode) {
  let visitedNodesSet = [];
  depthFirstSearchRecursive(grid, animations, startNode, finishNode, visitedNodesSet);
  return visitedNodesSet;
}