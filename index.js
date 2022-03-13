import Board from "./components/Board.js";

const resultTextElement = document.getElementById("result-text");
const board = new Board();

function init() {
    resultTextElement.textContent = "";
    board.putOnEmptyCellsRandomly(2);
}

const playAgainButton = document.getElementById("play-again-btn");
playAgainButton.addEventListener("click", () => {
    board.reset();
    init();
});

init();
window.addEventListener("keydown", handleInput);

function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            if (ableToMoveUp) {
                moveUp();
            }
            break;
        case "ArrowDown":
            if (ableToMoveDown) {
                moveDown();
            }
            break;
        case "ArrowLeft":
            if (ableToMoveLeft) {
                moveLeft();
            }
            break;
        case "ArrowRight":
            if (ableToMoveRight) {
                moveRight();
            }
            break;
        default:
            return;
    }

    board.cells.forEach(cell => cell.merge());

    board.putOnEmptyCellsRandomly(1);

    if (isThere2048()) {
        resultTextElement.textContent = "You Win!";
        return;
    }

    if (!ableToMove()) {
        resultTextElement.textContent = "You Lose!";
        return;
    }
}

function isThere2048() {
    return board.cells.some(cell => cell.tile && cell.tile.value == 2048);
}

function move(cells) {
    cells.flatMap(group => {
        for (let i = group.length - 2; i >= 0; --i) {
            if (!group[i].tile) {
                continue;
            }
            let latestValidCell;
            for (let j = i + 1; j < group.length; ++j) {
                if (!group[j].canAccept(group[i])) {
                    break;
                }
                latestValidCell = group[j];
            }
            
            if (latestValidCell) {
                if (latestValidCell.tile) {
                    latestValidCell.bufferTile = group[i].tile;
                } else {
                    latestValidCell.tile = group[i].tile;
                }
                group[i].removeTile();
            }
        }
    });
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            return index > 0 && cell.tile && group[index - 1].canAccept(cell);
        })
    })
}

function moveUp() {
    const cells = board.getCellsByColumns(true);
    move(cells);
}

function ableToMoveUp() {
    return canMove(board.getCellsByColumns(true));
}

function moveDown() {
    const cells = board.getCellsByColumns(false);
    move(cells);
}

function ableToMoveDown() {
    return canMove(board.getCellsByColumns(false));
}

function moveLeft() {
    const cells = board.getCellsByRows(true);
    move(cells);
}

function ableToMoveLeft() {
    return canMove(board.getCellsByRows(true));
}

function moveRight() {
    const cells = board.getCellsByRows(false);
    move(cells);
}

function ableToMoveRight() {
    return canMove(board.getCellsByRows(false));
}

function ableToMove() {
    return ableToMoveUp() || ableToMoveDown() || ableToMoveRight() || ableToMoveLeft();
}