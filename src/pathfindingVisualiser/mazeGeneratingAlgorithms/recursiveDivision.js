// Recursive Division

// The passages are placed on odd numbered indices and walls are placed on even numbered indices

// Recursive Division dependant on the grid dimensions
function recursiveDivision(
  grid,
  row,
  maxRow,
  column,
  maxColumn,
  startNode,
  endNode,
  isHorizontal,
  wallsVisitedOrder
) {
  if (maxRow - row < 1 || maxColumn - column < 1) return;
  
  if (isHorizontal) {
    let pivot = randomEvenInteger(row, maxRow);
    createHorizontalWall(
      grid,
      column,
      maxColumn,
      pivot,
      startNode,
      endNode,
      wallsVisitedOrder
    );
    recursiveDivision(
      grid,
      pivot + 1,
      maxRow,
      column,
      maxColumn,
      startNode,
      endNode,
      Deterministic(row, maxRow, column, maxColumn),
      wallsVisitedOrder
    );
    recursiveDivision(
      grid,
      row,
      pivot - 1,
      column,
      maxColumn,
      startNode,
      endNode,
      Deterministic(row, maxRow, column, maxColumn),
      wallsVisitedOrder
    );
  } else {
    let pivot = randomEvenInteger(column, maxColumn);
    createVerticalWall(
      grid,
      row,
      maxRow,
      pivot,
      startNode,
      endNode,
      wallsVisitedOrder
    );
    recursiveDivision(
      grid,
      row,
      maxRow,
      pivot + 1,
      maxColumn,
      startNode,
      endNode,
      Deterministic(row, maxRow, column, maxColumn),
      wallsVisitedOrder
    );
    recursiveDivision(
      grid,
      row,
      maxRow,
      column,
      pivot - 1,
      startNode,
      endNode,
      Deterministic(row, maxRow, column, maxColumn),
      wallsVisitedOrder
    );
  }
  return;
}

// Choose orientation of next recursive call based on heigh and widith
function Deterministic(row, maxRow, column, maxColumn) {
  if (maxColumn - column < maxRow - row) {
    return true;
  } else if (maxColumn - column > maxRow - row) {
    return false;
  } else {
    return Math.random() > 0.5 ? true : false;
  }
}

// Generates random even number between low and high (Inclusive-Inclusive)
function randomEvenInteger(low, high) {
  let min = Math.ceil(low / 2);
  let max = Math.floor((high - low + 1) / 2);
  return 2 * (Math.floor(Math.random() * max) + min);
}
// Generates random odd number between low and high (Inclusive-Inclusive)
function randomOddInteger(low, high) {
  let even = randomEvenInteger(low, high);
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
// Creates horizontal wall with hole on row between columnA and columnB
function createHorizontalWall(
  grid,
  columnA,
  columnB,
  row,
  startNode,
  endNode,
  wallsVisitedOrder
) {
  // Hole is a random odd number between columnA and columnB
  let hole = randomOddInteger(columnA, columnB);
  // Draw walls from columnA to columnB on row aside from hole
  for (let i = columnA; i <= columnB; i++) {
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
// Creates vertical wall with hole on column between rowA and rowB
function createVerticalWall(
  grid,
  rowA,
  rowB,
  column,
  startNode,
  endNode,
  wallsVisitedOrder
) {
  // Hole is a random odd integer between rowA and rowB
  let hole = randomOddInteger(rowA, rowB);
  // Draw walls from rowA to rowB on column except for hole
  for (let i = rowA; i <= rowB; i++) {
    if (i === hole) {
      grid[i][column].isWall = false;
    } else {
      if (grid[i][column] !== startNode && grid[i][column] !== endNode) {
        grid[i][column].isWall = true;
        grid[i][column].isAnimated = true;
        wallsVisitedOrder.push(grid[i][column]);
      }
    }
  }
}


export function recursiveDivisionAlgorithm(grid, startNode, endNode) {
  // Initialize order of visited nodes to animate as walls
  let wallsVisitedOrder = [];
  // Create outter walls to enclose maze
  createBoundaryWalls(grid, wallsVisitedOrder);
  // Initialize inner maze boundaries
  let row = 1;
  let maxRow = grid.length - 2;
  let column = 1;
  let maxColumn = grid[0].length - 2;
  // Run Recursive Division algorithm
  recursiveDivision(
    grid,
    row,
    maxRow,
    column,
    maxColumn,
    startNode,
    endNode,
    Deterministic(row, maxRow, column, maxColumn),
    wallsVisitedOrder
  );
  return wallsVisitedOrder;
}