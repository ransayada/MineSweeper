'use strict'
/*

Each cell: { minesAroundCount: 4, isShown: true, isMine: false, isMarked: true }
gLevel = { SIZE: 4, MINES: 2 };











*/
//Global Elements
const MINE = '💣'
const FLAG = '🚩'
const EMPTY = '🟣'; //TODO: change EMPTY to ' ' use 🟣 for tests
const EMPTYAF = '🔴'; //TODO same as above // EMPTY AFTER CLICKED
const ONE = '1';
const TWO = '2';
const THREE = '3';

const NORMAL = '😃';
const LOSE ='🤯'; 
const WIN='😎';

//Global Variables:
var gBoard; // The Model
var gLevel; //This is an object by which the board size is set (in this case: 4x4 board and how many mines to put)
var gGame; //This is an object in which you can keep and update the current game state: isOn: Boolean, when true we let the user play shownCount: How many cells are shown markedCount: How many cells are marked (with a flag)
//secsPassed: How many seconds passed
var gClickedCell = null;
var gMarkedCell = null;

var gMines = [];
const gLevels = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 12 }, { SIZE: 12, MINES: 30 }];

//This is called when page loads
function initGame(level) {
    
    gLevel = gLevels[level];
    gBoard = buildBoard();
    console.log('~ gBoard', gBoard)
    gMines = generateMinesArray();
    console.log('~ gBoard', gBoard)
    setMinesNegsCount(gBoard);
    console.log('~ gBoard', gBoard)
    renderBoard(gBoard);



    var bool = checkGameOver();
    //!Testing
    

}
//Builds the board Set mines at random locations Call setMinesNegsCount() 
//Return the created board
function buildBoard() {
    var SIZE = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var tempCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                cellElement: EMPTY

            }
            board[i][j] = tempCell;
        }
    }
    return board;
}
//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    var cell;
    var counter;
    var len = board.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            counter = 0;
            cell = board[i][j];
            cell.minesAroundCount = countMinesAround(board, i, j);
        }
    }
}

//function to make setMinesNegsCount(board) more useful and good looking
function countMinesAround(board, i, j) {
    var ans = 0;
    if ((i - 1) >= 0 && (j - 1) >= 0 && (i - 1) < board.length && (j - 1) < board.length && board[i - 1][j - 1].cellElement === MINE) ans++;
    if ((i - 1) >= 0 && (j) >= 0 && (i - 1) < board.length && (j) < board.length && board[i - 1][j].cellElement === MINE) ans++;
    if ((i - 1) >= 0 && (j + 1) >= 0 && (i - 1) < board.length && (j + 1) < board.length && board[i - 1][j + 1].cellElement === MINE) ans++;
    if ((i) >= 0 && (j - 1) >= 0 && (i) < board.length && (j - 1) < board.length && board[i][j - 1].cellElement === MINE) ans++;
    if ((i - 1) >= 0 && (j + 1) >= 0 && (i - 1) < board.length && (j + 1) < board.length && board[i][j + 1].cellElement === MINE) ans++;
    if ((i + 1) >= 0 && (j - 1) >= 0 && (i + 1) < board.length && (j - 1) < board.length && board[i + 1][j - 1].cellElement === MINE) ans++;
    if ((i + 1) >= 0 && (j) >= 0 && (i + 1) < board.length && (j) < board.length && board[i + 1][j].cellElement === MINE) ans++;
    if ((i + 1) >= 0 && (j + 1) >= 0 && (i + 1) < board.length && (j + 1) < board.length && board[i + 1][j + 1].cellElement === MINE) ans++;
    return ans;

}
//Render the board as a <table> to the page
//# use the function printMat from utils.js
function renderBoard(board) {
    printMat(board, '.board');
}
//Called when a cell (td) is clicked !left click!
function cellClicked(elCell, i, j) {
    if ((elCell.isShown || elCell.isMarked) && i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) { return; }
    else {
        // gGame.shownCount++;
        elCell.classList.add('clicked');
        gClickedCell = elCell;
        gBoard[i][j].isShown = true;
        if (elCell.isMine) {
            gameOver(); // loose 1 life 
        } else {
            elCell.classList.remove("hiddenCell");
            render(elCell, gBoard, i, j);
            expandShown(gBoard, elCell, i, j);
        }
    }

}
//?what happened if the game is over ?
//TODO: finish 
function gameOver() {
    revileBoard(gBoard);
}

//revile the hidden cells at the end of any section  
//TODO: finish 
function revileBoard(gBoard) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

        }
    }
}

//rendering stupid cells
function render(elCell, board, i, j) {
    var na = board[i][j].minesAroundCount;
    switch (na) {
        case 0:
            elCell.classList.add('blank');
            renderCell({ i, j }, EMPTYAF);
            break;
        case 1:
            elCell.classList.add('num1');
            renderCell({ i, j }, ONE);
            break;
        case 2:
            elCell.classList.add('num2');
            renderCell({ i, j }, TWO);
            break;
        case 3:
            elCell.classList.add('num3');
            renderCell({ i, j }, THREE);
            break;

    }
}
//Called on !right click! to mark a cell (suspected to be a mine) 
//Search the web (and implement) how to hide the context menu on right click
//?how to unable the contexmenu?  => did it in index.html inside body 
function cellMarked(elCell, i, j) {
    if (elCell.isShown) { return; }
    else if (elCell.isMarked) {
        unmark(elCell, i, j);
    } else {
        mark(elCell, i, j);
    }

}
//unmark the cell
function unmark(elCell, i, j) {
    elCell.classList.add('unmarked');
    elCell = {
        minesAroundCount: elCell.minesAroundCount,
        isShown: elCell.isShown,
        isMine: elCell.isMine,
        isMarked: false,
        cellElement: EMPTY
    }
    gBoard[i][j] = elCell;
}
//mark the cell
function mark(elCell, i, j) {
    elCell.classList.add('marked');
    elCell = {
        minesAroundCount: elCell.minesAroundCount,
        isShown: elCell.isShown,
        isMine: elCell.isMine,
        isMarked: true,
        cellElement: FLAG
    }
    gBoard[i][j] = elCell;
    renderCell({ i, j }, FLAG);
}

//Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    var flag = true;
    for (var i = 0; i < gMines.length && flag; i++) {
        if (!gMines[i].cell.isShown) {
            flag = false;
        }
    }
    return flag;
}

//generate a locations array that going to be the Mines
function generateMinesArray() {
    var numOfMines = gLevel.MINES;
    var temp = [];
    for (var k = 0; k < numOfMines; k++) {
        var tempLocation = { i: getRandomIntInt(0, gLevel.SIZE), j: getRandomIntInt(0, gLevel.SIZE) };
        if (gBoard[tempLocation.i][tempLocation.j].cellElement === MINE) {
            var tempLocation = { i: getRandomIntInt(0, gLevel.SIZE), j: getRandomIntInt(0, gLevel.SIZE) };
        }
        var tempCell = {
            minesAroundCount: 0,
            isShown: false,
            isMine: true,
            isMarked: false,
            cellElement: MINE
        }
        var toPush = { location: tempLocation, cell: tempCell };
        gBoard[tempLocation.i][tempLocation.j] = tempCell;
        temp.push(toPush);
    }
    return temp;
}
/*
When user clicks a cell with no mines around, we need to open not only
that cell, but also its neighbors. NOTE: start with a basic implementation
that only opens the non-mine 1st degree neighbors 
BONUS: if you have the time later, try to work more like the real algorithm
(see description at the Bonuses section below)
*/
//TODO: fix
function expandShown(board, elCell, i, j) {
    if ((i - 1) >= 0 && (j - 1) >= 0 && (i - 1) < board.length && (j - 1) < board.length && board[i - 1][j - 1].cellElement === MINE && board[i - 1][j - 1] == !undefined) {
        board[i - 1][j - 1].classList.remove("hiddenCell");
        render(board[i - 1][j - 1], board, i - 1, j - 1);
    } if ((i - 1) >= 0 && (j) >= 0 && (i - 1) < board.length && (j) < board.length && board[i - 1][j].cellElement === MINE && board[i - 1][j] == !undefined) {
        board[i - 1][j].classList.remove("hiddenCell");
        render(board[i - 1][j], board, i - 1, j);
    } if ((i - 1) >= 0 && (j + 1) >= 0 && (i - 1) < board.length && (j + 1) < board.length && board[i - 1][j + 1].cellElement === MINE && board[i - 1][j + 1] == !undefined) {
        board[i - 1][j + 1].classList.remove("hiddenCell");
        render(board[i - 1][j + 1], board, i - 1, j + 1);
    } if ((i) >= 0 && (j - 1) >= 0 && (i) < board.length && (j - 1) < board.length && board[i][j - 1].cellElement === MINE && board[i][j - 1] == !undefined) {
        board[i][j - 1].classList.remove("hiddenCell");
        render(board[i][j - 1], board, i, j - 1);
    } if ((i - 1) >= 0 && (j + 1) >= 0 && (i - 1) < board.length && (j + 1) < board.length && board[i][j + 1].cellElement === MINE && board[i][j + 1] == !undefined) {
        board[i][j + 1].classList.remove("hiddenCell");
        render(board[i][j + 1], board, i, j + 1);
    } if ((i + 1) >= 0 && (j - 1) >= 0 && (i + 1) < board.length && (j - 1) < board.length && board[i + 1][j - 1].cellElement === MINE && board[i + 1][j - 1] == !undefined) {
        board[i + 1][j - 1].classList.remove("hiddenCell");
        render(board[i + 1][j - 1], board, i + 1, j - 1);
    } if ((i + 1) >= 0 && (j) >= 0 && (i + 1) < board.length && (j) < board.length && board[i + 1][j].cellElement === MINE && board[i + 1][j] == !undefined) {
        board[i + 1][j].classList.remove("hiddenCell");
        render(board[i + 1][j], board, i + 1, j);
    } if ((i + 1) >= 0 && (j + 1) >= 0 && (i + 1) < board.length && (j + 1) < board.length && board[i + 1][j + 1].cellElement === MINE && board[i + 1][j + 1] == !undefined) {
        board[i + 1][j + 1].classList.remove("hiddenCell");
        render(board[i + 1][j + 1], board, i + 1, j + 1);
    }
}

