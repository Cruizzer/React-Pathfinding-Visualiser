// Import react
import React, { Component } from "react";
// Import stylesheets
import "./pathfindingVisualiser.css";
// Import algorithms
import * as dijkstra from "./pathfindingAlgorithms/dijkstra";
import * as astar from "./pathfindingAlgorithms/astar";
import * as bfs from "./pathfindingAlgorithms/bfs"
import * as recursiveDiv from "./mazeGeneratingAlgorithms/recursiveDivision";

import Node from "./Node/node";

// Define grid constants
const rowLen = 29; //29
const colLen = 59; //59
// Define Animation Delay constants
const ANIMATION_FAST = 10;
const ANIMATION_AVG = 20;
const ANIMATION_SLOW = 30;
// Define start/end node starting positions
let startRow = 14; // 15
let startCol = 14;
let endRow = 14;
let endCol = 45;
// Define algorithm constants
const DIJKSTRAS = "Dijkstra's";
const DFS = "DFS";
const BFS = "BFS";
const ASTAR = "A* Search";


export default class PathfindingVisualiser extends Component {
    constructor(props) {
        super(props);
        this.state = {
          grid: [], // 2-D grid representing graph
          mouseIsPressed: false, // Boolean to indicate mouse press
          isButtonDisabled: false, // Boolean to toggle whether buttons are disabled
          isMouseDisabled: false, // Boolean to toggle whether mouse is disabled
          moveStart: false, // Boolean to indicate moving start node
          moveFinish: false,  // Boolean to indicate moving end node
          finishAnimations: false,  // Boolean to indicate visualizations have completed
          algorithm: "",  // Name of the currently selected algorithm
          visualizeBtnText: "Visualize", // Used to change the name of the visualization button to selected algorithm
          isInstantAnims: false,  // Boolean to indicate instant animations (When adding walls and moving end/start node after visualizations are complete)
          animationDelay: ANIMATION_FAST, // Animation delay between css visualization animations
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
        this.bfsAnimations = this.bfsAnimations.bind(this);
        this.bfsNoAnim = this.bfsNoAnim.bind(this);
        this.recursiveDivisionAnimation = this.recursiveDivisionAnimation.bind(this);

        // Bind other functions
        this.clearBoard = this.clearBoard.bind(this);
        this.clearNodeClasses = this.clearNodeClasses.bind(this);
        this.cycleSpeed = this.cycleSpeed.bind(this);
    }

    componentDidMount() {
        // Create initial grid and set to state
        const grid = createGrid();
        this.setState({ grid });
    } 

    handleMouseDown(e, row, col, isStart, isFinish) {
        if (this.state.isMouseDisabled) return;
        e.preventDefault();
        // Moving start/finish | toggle wall
        if (isStart) {
            this.setState({ moveStart: true });
        } else if (isFinish) {
            this.setState({ moveFinish: true });
        } else {
            let newGrid = this.toggleWall(this.state.grid, row, col);
            // Reanimate instantly when wall is added after animations are finished
            if (this.state.finishAnimations) {
            newGrid = this.visualizeNoAnim(this.state.algorithm, newGrid);
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
            newGrid = this.visualizeNoAnim(this.state.algorithm, newGrid);
            }
        } else if (this.state.moveFinish) {
            newGrid = this.toggleFinish(this.state.grid, row, col);
            if (this.state.finishAnimations) {
            newGrid = this.visualizeNoAnim(this.state.algorithm, newGrid);
            }
        } else {
            newGrid = this.toggleWall(this.state.grid, row, col);
            if (this.state.finishAnimations) {
            newGrid = this.visualizeNoAnim(this.state.algorithm, newGrid);
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
        // Select grid element
        const gridElem = document.getElementsByClassName("grid")[0];
        // Create initial grid
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
        grid: newGrid,
        finishAnimations: false,
        isInstantAnims: false,
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
            newGrid[i][j].hcost = Infinity;
        }
        }
        this.setState({ grid: newGrid });
    }
    // Reset grid (Includes Node [animation] classes and properties)
    clearAnimations(newGrid) {
        const gridElem = document.getElementsByClassName("grid")[0];
        for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {
            //Reset Node properties of all nodes
            newGrid[i][j].dist = Infinity;
            newGrid[i][j].isVisited = false;
            newGrid[i][j].previousNode = null;
            newGrid[i][j].isInPQ = false;
            newGrid[i][j].isShortestPath = false;
            newGrid[i][j].isAnimated = false;
            newGrid[i][j].fcost = Infinity;
            newGrid[i][j].gcost = Infinity;
            newGrid[i][j].hcost = Infinity;
            //Reset animation classes in entire grid
            if (!this.state.isInstantAnims) {
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
        this.setState({ isButtonDisabled: true });
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
        // Reenable mouse and buttons after animations are finished
        setTimeout(() => {
        this.setState({ isButtonDisabled: false, isMouseDisabled: false });
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
        this.setState({ isInstantAnims: true });
        return newGrid;
    }

    // BFS Algorithm (With animations)
    bfsAnimations() {
        // Disable mouse and buttons
        this.setState({ isButtonDisabled: true });
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
        const [visitedOrder, nodesInShortestPathOrder] = bfs.bfsAlgorithm(
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
        // Reenable mouse and buttons after animations are finished
        setTimeout(() => {
        this.setState({ isButtonDisabled: false, isMouseDisabled: false });
        }, (visitedOrder.length + nodesInShortestPathOrder.length + 1) * this.state.animationDelay);
        this.setState({ grid: newGrid });
    }

    // DFS Algorithm (No animations)
    bfsNoAnim(newGrid) {
        this.clearAnimations(newGrid);
        const startNode = newGrid[startRow][startCol];
        const endNode = newGrid[endRow][endCol];
        const animations = false;
        // Run dijkstra's with temp grid, no animations, start node, and ending node
        bfs.bfsAlgorithm(newGrid, animations, startNode, endNode);
        this.setState({ isInstantAnims: true });
        return newGrid;
    }

    // A* Algorthim (With animations)
    aStarAnimations() {
        // Disable mouse and buttons
        this.setState({ isButtonDisabled: true });
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
        // Reenable mouse and buttons after animations are finished
        setTimeout(() => {
        this.setState({ isButtonDisabled: false, isMouseDisabled: false });
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
        this.setState({ isInstantAnims: true });
        return newGrid;
    }

    // Recursive Division Algorithm (Wall algorithm)
    recursiveDivisionAnimation(mode) {
        // Disable mouse and buttons
        this.setState({ isButtonDisabled: true });
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
        // Reenable mouse and buttons after animations are finished
        setTimeout(() => {
        this.setState({ isButtonDisabled: false, isMouseDisabled: false });
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

    // Handles visualization button click with animations
    visualize(algorithm) {
        switch (algorithm) {
        case DIJKSTRAS:
            this.dijkstraAnimations();
            break;
        case ASTAR:
            this.aStarAnimations();
            break;
        case DFS:
            this.dfsAnimations();
            break;
        case BFS:
            this.bfsAnimations();
            break;
        default:
            break;
        }
    }
    // Handles visualization with wall addition and start/end node moving (No animations)
    visualizeNoAnim(algorithm, newGrid) {
        switch (algorithm) {
        case DIJKSTRAS:
            return this.dijkstraNoAnim(newGrid);
        case ASTAR:
            return this.aStarNoAnim(newGrid);
        case DFS:
            return this.dfsNoAnim(newGrid);
        case BFS:
            return this.bfsNoAnim(newGrid);
        default:
            break;
        }
    }
    // Handles cycling animation delay button click
    cycleSpeed() {
        if (this.state.animationDelay === ANIMATION_FAST) {
        this.setState({ animationDelay: ANIMATION_AVG });
        } else if (this.state.animationDelay === ANIMATION_AVG) {
        this.setState({ animationDelay: ANIMATION_SLOW });
        } else {
        this.setState({ animationDelay: ANIMATION_FAST });
        }
    }

    //Start of rendering
    render() {
        // Grab current state of grid
        const { grid } = this.state;
        // Determine animation delay class
        const speedBtnClass =
          this.state.animationDelay === ANIMATION_FAST
            ? "fast-btn"
            : this.state.animationDelay === ANIMATION_AVG
            ? "average-btn"
            : "slow-btn";
        return (
          <div className="pathfindingCanvas">
            <div className="navBar">
              <p>Pathfinding Visualizer</p>
              <div className="dropdown">
                <p>Pathfinding Algorithms</p>
                <div className="dropdown-content">
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: DIJKSTRAS,
                        visualizeBtnText: "Visualize " + DIJKSTRAS,
                        finishAnimations: false,
                        isInstantAnims: false,
                      });
                    }}
                    disabled={this.state.isButtonDisabled}
                  >
                    Dijkstra's Algorithm
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: ASTAR,
                        visualizeBtnText: "Visualize " + ASTAR,
                        finishAnimations: false,
                        isInstantAnims: false,
                      });
                    }}
                    disabled={this.state.isButtonDisabled}
                  >
                    A* Search (Euclidean)
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: DFS,
                        visualizeBtnText: "Visualize " + DFS,
                        finishAnimations: false,
                        isInstantAnims: false,
                      });
                    }}
                    disabled={this.state.isButtonDisabled}
                  >
                    Depth-first Algorithm
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.clearNodeClasses();
                      this.setState({
                        algorithm: BFS,
                        visualizeBtnText: "Visualize " + BFS,
                        finishAnimations: false,
                        isInstantAnims: false,
                      });
                    }}
                    disabled={this.state.isButtonDisabled}
                  >
                    Breath-first Algorithm
                  </button>
                </div>
              </div>
              <div className="dropdown">
                <p>Maze Algorithms</p>
                <div className="dropdown-content">
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.recursiveDivisionAnimation("deterministic");
                    }}
                    disabled={this.state.isButtonDisabled}
                  >
                    Recursive Divison
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.recursiveDivisionAnimation("horizontal");
                    }}
                    disabled={this.state.isButtonDisabled}
                  >
                    Recursive Divison (Horizontal-skew)
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => {
                      this.recursiveDivisionAnimation("vertical");
                    }}
                    disabled={this.state.isButtonDisabled}
                  >
                    Recursive Divison (Vertical-skew)
                  </button>
                </div>
              </div>
              <button
                className="visualize-btn"
                onClick={() => {
                  if (this.state.algorithm !== "") {
                    this.visualize(this.state.algorithm);
                  } else {
                    this.setState({ visualizeBtnText: "Select an Algorithm" });
                  }
                }}
                disabled={this.state.isButtonDisabled}
              >
                {this.state.visualizeBtnText}
              </button>
              <button
                onClick={() => this.clearBoard()}
                disabled={this.state.isButtonDisabled}
              >
                Clear Board
              </button>
              <button
                onClick={() => {
                  this.clearNodeClasses();
                  this.setState({ finishAnimations: false, isInstantAnims: false });
                }}
                disabled={this.state.isButtonDisabled}
              >
                Reset Animations
              </button>
              <button
                className={speedBtnClass}
                onClick={() => this.cycleSpeed()}
                disabled={this.state.isButtonDisabled}
              >
                Animation Delay: {this.state.animationDelay} ms
              </button>
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
    

// Creates initial grid filled with nodes
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
      isVisited: false,
      previousNode: null,
      // Class Toggles
      isWall: false,
      isShortestPath: false,
      isAnimated: false,
      // A Star* Variables
      fcost: Infinity,
      hcost: Infinity,
      gcost: Infinity,
      // Union-find Variables
      parent: null,
      rank: 0,
    };
  };
  

  /*
  Additional features
  Add counter to show how many nodes traversed and in how much time or timer
  Use file handling to load in previous mazes
  Mention time complexity (?)
  https://onlinetexttools.com/replace-text
  

  -- Done --
  Make grid background black
  Change css animations from github

  Ask teacher what exactly is getting sent
  

  */