import PriorityQueue from "../dataStructures/priorityQueueAStar";

// A Star is an informed search algorithm (takes the start and finish node and finds optimal path)
function aStar(grid, animations, startNode, finishNode) {
    //Initialises the priority queue
    let openSet = new PriorityQueue(); // The openSet represents the UNVISITED nodes
  
    //Instantiates the initial values, Starting node has 0 weight;
    startNode.gcost = 0;
    startNode.hcost = calculateHeuristicValue(startNode, finishNode);
    startNode.fcost = startNode.hcost; //fcost = hcost since gcost = 0 at the initial node
    openSet.enqueue(startNode); //Enqueues the startNode
  
    //visitedNodesInOrder represents the closed set
    let visitedNodesInOrder = [];

    // Runs the algorithm
    while (!openSet.isEmpty()) { //While there are still nodes in the openSet
        //Find node with the least f cost in the openSet
        let current = openSet.dequeue();
        // Add current node to the Closed List
        current.isVisited = true;
        if(animations) current.isAnimated = true;
        visitedNodesInOrder.push(current);
  
        // If path has been found, return the visited nodes in order and end the algorithm
        if(current === finishNode) {
              return visitedNodesInOrder;
        }
        // Grab the unvisited neighbors of current
        let neighbors = getNeighbors(current, grid);
        // For each of the unvisited neighbors of current
        for(let neighbor of neighbors) {
              let tempG = current.gcost + 1;
              if(tempG < neighbor.gcost) {
                    neighbor.previousNode = current;
                    neighbor.gcost = tempG;
                    neighbor.hcost = calculateHeuristicValue(neighbor, finishNode);
                    neighbor.fcost = neighbor.gcost + neighbor.hcost;
                    if(!openSet.find(neighbor)) {
                          openSet.enqueue(neighbor);
                    }
              }
        }
  
    }
    return visitedNodesInOrder;
  }
  // Returns a list of neighbors around node that are unvisited
  function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((node) => !node.isVisited && !node.isWall);
  }
  // Returns the shortest path after running the A* search, will be used to display shortest path after algorithm is run
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
  // Calculates the heuristic value used in the A* by using the Euclidean distance
  function calculateHeuristicValue(node, finishNode) {
    return Math.sqrt(Math.pow(node.row - finishNode.row,2) + Math.pow(node.col - finishNode.col,2));
  }
  
  export function aStarAlgorithm(grid, animations, startNode, finishNode) {
    let visitedNodesInOrder = aStar(grid, animations, startNode, finishNode);
    let nodesInShortestPathOrder = findShortestPath(finishNode);
    return [visitedNodesInOrder, nodesInShortestPathOrder];
  }
