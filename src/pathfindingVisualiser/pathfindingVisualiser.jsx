// Import React
import React, { Component } from "react";
// Import stylesheets
import "./pathfindingVisualiser.css";
// Import algorithms
import * as dijkstra from "./pathfindingAlgorithms/dijkstra";
import * as astar from "./pathfindingAlgorithms/astar";
import * as depthFirstSearch from "./pathfindingAlgorithms/depthFirstSearch"
import * as breadthFirstSearch from "./pathfindingAlgorithms/breadthFirstSearch"
import * as recursiveDiv from "./mazeGeneratingAlgorithms/recursiveDivision";

// Import Node
import Node from "./Node/node";

// Define grid constants
const rowLength = 28;
const columnLength = 59;

// Define Animation Delay constants
const ANIMATION_FAST = 10;
const ANIMATION_AVG = 20;
const ANIMATION_SLOW = 30
;
// Define start/end node starting positions
let startRow = 14;
let startColumn = 18;
let finishRow = 14;
let finishColumn = 39;

// Define algorithm constants
const ASTAR = "A* Search";
const DIJKSTRAS = "Dijkstra's";
const Depth_First_Search = "DFS";
const Breadth_First_Search = "BFS";


export default class PathfindingVisualiser extends Component {
    constructor(props) {
        super(props);
        this.state = {
          grid: [], // Two-Dimensional array representing a graph.
          mouseIsPressed: false, // Boolean which indicates the state of whether the mouse has been pressed.
          isMouseDisabled: false, // Boolean which checks whether mouse action is disabled.
          isButtonsDisabled: false, // Boolean to check whether pressing buttons is disabled.
          moveStart: false, // Boolean to indicate moving start node.
          moveFinish: false,  // Boolean to indicate moving end node.
          algorithm: "",  // String of the currently selected algorithm.
          visualiseBtnText: "Visualise", // Used to dynamically alter the text of the visualisation button for the selected algorithm.
          instantAnimations: false,  // Boolean to indicate instant animations.
          finishAnimations: false,  // Boolean to indicate visualisations are complete
          animationDelay: ANIMATION_AVG, // Animation delay, can be [Fast, Average, Slow]
          visitedCounter: 0, // Counter that track the visitedOrder.Length
          shortestPathCounter: 0 // Counter that manages the nodesInShortestPath.Length
        };
        
        // Binding mouse functions
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.toggleWall = this.toggleWall.bind(this);
        this.toggleStart = this.toggleStart.bind(this);
        this.toggleFinish = this.toggleFinish.bind(this);


        // Binding algorithm functions
        this.dijkstraAnimations = this.dijkstraAnimations.bind(this);
        this.dijkstraWithoutAnimations = this.dijkstraWithoutAnimations.bind(this);
        this.aStarAnimations = this.aStarAnimations.bind(this);
        this.aStarWithoutAnimations = this.aStarWithoutAnimations.bind(this);
        this.breadthFirstSearchAnimations = this.breadthFirstSearchAnimations.bind(this);
        this.breadthFirstSearchWithoutAnimations = this.breadthFirstSearchWithoutAnimations.bind(this);
        this.depthFirstSearchAnimations = this.depthFirstSearchAnimations.bind(this);
        this.depthFirstSearchWithoutAnimations = this.depthFirstSearchWithoutAnimations.bind(this);
        this.recursiveDivisionAnimation = this.recursiveDivisionAnimation.bind(this);

        // Bind other functions
        this.clearNodeClasses = this.clearNodeClasses.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.animationSpeed = this.animationSpeed.bind(this);
    }

    componentDidMount() {
        // Instantiates grid and sets the grid to the state
        const grid = createGrid();
        this.setState({ grid });
    }

    handleMouseDown(e, row, column, isStart, isFinish) { // Uses javascript's 'e' current event object
        if (this.state.isMouseDisabled) return;
        e.preventDefault();
        
        if (isStart) {
            this.setState({ moveStart: true });
        }
        else if (isFinish) {
            this.setState({ moveFinish: true });
        }
        else {
            let newGrid = this.toggleWall(this.state.grid, row, column);

            // Reanimate instantly when wall is added after animations are finished
            if (this.state.finishAnimations) {
            newGrid = this.visualiseWithoutAnimations(this.state.algorithm, newGrid);
            }
            this.setState({ grid: newGrid });
        }
        this.setState({ mouseIsPressed: true });
    }


    handleMouseEnter(row, column) {
        if (!this.state.mouseIsPressed) return;
        let newGrid = null;
        // Moving start/finish | toggling wall (reanimate if animations finished)
        if (this.state.moveStart) {
            newGrid = this.toggleStart(this.state.grid, row, column);
            if (this.state.finishAnimations) {
            newGrid = this.visualiseWithoutAnimations(this.state.algorithm, newGrid);
            }
        } 
        else if (this.state.moveFinish) {
            newGrid = this.toggleFinish(this.state.grid, row, column);
            if (this.state.finishAnimations) {
            newGrid = this.visualiseWithoutAnimations(this.state.algorithm, newGrid);
            }
        } 
        else {
            newGrid = this.toggleWall(this.state.grid, row, column);
            if (this.state.finishAnimations) {
            newGrid = this.visualiseWithoutAnimations(this.state.algorithm, newGrid);
            }
        }
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        // Turn off toggles regarding mouse events
        this.setState({
            mouseIsPressed: false,
            moveStart: false,
            moveFinish: false,
        });
    }

    // Reset grid (Includes walls, Node [all] classes and properties)
    resetBoard() {
        // Select grid element using Javascript DOM
        const gridElem = document.getElementsByClassName("grid")[0];
        // Recreates grid
        const newGrid = createGrid();
        // Remove all animation/nonanimation classes
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[i].length; j++) {
              gridElem.children[i].children[j].classList.remove(
                "node-visited-animate"
                );
                gridElem.children[i].children[j].classList.remove(
                "node-shortest-path-animate"
                );
                gridElem.children[i].children[j].classList.remove("node-wall-animate");
                gridElem.children[i].children[j].classList.remove("node-visited");
                gridElem.children[i].children[j].classList.remove("node-shortest-path");
                gridElem.children[i].children[j].classList.remove("node-wall");
            }
        }

        // Set clear grid and turn off finished animation toggles
        this.setState({
        grid: newGrid, //Grid state is set to a new empty grid
        finishAnimations: false,
        instantAnimations: false,
        visitedCounter: 0,
        shortestPathCounter: 0
        });
    }

    // Reset grid (Includes Node [all] classes and properties)
    clearNodeClasses() {
        // Select grid element
        const gridElem = document.getElementsByClassName("grid")[0];

        // Clear grid by creating initial grid
        const newGrid = this.state.grid.slice();

        // Remove all animation/nonanimation classes and reset all node properties
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[i].length; j++) {
                gridElem.children[i].children[j].classList.remove(
                "node-visited-animate"
                );
                gridElem.children[i].children[j].classList.remove(
                "node-shortest-path-animate"
                );
                gridElem.children[i].children[j].classList.remove("node-wall-animate");
                gridElem.children[i].children[j].classList.remove("node-visited");
                gridElem.children[i].children[j].classList.remove("node-shortest-path");
                newGrid[i][j].distance = Infinity;
                newGrid[i][j].isVisited = false;
                newGrid[i][j].previousNode = null;
                newGrid[i][j].isInPQ = false;
                newGrid[i][j].isAnimated = false;
                newGrid[i][j].isShortestPath = false;
                newGrid[i][j].fcost = Infinity;
                newGrid[i][j].gcost = Infinity;
                newGrid[i][j].heuristicCost = Infinity;
            }
        }
        this.setState({ grid: newGrid });
    }

    // Reset grid (Includes Node [animation] classes and properties)
    clearAnimations(newGrid) {
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[i].length; j++) {
                // Resets Node properties of all nodes
                newGrid[i][j].distance = Infinity;
                newGrid[i][j].isVisited = false;
                newGrid[i][j].previousNode = null;
                newGrid[i][j].isInPQ = false;
                newGrid[i][j].isShortestPath = false;
                newGrid[i][j].isAnimated = false;
                newGrid[i][j].fcost = Infinity;
                newGrid[i][j].gcost = Infinity;
                newGrid[i][j].heuristicCost = Infinity;
                //Reset animation classes in entire grid
                if (!this.state.instantAnimations) {
                gridElem.children[i].children[j].classList.remove(
                    "node-visited-animate"
                );
                gridElem.children[i].children[j].classList.remove(
                    "node-shortest-path-animate"
                );
                gridElem.children[i].children[j].classList.remove(
                    "node-wall-animate"
                );
                }
            }
        }
    }

    // Dijkstra's algorithm (With animations)
    dijkstraAnimations() {
        // Disable mouse and buttons
        this.setState({ isButtonsDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });

        // Clear node [all] classes and properties
        this.clearNodeClasses();

        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = true;

        // Constants which hold the visitedOrder and nodesInShortestPathOrder after running dijkstra's algorithm
        const [visitedOrder, nodesInShortestPathOrder] = dijkstra.dijkstraAlgorithm(
        newGrid,
        animations,
        startNode,
        finishNode
        );

        this.setState({
          visitedCounter: visitedOrder.length,
          shortestPathCounter: nodesInShortestPathOrder.length
        })

        // Animations for visiting nodes
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
        const { row, column } = visitedOrder[i];
        setTimeout(() => {
            // Sets the individual node to have node-visited-animate property which allows for CSS manipulation to animate each node
            gridElem.children[row].children[column].classList.add(
            "node-visited-animate"
            );
        }, i * this.state.animationDelay);
        }

        // Animations for shortest path
        for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
        const { row, column } = nodesInShortestPathOrder[j];
        setTimeout(() => {
            gridElem.children[row].children[column].classList.add(
            "node-shortest-path-animate"
            );
        }, (visitedOrder.length + j) * this.state.animationDelay);
        }

        // Re-enable mouse and buttons after animations are finished
        setTimeout(() => {
        this.setState({isButtonsDisabled: false, isMouseDisabled: false});
        }, (visitedOrder.length + nodesInShortestPathOrder.length + 1) * this.state.animationDelay);
        // Set new grid
        this.setState({ grid: newGrid });
    }
    
    // Dijkstra's algorithm (No animations)
    dijkstraWithoutAnimations(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = false;
        // Run dijkstra's with temporary grid, no animations, start node, and ending node
        dijkstra.dijkstraAlgorithm(newGrid, animations, startNode, finishNode);
        this.setState({ instantAnimations: true});
        return newGrid;
    }

    // Depth_First_Search Algorithm (With animations)
    depthFirstSearchAnimations() {
        // Disable mouse and buttons
        this.setState({ isButtonsDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });
        // Clear node [all] classes and properties
        this.clearNodeClasses();
        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = true;
        const visitedOrder = depthFirstSearch.depthFirstSearchAlgorithm(
        newGrid,
        animations,
        startNode,
        finishNode
        );

        // Animations for visiting nodes
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
            const { row, column } = visitedOrder[i];
            setTimeout(() => {
                gridElem.children[row].children[column].classList.add(
                "node-visited-animate"
                );
            }, i * this.state.animationDelay);
        }
        let pathLength = 0;
        if (finishNode.isVisited) {
            let node = startNode;
            while (node !== null) {
                const { row, column } = node;
                setTimeout(() => {
                gridElem.children[row].children[column].classList.add(
                    "node-shortest-path-animate"
                );
                }, (visitedOrder.length + pathLength) * this.state.animationDelay);
                node = node.previousNode;
                pathLength++;
            }
        }

        this.setState({
          visitedCounter: visitedOrder.length,
          shortestPathCounter: pathLength
        })

        // Re-enable mouse and buttons after animations are finished
        setTimeout(() => {
        this.setState({ isButtonsDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + pathLength + 1) * this.state.animationDelay);
        this.setState({ grid: newGrid });
    }
    // Depth_First_Search Algorithm (No animations)
    depthFirstSearchWithoutAnimations(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = false;
        // Run dfs with temporary grid, no animations, start node, and ending node
        depthFirstSearch.depthFirstSearchAlgorithm(newGrid, animations, startNode, finishNode);
        // Draw shortest path
        if (finishNode.isVisited) {
            let node = startNode;
            while (node !== null) {
                const { row, column } = node;
                newGrid[row][column].isShortestPath = true;
                node = node.previousNode;
            }
        }
        this.setState({ instantAnimations: true });
        return newGrid;
    }

    // BFS Algorithm (Animations method)
    breadthFirstSearchAnimations() {
        // Disable mouse and buttons
        this.setState({ isButtonsDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });
        // Clear node [all] classes and properties
        this.clearNodeClasses();
        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = true;
        const [visitedOrder, nodesInShortestPathOrder] = breadthFirstSearch.breadthFirstSearchAlgorithm(
        newGrid,
        animations,
        startNode,
        finishNode
        );

        this.setState({
          visitedCounter: visitedOrder.length,
          shortestPathCounter: nodesInShortestPathOrder.length
        })
        
        // Animations for visiting nodes
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
            const { row, column } = visitedOrder[i];
            setTimeout(() => {
                gridElem.children[row].children[column].classList.add(
                "node-visited-animate"
                );
            }, i * this.state.animationDelay);
        }
        
        // Iterating animations for shortest path
        for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
            const { row, column } = nodesInShortestPathOrder[j];
            setTimeout(() => {
                gridElem.children[row].children[column].classList.add(
                "node-shortest-path-animate"
                );
            }, (visitedOrder.length + j) * this.state.animationDelay);
        }
        // Re-enable mouse and buttons after animations are finished
        setTimeout(() => {
        this.setState({ isButtonsDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + nodesInShortestPathOrder.length + 1) * this.state.animationDelay);
        this.setState({ grid: newGrid });
    }

    // Depth_First_Search Algorithm (No animations)
    breadthFirstSearchWithoutAnimations(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = false;
        // Run bfs with temporary grid, no animations, start node, and ending node
        breadthFirstSearch.breadthFirstSearchAlgorithm(newGrid, animations, startNode, finishNode);
        this.setState({ instantAnimations: true });
        return newGrid;
    }

    // A* Algorithm (Animations method)
    aStarAnimations() {
        // Disable mouse and buttons
        this.setState({ isButtonsDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });

        // Clear node [all] classes and properties
        this.clearNodeClasses();

        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = true;
        const [visitedOrder, nodesInShortestPathOrder] = astar.aStarAlgorithm(
        newGrid,
        animations,
        startNode,
        finishNode
        );

        this.setState({
          visitedCounter: visitedOrder.length,
          shortestPathCounter: nodesInShortestPathOrder.length
        })

        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
            const { row, column } = visitedOrder[i];
            setTimeout(() => {
                gridElem.children[row].children[column].classList.add(
                "node-visited-animate"
                );
            }, i * this.state.animationDelay);
        }

        // Iterating animations for shortest path
        for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
            const { row, column } = nodesInShortestPathOrder[j];
            setTimeout(() => {
                gridElem.children[row].children[column].classList.add(
                "node-shortest-path-animate"
                );
            }, (visitedOrder.length + j) * this.state.animationDelay);
        }

        // Re-enable mouse and buttons after animations are finished
        setTimeout(() => {
          this.setState({ isButtonsDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + nodesInShortestPathOrder.length + 1) * this.state.animationDelay);
        // Set new grid
        this.setState({ grid: newGrid });
    }
    
    // A* Algorithm (No animations)
    aStarWithoutAnimations(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];
        const animations = false;
        // Run astar's with temporary grid, no animations, start node, and ending node
        astar.aStarAlgorithm(newGrid, animations, startNode, finishNode);
        this.setState({ instantAnimations: true });
        return newGrid;
    }

    // Recursive Division Algorithm (Wall algorithm)
    recursiveDivisionAnimation() {
        // Disable mouse and buttons
        this.setState({ isButtonsDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ mouseIsPressed: false });

        // Clear node classes
        this.clearNodeClasses();

        // Turn off instant animations after placing walls, moving start/end nodes
        this.setState({ finishAnimations: false });

        const newGrid = this.state.grid.slice();
        // Clears all the walls to reset the grid before running the algorithm

        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
                newGrid[i][j].isWall = false;
            }
        }

        const startNode = newGrid[startRow][startColumn];
        const finishNode = newGrid[finishRow][finishColumn];

        // Finds the wallVisited order after running the recursiveDivisonAlgorithm with the new reset grid, start and finish node
        let wallVisitedOrder = recursiveDiv.recursiveDivisionAlgorithm(
        newGrid,
        startNode,
        finishNode
        );

        const gridElem = document.getElementsByClassName("grid")[0];

        // Applies class 'node-wall-animate' to the visited order of the walls in order to animate it
        for (let i = 0; i < wallVisitedOrder.length; i++) {
          const { row, column } = wallVisitedOrder[i];
          setTimeout(() => {
              gridElem.children[row].children[column].classList.add("node-wall-animate");
          }, i * this.state.animationDelay);
        }

        // Uncomment to view Object of new grid (Debugging)
        // console.log(newGrid[0][1]);

        // Re-enable mouse and buttons after animations are finished
        setTimeout(() => {
          this.setState({ isButtonsDisabled: false, isMouseDisabled: false });
          this.clearNodeClasses();
        }, wallVisitedOrder.length * this.state.animationDelay + 500);

        this.setState({ grid: newGrid });
        return;
    }

    // Toggles starting node prop of node hovered by mouse
    toggleStart = (grid, row, column) => {
        // Do not toggle the start node if the cell being pressed is the finish node or is a wall
        if (grid[row][column].isFinish || grid[row][column].isWall) return grid;

        const newGrid = grid.slice();

        // Used to clear isStart property of the the temporary start node and then toggle it to the new start node position
        newGrid[startRow][startColumn].isStart = false;
        newGrid[row][column].isStart = !newGrid[row][column].isStart;

        startColumn = column;
        startRow = row;

        return newGrid;
    }

    // Toggles finish node prop of node hovered by mouse
    toggleFinish = (grid, row, column) => {
        // Do not toggle the finish node if the cell being pressed is the start node or is a wall
        if (grid[row][column].isStart || grid[row][column].isWall) return grid;

        const newGrid = grid.slice();

        // Used to clear isFinish property of the the temporary finish node and then toggle it to the new finish node position
        newGrid[finishRow][finishColumn].isFinish = false;
        newGrid[row][column].isFinish = !newGrid[row][column].isFinish;

        finishColumn = column;
        finishRow = row;

        return newGrid;
    };
    
    // Toggles wall node prop of node hovered by mouse
    toggleWall = (grid, row, column) => {
        // Do not toggle the wall if the cell being pressed is the start or finish node
        if (grid[row][column].isStart || grid[row][column].isFinish) return grid;
        
        const newGrid = grid.slice();

        // The new grid is the same grid as before with the altered cell having the isWall property toggled.
        newGrid[row][column].isWall = !newGrid[row][column].isWall;

        return newGrid;
    };

    // Handles visualisation button click with animations
    visualise(algorithm) {
        switch (algorithm) {
        case DIJKSTRAS:
            this.dijkstraAnimations();
            break;
        case ASTAR:
            this.aStarAnimations();
            break;
        case Depth_First_Search:
            this.depthFirstSearchAnimations();
            break;
        case Breadth_First_Search:
            this.breadthFirstSearchAnimations();
            break;
        default:
            break;
        }
    }
    // Handles visualisation with wall addition and start/end node moving (No animations)
    visualiseWithoutAnimations(algorithm, newGrid) {
        switch (algorithm) {
        case DIJKSTRAS:
            return this.dijkstraWithoutAnimations(newGrid);
        case ASTAR:
            return this.aStarWithoutAnimations(newGrid);
        case Depth_First_Search:
            return this.depthFirstSearchWithoutAnimations(newGrid);
        case Breadth_First_Search:
            return this.breadthFirstSearchWithoutAnimations(newGrid);
        default:
            break;
        }
    }
    
    // Handles cycling animation delay on button click.
    animationSpeed() {
        if (this.state.animationDelay === ANIMATION_FAST) {
        this.setState({ animationDelay: ANIMATION_AVG });
        } 
        else if (this.state.animationDelay === ANIMATION_AVG) {
        this.setState({ animationDelay: ANIMATION_SLOW });
        } 
        else {
        this.setState({ animationDelay: ANIMATION_FAST });
        }
    }

    //Start of rendering
    render() {
        // Grab current state of the grid
        const { grid } = this.state;
        return (
          <div className="pathfindingCanvas">
            <div className="navBar">
                <button
                    className="visualise-btn"
                    onClick={() => {
                    // If an algorithm is chosen from the dropdown, then visualise the algorithm in the state.
                    if (this.state.algorithm !== "") {
                        this.visualise(this.state.algorithm);
                    } else {
                        // Validation check for if there is no algorithm is selected
                        this.setState({ visualiseBtnText: "Select an Algorithm" });
                    }
                    }}
                    disabled={this.state.isButtonsDisabled}
                >
                    {this.state.visualiseBtnText}
                </button>
              <div className="dropdown">
                <p>Pathfinding Algorithms</p>
                <div className="dropdown-content">
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: DIJKSTRAS,
                        visualiseBtnText: "Visualise " + DIJKSTRAS,
                        finishAnimations: false,
                        instantAnimations: false,
                      });
                    }}
                    disabled={this.state.isButtonsDisabled}
                  >
                    Dijkstra's Algorithm
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: ASTAR,
                        visualiseBtnText: "Visualise " + ASTAR,
                        finishAnimations: false,
                        instantAnimations: false,
                      });
                    }}
                    disabled={this.state.isButtonsDisabled}
                  >
                    A* Algorithm
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: Depth_First_Search,
                        visualiseBtnText: "Visualise " + Depth_First_Search,
                        finishAnimations: false,
                        instantAnimations: false,
                      });
                    }}
                    disabled={this.state.isButtonsDisabled}
                  >
                    Depth-First-Search
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: Breadth_First_Search,
                        visualiseBtnText: "Visualise " + Breadth_First_Search,
                        finishAnimations: false,
                        instantAnimations: false,
                      });
                    }}
                    disabled={this.state.isButtonsDisabled}
                  >
                    Breadth-First-Search
                  </button>
                </div>
              </div>
              <div className="dropdown">
                <p>Maze Generation</p>
                <div className="dropdown-content">
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.recursiveDivisionAnimation("deterministic");
                    }}
                    disabled={this.state.isButtonsDisabled}
                  >
                    Recursive Divison
                  </button>
                </div>
              </div>
              <button
                onClick={() => this.resetBoard()}
                disabled={this.state.isButtonsDisabled}
              >
                Reset Board
              </button>
              <button
                onClick={() => {
                  this.clearNodeClasses();
                  this.setState({ finishAnimations: false, instantAnimations: false });
                }}
                disabled={this.state.isButtonsDisabled}
              >
                Reset Animations
              </button>
              <button
                onClick={() => this.animationSpeed()}
                disabled={this.state.isButtonsDisabled}
              >
                Animation Speed: {this.state.animationDelay} ms
              </button>
              <p>Pathfinding Visualiser</p>
              <p className="counters">Visited Counter: {this.state.visitedCounter}</p>
              <p className="counters">Shortest Path Counter: {this.state.shortestPathCounter}</p>
            </div>
            <div className="grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div className="row" key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {
                        row,
                        column,
                        isStart,
                        isFinish,
                        isWall,
                        isVisited,
                        isShortestPath,
                        isAnimated,
                        fcost,
                      } = node;
                      return (
                        <Node
                          key = {nodeIdx}
                          row = {row}
                          column = {column}
                          isStart = {isStart}
                          isFinish = {isFinish}
                          isWall = {isWall}
                          isVisited = {isVisited}
                          isShortestPath = {isShortestPath}
                          isAnimated = {isAnimated}
                          fcost = {fcost}
                          onMouseDown={(e) =>
                            this.handleMouseDown(e, row, column, isStart, isFinish)
                          }
                          onMouseEnter={() => this.handleMouseEnter(row, column)}
                          onMouseUp={this.handleMouseUp}
                        ></Node>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    }
    //End of rendering


// Creates the initial grid filled with nodes using a two dimensional array
const createGrid = () => {
    const grid = [];
    for (let row = 0; row < rowLength; row++) {
      const currentRow = [];
      for (let column = 0; column < columnLength; column++) {
        // Pushes a node into each (column, row)
        currentRow.push(createNode(column, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Creates a blank node
  const createNode = (column, row) => {
    return {
      column,
      row,
      isStart: row === startRow && column === startColumn,
      isFinish: row === finishRow && column === finishColumn,

      // General pathfinding variables
      distance: Infinity,
      previousNode: null,
      isVisited: false,

      isWall: false,
      isAnimated: false,
      isShortestPath: false,


      // A Star specific Variables
      fcost: Infinity,
      gcost: Infinity,
      heuristicCost: Infinity,
      
      parent: null,
      rank: 0,
    };
  };