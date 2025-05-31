const board = document.getElementById("board");
let grid = Array(16).fill(0);

function draw() {
  board.innerHTML = "";
  grid.forEach(value => {
    const tile = document.createElement("div");
    tile.className = "tile";
    const inner = document.createElement("div");
    inner.className = "tile-inner";
    inner.textContent = value ? value : "";
    tile.appendChild(inner);
    board.appendChild(tile);
  });
}

function addRandomTile() {
  const empty = grid.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
  if (empty.length === 0) return;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  grid[idx] = Math.random() < 0.9 ? 2 : 4;
}

function moveLeft() {
  for (let r = 0; r < 4; r++) {
    let row = grid.slice(r * 4, r * 4 + 4).filter(n => n !== 0);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }
    row = row.filter(n => n !== 0);
    while (row.length < 4) row.push(0);
    for (let i = 0; i < 4; i++) {
      grid[r * 4 + i] = row[i];
    }
  }
  addRandomTile();
  draw();
}

function rotateGrid(times) {
  for (let t = 0; t < times; t++) {
    const newGrid = [];
    for (let c = 0; c < 4; c++) {
      for (let r = 3; r >= 0; r--) {
        newGrid.push(grid[r * 4 + c]);
      }
    }
    grid = newGrid;
  }
}

function move(dir) {
  if (dir === "left") moveLeft();
  if (dir === "right") {
    rotateGrid(2); moveLeft(); rotateGrid(2);
  }
  if (dir === "up") {
    rotateGrid(1); moveLeft(); rotateGrid(3);
  }
  if (dir === "down") {
    rotateGrid(3); moveLeft(); rotateGrid(1);
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
});

// スワイプ対応
let startX, startY;
board.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startX = t.clientX;
  startY = t.clientY;
});
board.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move("right");
    else if (dx < -30) move("left");
  } else {
    if (dy > 30) move("down");
    else if (dy < -30) move("up");
  }
});

addRandomTile();
addRandomTile();
draw();
