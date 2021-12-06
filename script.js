const Gameboard = (function() {
    const board = new Array(new Array(3), new Array(3), new Array(3));

    const getBoard = () => { return board };

    const getField = (i, j) => { return board[i][j] };

    const getAllBoardElements = () => {
        let boardElements = [...document.querySelector("#board").children];
        return boardElements;
    }

    const renderBoard = () => {
        let boardElements = getAllBoardElements();

        for (let i = 0; i < boardElements.length; i++) {
            let row = boardElements[i].id[1]; //shift up b/c underscore added to id's
            let col = boardElements[i].id[2];

            boardElements[i].textContent = getField(row, col);
        }
    }

    const setField = (i, j, value) => {
        board[i][j] = value;
        renderBoard();
    };

    const reset = (value) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                setField(i, j, value);
            }
        }

        renderBoard();
    }

    log("Board created.")

    return { getBoard, setField, getField, renderBoard, reset, getAllBoardElements }
})();

const Game = (function() {
    // function to update field when player has played; if already played in this square, do nothing
    function updateField() {
        if (Gameboard.getField(getRow(this), getCol(this)) === undefined) {
            Gameboard.setField(getRow(this), getCol(this), getPlayerTurn());
            playerTurn = (playerTurn + 1) % 2; // switch player's turn
            log("Field updated. Row = " + getRow(this) + ". Col = " + getCol(this) + ".")
        }

        // check if anybody has won
        if (checkIfWinner()) {
            displayWinner();
            return;
        } else if (checkIf9Moves()) {
            displayTie();
        }
    }

    const getRow = (el) => el.id[1]; //shift up b/c underscore added to id's
    const getCol = (el) => el.id[2];

    // check if there is a victor after each play
    function checkIfWinner() {
        return (checkColsForWin() || checkRowsForWin() || checkDiagsForWin());
    }

    function checkRowsForWin() {
        for (let row = 0; row < 3; row++) {
            let arr = new Array(3);
            for (let col = 0; col < 3; col++) {
                arr[col] = Gameboard.getField(row, col);
            }
            if (allSame(arr) && arr[0] !== undefined) {
                log("row")
                return true;
            }
        }
        return false;
    }

    function checkColsForWin() {
        for (let col = 0; col < 3; col++) {
            let arr = new Array(3);
            for (let row = 0; row < 3; row++) {
                arr[row] = Gameboard.getField(row, col);
            }
            if (allSame(arr) && (arr[0] !== undefined)) {
                log("col")
                return true;
            }
        }
        return false;
    }

    function checkDiagsForWin() {
        let arr1 = new Array(3);
        let arr2 = new Array(3);
        for (let i = 0; i < 3; i++) {
            arr1[i] = Gameboard.getField(i, i); //downward diag
            arr2[i] = Gameboard.getField(2 - i, i); //upward diag
        }
        if (allSame(arr1) && (arr1[0] !== undefined)) {
            log("diag 1")
            return true;
        } else if (allSame(arr2) && (arr2[0] !== undefined)) {
            log(arr2)
            log("diag 2")
            return true;
        }
        return false;
    }

    function displayWinner() {
        log("winner")
    }

    function displayTie() {
        log("tie")
    }

    // check if all squares are full
    function checkIf9Moves() {
        let boardElements = Gameboard.getAllBoardElements();
        //console.log(boardElements)
        if (boardElements.every(item => item.textContent !== "")) {
            log("board is full")
            return true;
        }
        return false;
    }

    // player X goes first
    const playerTurns = ["X", "O"];
    let playerTurn = 0;

    function getPlayerTurn() {
        return playerTurns[playerTurn];
    }

    return { getPlayerTurn, updateField };
})();

const PlayerFactory = function(name) {}

// helper functions

function log(item) { console.log(item) };

function allSame(arr) {
    return arr.every(item => (arr[0] === item));
}

// ------- init game ---------

// add listeners to game board squares to start
Gameboard.getAllBoardElements().forEach(el => el.addEventListener("click", Game.updateField));

Gameboard.reset(undefined);