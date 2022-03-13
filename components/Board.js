const boardElement = document.getElementById("board");

export default class Board {
    #cells

    constructor() {
        this.#cells = this.#createCells();
    }

    reset() {
        boardElement.innerHTML = "";
        this.#cells = this.#createCells();
    }

    get cells() {
        return this.#cells;
    }

    get #emptyCells() {
        return this.#cells.filter(cell => !cell.tile);
    }

    #getStarterRandomNumber() {
        const possibleValues = [2, 4];
        const randomIndex = Math.floor(Math.random() * possibleValues.length);
        return possibleValues[randomIndex];
    }

    putOnEmptyCellsRandomly(requestedTotalCells) {
        if (requestedTotalCells <= 0 || requestedTotalCells > this.#emptyCells.length) {
            return;
        }

        while (requestedTotalCells-- > 0) {
            const value = this.#getStarterRandomNumber();
            const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
            this.#emptyCells[randomIndex].tile = new Tile(value);
        }
    }

    getCellsByRows(isReversed) {
        const rows = this.#cells.reduce((cells, cell) => {
            cells[cell.x] = cells[cell.x] || [];
            cells[cell.x][cell.y] = cell;
            return cells;
        }, []);

        if (isReversed) {
            return rows.map(row => [...row].reverse());
        }

        return rows;
    }

    getCellsByColumns(isReversed) {
        const cols = this.#cells.reduce((cells, cell) => {
            cells[cell.y] = cells[cell.y] || [];
            cells[cell.y][cell.x] = cell;
            return cells;
        }, []);

        if (isReversed) {
            return cols.map(col => [...col].reverse());
        }
        
        return cols;
    }

    #createCells() {
        const cells = [];
        for (let i = 0; i < 16; ++i) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            boardElement.append(cell);
            cells.push(new Cell(
                i % 4,
                Math.floor(i / 4),
            ));
        }
        return cells;
    }
}

class Cell {
    #x
    #y
    #tile
    #bufferTile

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    set tile(tile) {
        this.#tile = tile;
        if (!tile) {
            return;
        }
        this.#tile.setPosition(this.#x, this.#y);
    }

    set bufferTile(tile) {
        this.#bufferTile = tile;
        if (!tile) {
            return;
        }
        this.#bufferTile.setPosition(this.#x, this.#y);
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile;
    }

    canAccept(cell) {
        return !this.#tile || 
            (!this.#bufferTile && this.#tile.value == cell.tile.value);
    }

    merge() {
        if (!this.#tile || !this.#bufferTile) {
            return;
        }

        this.#tile.value = this.#tile.value + this.#bufferTile.value;
        this.#bufferTile.remove();
        this.#bufferTile = undefined;
    }

    removeTile() {
        if (!this.#tile) {
            return;
        }

        this.#tile = undefined;
    }
}

class Tile {
    #element
    #value

    constructor(value) {
        this.#element = document.createElement("div");
        this.#element.classList.add("tile");
        this.value = value;

        boardElement.append(this.#element);
    }

    set value(value) {
        this.#value = value;
        this.#element.textContent = value;
        const power = Math.log2(value);
        const lightness = 90 - power * 5;
        this.#element.style.setProperty("--background-lightness", `${lightness}%`);
        this.#element.style.setProperty("--text-color", `${lightness < 50 ? '#E6D5B8' : '#1B1A17'}`)
    }

    get value() {
        return this.#value;
    }

    setPosition(x, y) {
        this.#element.style.setProperty("--x", x);
        this.#element.style.setProperty("--y", y);
    }

    remove() {
        this.#element.remove();
    }
}