import PriorityQueue from "../dataStructures/priorityQueueAStar";

// A Star is an informed search algorithm (takes the start and finish node and finds optimal path).
function aStar(grid, animations, startNode, finishNode) {
    // Initialises the priority queue, the openSet represents the unvisited nodes.
    let openSet = new PriorityQueue();
  
    // Instantiates the initial values, Starting node has 0 weight (0 gcost);
    startNode.heuristicCost = calculateHeuristicValue(startNode, finishNode);
    startNode.gcost = 0;
    //fcost = heuristicCost since gcost = 0 at the initial node.
    startNode.fcost = startNode.heuristicCost;
    //Enqueues the startNode.
    openSet.enqueue(startNode);
  
    // visitedNodesSet represents the closed set.
    let visitedNodesSet = [];

    // Runs the algorithm
    while (!openSet.isEmpty()) { //While there are still nodes in the openSet.
        // Extract the node with the least f cost in the openSet.
        let current = openSet.dequeue();
        // Alter the isVisited node property.
        current.isVisited = true;

        // If animations is == true based on the astarAnimations method in pathfindingVisualiser.jsx
        if(animations === true) {
          current.isAnimated = true;
        }

        // Add current node to the Closed/Visited nodes set.
        visitedNodesSet.push(current);
  
        // If path has been found, return the visited nodes list and terminate the algorithm.
        if(current === finishNode) {
              return visitedNodesSet;
        }
        // Grab the unvisited neighbours of current.
        let neighbours = getNeighbours(current, grid);

        // For each of the unvisited neighbours of the current node.
        for(let neighbour of neighbours) {
              let tempG = current.gcost + 1;
              // If the node's current gcost is incremented by 1 and it is less than the neighbouring nodes.
              if(tempG < neighbour.gcost) {
                    // Alter the node's 'previousNode' property and assign it to the current node.
                    neighbour.previousNode = current;
                    // Change the node's 'gcost' property and assign it to it's new value (Each neigbouring node has a constant weight of 1).
                    neighbour.gcost = tempG;
                    // Assign the nodes 'heuristicCost' property to the returned value of the function called.
                    neighbour.heuristicCost = calculateHeuristicValue(neighbour, finishNode);
                    // f(n) = g(n) + h(n)
                    neighbour.fcost = neighbour.gcost + neighbour.heuristicCost;
                    // openSet.find(neighbour) uses the 'find' method in the priority queue to check if the neighbour in the parameter exists.
                    if(!openSet.find(neighbour)) {
                          openSet.enqueue(neighbour);
                    }
              }
        }
  
    }
    return visitedNodesSet;
  }

  // Returns a list of neighbours around node that are unvisited.
  function getNeighbours(node, grid) {
    // Initialise neighbours node and grab the column and row property from the node in the parameter
    const neighbours = [];
    const { col, row } = node;

    // Push the neighbouring node above.
    if (row > 0) {
      neighbours.push(grid[row - 1][col]);
    } 
    // Push the neighbouring node below.
    if (row < grid.length - 1) {
      neighbours.push(grid[row + 1][col]);
    }
    // Push the neigbouring node to the left.
    if (col > 0) {
      neighbours.push(grid[row][col - 1]);
    }
    // Push the neighbouring node to the right.
    if (col < grid[0].length - 1) {
      neighbours.push(grid[row][col + 1]);
    }
    // Only return the neighbouring nodes that have not been visited and that is not a wall.
    return neighbours.filter((node) => !node.isVisited && !node.isWall);
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

  // Calculates the heuristic value used in the A* by using the Euclidean distance.
  function calculateHeuristicValue(node, finishNode) {
    // Pythagoras theorem, c^2 = a^2 + b^2.
    return Math.sqrt(Math.pow(node.row - finishNode.row,2) + Math.pow(node.col - finishNode.col,2));
  }
  
  // Helper function that returns the values of the astar algorithm.
  export function aStarAlgorithm(grid, animations, startNode, finishNode) {
    let visitedNodesSet = aStar(grid, animations, startNode, finishNode);
    let nodesInShortestPathOrder = findShortestPath(finishNode);
    return [visitedNodesSet, nodesInShortestPathOrder];
  }