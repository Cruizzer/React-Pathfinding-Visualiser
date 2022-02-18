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
const rowLen = 29;
const colLen = 59;

// Define Animation Delay constants
const ANIMATION_FAST = 10;
const ANIMATION_AVG = 20;
const ANIMATION_SLOW = 30
;
// Define start/end node starting positions
let startRow = 15;
let startCol = 15;
let endRow = 15;
let endCol = 45;

// Define algorithm constants
const DIJKSTRAS = "Dijkstra's";
const Depth_First_Search = "DFS";
const Breadth_First_Search = "BFS";
const ASTAR = "A* Search";


export default class PathfindingVisualiser extends Component {
    constructor(props) {
        super(props);
        this.state = {
          grid: [], // Two-Dimensional array representing a graph.
          mouseIsPressed: false, // Boolean which indicates the state of whether the mouse has been pressed.
          isMouseDisabled: false, // Boolean which checks whether mouse action is disabled.
          iskeyboardDisabled: false, // Boolean to check whether pressing buttons is disabled.
          moveStart: false, // Boolean to indicate moving start node.
          moveFinish: false,  // Boolean to indicate moving end node.
          algorithm: "",  // String of the currently selected algorithm.
          visualiseBtnText: "Visualise", // Used to dynamically alter the text of the visualisation button for the selected algorithm.
          instantAnimations: false,  // Boolean to indicate instant animations.
          finishAnimations: false,  // Boolean to indicate visualisations are complete
          animationDelay: ANIMATION_FAST, // Animation delay
        };
        
        //Keybinds
        
        // Bind mouse functions
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.toggleStart = this.toggleStart.bind(this);
        this.toggleFinish = this.toggleFinish.bind(this);
        this.toggleWall = this.toggleWall.bind(this);

        // Bind algorithm functions
        this.dijkstraAnimations = this.dijkstraAnimations.bind(this);
        this.dijkstraNoAnim = this.dijkstraNoAnim.bind(this);
        this.aStarAnimations = this.aStarAnimations.bind(this);
        this.aStarNoAnim = this.aStarNoAnim.bind(this);
        this.breadthFirstSearchAnimations = this.breadthFirstSearchAnimations.bind(this);
        this.breadthFirstSearchNoAnim = this.breadthFirstSearchNoAnim.bind(this);
        this.depthFirstSearchAnimations = this.depthFirstSearchAnimations.bind(this);
        this.depthFirstSearchNoAnim = this.depthFirstSearchNoAnim.bind(this);
        this.recursiveDivisionAnimation = this.recursiveDivisionAnimation.bind(this);

        // Bind other functions
        this.clearBoard = this.clearBoard.bind(this);
        this.clearNodeClasses = this.clearNodeClasses.bind(this);
        this.animationSpeed = this.animationSpeed.bind(this);
    }

    componentDidMount() {
        // Instantiates grid and sets the grid to the state
        const grid = createGrid();
        this.setState({ grid });
    } 

    handleMouseDown(e, row, col, isStart, isFinish) { //Uses 'e' javascript web handler
        if (this.state.isMouseDisabled) return;
        e.preventDefault();
        // Moving start/finish | toggle wall
        if (isStart) {
            this.setState({ moveStart: true });
        }
        else if (isFinish) {
            this.setState({ moveFinish: true });
        }
        else {
            let newGrid = this.toggleWall(this.state.grid, row, col);

            // Reanimate instantly when wall is added after animations are finished
            if (this.state.finishAnimations) {
            newGrid = this.visualiseNoAnim(this.state.algorithm, newGrid);
            }
            this.setState({ grid: newGrid });
        }
        this.setState({ mouseIsPressed: true });
    }


    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        let newGrid = null;
        // Moving start/finish | toggling wall (reanimate if animations finished)
        if (this.state.moveStart) {
            newGrid = this.toggleStart(this.state.grid, row, col);
            if (this.state.finishAnimations) {
            newGrid = this.visualiseNoAnim(this.state.algorithm, newGrid);
            }
        } 
        else if (this.state.moveFinish) {
            newGrid = this.toggleFinish(this.state.grid, row, col);
            if (this.state.finishAnimations) {
            newGrid = this.visualiseNoAnim(this.state.algorithm, newGrid);
            }
        } 
        else {
            newGrid = this.toggleWall(this.state.grid, row, col);
            if (this.state.finishAnimations) {
            newGrid = this.visualiseNoAnim(this.state.algorithm, newGrid);
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
    clearBoard() {
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
                newGrid[i][j].dist = Infinity;
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
                newGrid[i][j].dist = Infinity;
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
        this.setState({ iskeyboardDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });

        // Clear node [all] classes and properties
        this.clearNodeClasses();

        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = true;

        // Constants which hold the visitedOrder and nodesInShortestPathOrder after running dijkstra's algorithm
        const [visitedOrder, nodesInShortestPathOrder] = dijkstra.dijkstraAlgorithm(
        newGrid,
        animations,
        startNode,
        endNode
        );

        // Animations for visiting nodes
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
        const { row, col } = visitedOrder[i];
        setTimeout(() => {
            // Sets the individual node to have node-visited-animate property which allows for CSS manipulation to animate each node
            gridElem.children[row].children[col].classList.add(
            "node-visited-animate"
            );
        }, i * this.state.animationDelay);
        }
        // Animations for shortest path
        for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
        const { row, col } = nodesInShortestPathOrder[j];
        setTimeout(() => {
            gridElem.children[row].children[col].classList.add(
            "node-shortest-path-animate"
            );
        }, (visitedOrder.length + j) * this.state.animationDelay);
        }
        // Re-enable mouse and keyboard after animations are finished
        setTimeout(() => {
        this.setState({ iskeyboardDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + nodesInShortestPathOrder.length + 1) * this.state.animationDelay);
        // Set new grid
        this.setState({ grid: newGrid });
    }
    
    // Dijkstra's algorithm (No animations)
    dijkstraNoAnim(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = false;
        // Run dijkstra's with temp grid, no animations, start node, and ending node
        dijkstra.dijkstraAlgorithm(newGrid, animations, startNode, endNode);
        this.setState({ instantAnimations: true });
        return newGrid;
    }

    // Depth_First_Search Algorithm (With animations)
    depthFirstSearchAnimations() {
        // Disable mouse and buttons
        this.setState({ iskeyboardDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });
        // Clear node [all] classes and properties
        this.clearNodeClasses();
        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = true;
        const visitedOrder = depthFirstSearch.depthFirstSearchAlgorithm(
        newGrid,
        animations,
        startNode,
        endNode
        );
        // Animations for visiting nodes
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
            const { row, col } = visitedOrder[i];
            setTimeout(() => {
                gridElem.children[row].children[col].classList.add(
                "node-visited-animate"
                );
            }, i * this.state.animationDelay);
        }
        let pathLength = 0;
        if (endNode.isVisited) {
            let node = startNode;
            while (node !== null) {
                const { row, col } = node;
                setTimeout(() => {
                gridElem.children[row].children[col].classList.add(
                    "node-shortest-path-animate"
                );
                }, (visitedOrder.length + pathLength) * this.state.animationDelay);
                node = node.previousNode;
                pathLength++;
            }
        }
        // Re-enable mouse and keyboard after animations are finished
        setTimeout(() => {
        this.setState({ iskeyboardDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + pathLength + 1) * this.state.animationDelay);
        this.setState({ grid: newGrid });
    }
    // Depth_First_Search Algorithm (No animations)
    depthFirstSearchNoAnim(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = false;
        // Run dijkstra's with temp grid, no animations, start node, and ending node
        depthFirstSearch.depthFirstSearchAlgorithm(newGrid, animations, startNode, endNode);
        // Draw shortest path
        if (endNode.isVisited) {
            let node = startNode;
            while (node !== null) {
                const { row, col } = node;
                newGrid[row][col].isShortestPath = true;
                node = node.previousNode;
            }
        }
        this.setState({ instantAnimations: true });
        return newGrid;
    }

    // BFS Algorithm (Animations method)
    breadthFirstSearchAnimations() {
        // Disable mouse and buttons
        this.setState({ iskeyboardDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });
        // Clear node [all] classes and properties
        this.clearNodeClasses();
        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = true;
        const [visitedOrder, nodesInShortestPathOrder] = breadthFirstSearch.breadthFirstSearchAlgorithm(
        newGrid,
        animations,
        startNode,
        endNode
        );
        // Animations for visiting nodes
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
            const { row, col } = visitedOrder[i];
            setTimeout(() => {
                gridElem.children[row].children[col].classList.add(
                "node-visited-animate"
                );
            }, i * this.state.animationDelay);
        }
        
        // Animations for shortest path
        for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
            const { row, col } = nodesInShortestPathOrder[j];
            setTimeout(() => {
                gridElem.children[row].children[col].classList.add(
                "node-shortest-path-animate"
                );
            }, (visitedOrder.length + j) * this.state.animationDelay);
        }
        // Re-enable mouse and keyboard after animations are finished
        setTimeout(() => {
        this.setState({ iskeyboardDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + nodesInShortestPathOrder.length + 1) * this.state.animationDelay);
        this.setState({ grid: newGrid });
    }

    // Depth_First_Search Algorithm (No animations)
    breadthFirstSearchNoAnim(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = false;
        // Run dijkstra's with temp grid, no animations, start node, and ending node
        breadthFirstSearch.breadthFirstSearchAlgorithm(newGrid, animations, startNode, endNode);
        this.setState({ instantAnimations: true });
        return newGrid;
    }

    // A* Algorithm (Animations method)
    aStarAnimations() {
        // Disable mouse and buttons
        this.setState({ iskeyboardDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ finishAnimations: true });
        this.setState({ mouseIsPressed: false });

        // Clear node [all] classes and properties
        this.clearNodeClasses();

        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = true;
        const [visitedOrder, nodesInShortestPathOrder] = astar.aStarAlgorithm(
        newGrid,
        animations,
        startNode,
        endNode
        );
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < visitedOrder.length; i++) {
            const { row, col } = visitedOrder[i];
            setTimeout(() => {
                gridElem.children[row].children[col].classList.add(
                "node-visited-animate"
                );
            }, i * this.state.animationDelay);
        }
        // Animations for shortest path
        for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
            const { row, col } = nodesInShortestPathOrder[j];
            setTimeout(() => {
                gridElem.children[row].children[col].classList.add(
                "node-shortest-path-animate"
                );
            }, (visitedOrder.length + j) * this.state.animationDelay);
        }
        // Re-enable mouse and keyboard after animations are finished
        setTimeout(() => {
        this.setState({ iskeyboardDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + nodesInShortestPathOrder.length + 1) * this.state.animationDelay);
        // Set new grid
        this.setState({ grid: newGrid });
    }
    
    // A* Algorithm (No animations)
    aStarNoAnim(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = false;
        // Run dijkstra's with temp grid, no animations, start node, and ending node
        astar.aStarAlgorithm(newGrid, animations, startNode, endNode);
        this.setState({ instantAnimations: true });
        return newGrid;
    }

    // Recursive Division Algorithm (Wall algorithm)
    recursiveDivisionAnimation(mode) {
        // Disable mouse and buttons
        this.setState({ iskeyboardDisabled: true });
        this.setState({ isMouseDisabled: true });
        this.setState({ mouseIsPressed: false });
        // Clear node classes
        this.clearNodeClasses();
        // Turn off instant animations after placing walls, moving start/end nodes
        this.setState({ finishAnimations: false });
        // Graph, node, and arrays from dijkstra's algorithm for animation
        const newGrid = this.state.grid.slice();
        // Clear walls
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
                newGrid[i][j].isWall = false;
            }
        }
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        let wallVisitedOrder = recursiveDiv.recursiveDivisionAlgorithm(
        newGrid,
        startNode,
        endNode,
        mode
        );
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < wallVisitedOrder.length; i++) {
        const { row, col } = wallVisitedOrder[i];
        setTimeout(() => {
            gridElem.children[row].children[col].classList.add("node-wall-animate");
        }, i * this.state.animationDelay);
        }
        console.log(newGrid[0][1]);
        // Re-enable mouse and keyboard after animations are finished
        setTimeout(() => {
        this.setState({ iskeyboardDisabled: false, isMouseDisabled: false });
        this.clearNodeClasses();
        }, wallVisitedOrder.length * this.state.animationDelay + 500);
        this.setState({ grid: newGrid });
        return;
    }

    // Toggles starting node prop of node hovered by mouse
    toggleStart(grid, row, col) {
        if (grid[row][col].isFinish || grid[row][col].isWall) return grid;
        const newGrid = grid.slice();
        newGrid[startRow][startCol].isStart = false;
        newGrid[row][col].isStart = !newGrid[row][col].isStart;
        startCol = col;
        startRow = row;
        return newGrid;
    }

    // Toggles finish node prop of node hovered by mouse
    toggleFinish = (grid, row, col) => {
        if (grid[row][col].isStart || grid[row][col].isWall) return grid;
        const newGrid = grid.slice();
        newGrid[endRow][endCol].isFinish = false;
        newGrid[row][col].isFinish = !newGrid[row][col].isFinish;
        endCol = col;
        endRow = row;
        return newGrid;
    };
    
    // Toggles wall node prop of node hovered by mouse
    toggleWall = (grid, row, col) => {
        if (grid[row][col].isStart || grid[row][col].isFinish) return grid;
        const newGrid = grid.slice();
        newGrid[row][col].isWall = !newGrid[row][col].isWall;
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
    visualiseNoAnim(algorithm, newGrid) {
        switch (algorithm) {
        case DIJKSTRAS:
            return this.dijkstraNoAnim(newGrid);
        case ASTAR:
            return this.aStarNoAnim(newGrid);
        case Depth_First_Search:
            return this.depthFirstSearchNoAnim(newGrid);
        case Breadth_First_Search:
            return this.breadthFirstSearchNoAnim(newGrid);
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
        // Determine animation speed class
        const speedBtnClass =
          this.state.animationDelay === ANIMATION_FAST
            ? "fast-btn"
            : this.state.animationDelay === ANIMATION_AVG
            ? "average-btn"
            : "slow-btn";
        return (
          <div className="pathfindingCanvas">
            <div className="navBar">
                <button
                    className="visualise-btn"
                    onClick={() => {
                    if (this.state.algorithm !== "") {
                        this.visualise(this.state.algorithm);
                    } else {
                        this.setState({ visualiseBtnText: "Select an Algorithm" });
                    }
                    }}
                    disabled={this.state.iskeyboardDisabled}
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
                    disabled={this.state.iskeyboardDisabled}
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
                    disabled={this.state.iskeyboardDisabled}
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
                    disabled={this.state.iskeyboardDisabled}
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
                    disabled={this.state.iskeyboardDisabled}
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
                    disabled={this.state.iskeyboardDisabled}
                  >
                    Recursive Divison
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.recursiveDivisionAnimation("horizontal");
                    }}
                    disabled={this.state.iskeyboardDisabled}
                  >
                    Recursive Divison (Horizontal-skew)
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.recursiveDivisionAnimation("vertical");
                    }}
                    disabled={this.state.iskeyboardDisabled}
                  >
                    Recursive Divison (Vertical-skew)
                  </button>
                </div>
              </div>
              <button
                onClick={() => this.clearBoard()}
                disabled={this.state.iskeyboardDisabled}
              >
                Reset Board
              </button>
              <button
                onClick={() => {
                  this.clearNodeClasses();
                  this.setState({ finishAnimations: false, instantAnimations: false });
                }}
                disabled={this.state.iskeyboardDisabled}
              >
                Reset Animations
              </button>
              <button
                className={speedBtnClass}
                onClick={() => this.animationSpeed()}
                disabled={this.state.iskeyboardDisabled}
              >
                Animation Speed: {this.state.animationDelay} ms
              </button>
              <p>Pathfinding Visualiser</p>
            </div>
            {/* <Header /> */}
            <div className="grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div className="row" key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {
                        row,
                        col,
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
                          key={nodeIdx}
                          row={row}
                          col={col}
                          isStart={isStart}
                          isFinish={isFinish}
                          isWall={isWall}
                          isVisited={isVisited}
                          isShortestPath={isShortestPath}
                          isAnimated={isAnimated}
                          fcost={fcost}
                          onMouseDown={(e) =>
                            this.handleMouseDown(e, row, col, isStart, isFinish)
                          }
                          onMouseEnter={() => this.handleMouseEnter(row, col)}
                          onMouseUp={this.handleMouseUp}
                        ></Node>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {/* <Footer /> */}
          </div>
        );
      }
    }
    //End of rendering  
    

// Creates the initial grid filled with nodes using a two dimensional array
const createGrid = () => {
    const grid = [];
    for (let row = 0; row < rowLen; row++) {
      const currentRow = [];
      for (let col = 0; col < colLen; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Creates blank node
  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === startRow && col === startCol,
      isFinish: row === endRow && col === endCol,

      // General pathfinding variables
      dist: Infinity,
      previousNode: null,
      isVisited: false,

      isWall: false,
      isAnimated: false,
      isShortestPath: false,


      // A Star* Variables
      fcost: Infinity,
      gcost: Infinity,
      heuristicCost: Infinity,
      
      parent: null,
      rank: 0,
    };
  };
  

  /*
  Additional features
  Add counter to show how many nodes traversed and in how much time or timer
  Use file handling to load in previous mazes
  Mention time complexity (?)
  Add tables 
  https://onlinetexttools.com/replace-text
  

For Depth_First_Search, talk about iterative stack implementation vs recursive implementation



  -- Done --
  Make grid background black
  Change css animations from github

  Ask teacher what exactly is getting sent
  

  */