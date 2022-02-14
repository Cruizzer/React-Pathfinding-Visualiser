// Main Recrusive Division Algorithm call
// Walls are placed on even numbered indices (Not placed on start or end nodes)
// Passages/Holes are placed on odd numbered indices
export function recursiveDivisionAlgorithm(grid, startNode, endNode, mode) {
    // Initialize order of visited nodes to animate as walls
    let wallsVisitedOrder = [];
    // Create outter walls to enclose maze
    createBoundaryWalls(grid, wallsVisitedOrder);
    // Initialize inner maze boundaries
    let r = 1;
    let maxR = grid.length - 2;
    let c = 1;
    let maxC = grid[0].length - 2;
    // Run Recursive Division algorithm based on mode(deterministic/horizontal/vertical)
    if (mode === "deterministic") {
      recursiveDivisionDeterministic(
        grid,
        r,
        maxR,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationDeterministic(r, maxR, c, maxC),
        wallsVisitedOrder
      );
    } else if (mode === "horizontal") {
      recursiveDivisionHorizontal(
        grid,
        r,
        maxR,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationHorizontal(),
        wallsVisitedOrder
      );
    } else {
      recursiveDivisionVertical(
        grid,
        r,
        maxR,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationVertical(),
        wallsVisitedOrder
      );
    }
    return wallsVisitedOrder;
  }
  // Recursive Division based on width and height of maze dimensions
  function recursiveDivisionDeterministic(
    grid,
    r,
    maxR,
    c,
    maxC,
    startNode,
    endNode,
    isHorizontal,
    wallsVisitedOrder
  ) {
    if (maxR - r < 1 || maxC - c < 1) return;
    if (isHorizontal) {
      let pivot = randEvenInt(r, maxR);
      createHorizontalWall(
        grid,
        c,
        maxC,
        pivot,
        startNode,
        endNode,
        wallsVisitedOrder
      );
      recursiveDivisionDeterministic(
        grid,
        pivot + 1,
        maxR,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationDeterministic(r, maxR, c, maxC),
        wallsVisitedOrder
      );
      recursiveDivisionDeterministic(
        grid,
        r,
        pivot - 1,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationDeterministic(r, maxR, c, maxC),
        wallsVisitedOrder
      );
    } else {
      let pivot = randEvenInt(c, maxC);
      createVerticalWall(
        grid,
        r,
        maxR,
        pivot,
        startNode,
        endNode,
        wallsVisitedOrder
      );
      recursiveDivisionDeterministic(
        grid,
        r,
        maxR,
        pivot + 1,
        maxC,
        startNode,
        endNode,
        chooseOrientationDeterministic(r, maxR, c, maxC),
        wallsVisitedOrder
      );
      recursiveDivisionDeterministic(
        grid,
        r,
        maxR,
        c,
        pivot - 1,
        startNode,
        endNode,
        chooseOrientationDeterministic(r, maxR, c, maxC),
        wallsVisitedOrder
      );
    }
    return;
  }
  // Recursive Division based on random choice (With horizontal preference)
  function recursiveDivisionHorizontal(
    grid,
    r,
    maxR,
    c,
    maxC,
    startNode,
    endNode,
    isHorizontal,
    wallsVisitedOrder
  ) {
    if (maxR - r < 1 || maxC - c < 1) return;
    if (isHorizontal) {
      let pivot = randEvenInt(r, maxR);
      createHorizontalWall(
        grid,
        c,
        maxC,
        pivot,
        startNode,
        endNode,
        wallsVisitedOrder
      );
      recursiveDivisionHorizontal(
        grid,
        pivot + 1,
        maxR,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationHorizontal(),
        wallsVisitedOrder
      );
      recursiveDivisionHorizontal(
        grid,
        r,
        pivot - 1,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationHorizontal(),
        wallsVisitedOrder
      );
    } else {
      let pivot = randEvenInt(c, maxC);
      createVerticalWall(
        grid,
        r,
        maxR,
        pivot,
        startNode,
        endNode,
        wallsVisitedOrder
      );
      recursiveDivisionHorizontal(
        grid,
        r,
        maxR,
        pivot + 1,
        maxC,
        startNode,
        endNode,
        chooseOrientationHorizontal(),
        wallsVisitedOrder
      );
      recursiveDivisionHorizontal(
        grid,
        r,
        maxR,
        c,
        pivot - 1,
        startNode,
        endNode,
        chooseOrientationHorizontal(),
        wallsVisitedOrder
      );
    }
    return;
  }
  // Recrusive Division based on random choice (With vertical preference)
  function recursiveDivisionVertical(
    grid,
    r,
    maxR,
    c,
    maxC,
    startNode,
    endNode,
    isHorizontal,
    wallsVisitedOrder
  ) {
    if (maxR - r < 1 || maxC - c < 1) return;
    if (isHorizontal) {
      let pivot = randEvenInt(r, maxR);
      createHorizontalWall(
        grid,
        c,
        maxC,
        pivot,
        startNode,
        endNode,
        wallsVisitedOrder
      );
      recursiveDivisionVertical(
        grid,
        pivot + 1,
        maxR,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationVertical(),
        wallsVisitedOrder
      );
      recursiveDivisionVertical(
        grid,
        r,
        pivot - 1,
        c,
        maxC,
        startNode,
        endNode,
        chooseOrientationVertical(),
        wallsVisitedOrder
      );
    } else {
      let pivot = randEvenInt(c, maxC);
      createVerticalWall(
        grid,
        r,
        maxR,
        pivot,
        startNode,
        endNode,
        wallsVisitedOrder
      );
      recursiveDivisionVertical(
        grid,
        r,
        maxR,
        pivot + 1,
        maxC,
        startNode,
        endNode,
        chooseOrientationVertical(),
        wallsVisitedOrder
      );
      recursiveDivisionVertical(
        grid,
        r,
        maxR,
        c,
        pivot - 1,
        startNode,
        endNode,
        chooseOrientationVertical(),
        wallsVisitedOrder
      );
    }
    return;
  }
  // Choose orientation of next recursive call based on heigh and widith
  function chooseOrientationDeterministic(r, maxR, c, maxC) {
    if (maxC - c < maxR - r) {
      return true;
    } else if (maxC - c > maxR - r) {
      return false;
    } else {
      return Math.random() > 0.5 ? true : false;
    }
  }
  // Choose orientation based on random choice (With horizontal preference)
  function chooseOrientationHorizontal() {
    return Math.random() > 0.3 ? true : false;
  }
  // Choose orientation based on random choice (With vertical preference)
  function chooseOrientationVertical() {
    return Math.random() > 0.3 ? false : true;
  }
  // Generates random even number between low and high (Inclusive-Inclusive)
  function randEvenInt(low, high) {
    let min = Math.ceil(low / 2);
    let max = Math.floor((high - low + 1) / 2);
    return 2 * (Math.floor(Math.random() * max) + min);
  }
  // Generates random odd number between low and high (Inclusive-Inclusive)
  function randOddInt(low, high) {
    let even = randEvenInt(low, high);
    if (even === high) return even - 1;
    return even + 1;
  }
  // Creates outter walls of maze, avoid start and end nodes
  function createBoundaryWalls(grid, wallsVisitedOrder) {
    for (let i = 0; i < grid[0].length; i++) {
      if (!grid[0][i].isFinish && !grid[0][i].isStart) {
        grid[0][i].isWall = true;
        grid[0][i].isAnimated = true;
        wallsVisitedOrder.push(grid[0][i]);
      }
      if (
        !grid[grid.length - 1][i].isFinish &&
        !grid[grid.length - 1][i].isStart
      ) {
        grid[grid.length - 1][i].isWall = true;
        grid[grid.length - 1][i].isAnimated = true;
        wallsVisitedOrder.push(grid[grid.length - 1][i]);
      }
    }
    for (let j = 0; j < grid.length; j++) {
      if (!grid[j][0].isFinish && !grid[j][0].isStart) {
        grid[j][0].isWall = true;
        grid[j][0].isAnimated = true;
        wallsVisitedOrder.push(grid[j][0]);
      }
      if (
        !grid[j][grid[0].length - 1].isFinish &&
        !grid[j][grid[0].length - 1].isStart
      ) {
        grid[j][grid[0].length - 1].isWall = true;
        grid[j][grid[0].length - 1].isAnimated = true;
        wallsVisitedOrder.push(grid[j][grid[0].length - 1]);
      }
    }
  }
  // Creates horizontal wall with hole on row between colA and colB
  function createHorizontalWall(
    grid,
    colA,
    colB,
    row,
    startNode,
    endNode,
    wallsVisitedOrder
  ) {
    // Hole is a random odd number between colA and colB
    let hole = randOddInt(colA, colB);
    // Draw walls from colA to colB on row aside from hole
    for (let i = colA; i <= colB; i++) {
      if (i === hole) {
        grid[row][i].isWall = false;
      } else {
        if (grid[row][i] !== startNode && grid[row][i] !== endNode) {
          grid[row][i].isWall = true;
          grid[row][i].isAnimated = true;
          wallsVisitedOrder.push(grid[row][i]);
        }
      }
    }
  }
  // Creates vertical wall with hole on col between rowA and rowB
  function createVerticalWall(
    grid,
    rowA,
    rowB,
    col,
    startNode,
    endNode,
    wallsVisitedOrder
  ) {
    // Hole is a random odd integer between rowA and rowB
    let hole = randOddInt(rowA, rowB);
    // Draw walls from rowA to rowB on col except for hole
    for (let i = rowA; i <= rowB; i++) {
      if (i === hole) {
        grid[i][col].isWall = false;
      } else {
        if (grid[i][col] !== startNode && grid[i][col] !== endNode) {
          grid[i][col].isWall = true;
          grid[i][col].isAnimated = true;
          wallsVisitedOrder.push(grid[i][col]);
        }
      }
    }
  }