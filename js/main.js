'use strict'

//Global Elements
const MINE = '💣'
const FLAG = '🚩'
const WHITE= '🔺';
const EMPTY = ' '; //TODO: change EMPTY to ' ' use 🟣 for tests
const EMPTYAF = ' '; //TODO same as above // EMPTY AFTER CLICKED
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
var gTimer; // general first click time
var gTimerFlag=false;
var gIntervalGameTimer =0;
var gFirstClicked=false;
var gIsGameOver=false;
var gIsHint= false;
var gMines = [];
var gMinesForHint = [];
const gLevels = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 12 }, { SIZE: 12, MINES: 30 }];
var gGame={};
var gScore;



function init(level){
    var elMsg = document.querySelector('#msg');
    elMsg.innerText = '';
    var elLife = document.querySelector('#lives');
    elLife.innerText = '💚💚💚';
    var elHint = document.querySelector('#hints');
    elHint.innerText = '💡💡💡';
    gGame={
        isOn: true,
        shownCount:0,
        markedCount:0,
        secsPassed: 0,
        life: 3,
        hints:3
    }
    gIsHint = false;
    gScore=0;
    initGame(level);
}
//This is called when page loads
function initGame(level) {
    if(parseInt(gGame.life)>0){
        var elSmile = document.querySelector('#smile');
        elSmile.innerText = NORMAL;
        var elMsg = document.querySelector('#msg');
        elMsg.innerText =''; 
        gIsGameOver=false;
        stopTimer();
        var elTime = document.querySelector('#time');
        elTime.innerText = 0;
        gFirstClicked=false;
        gIntervalGameTimer =0;
        gTimerFlag = true;
        gLevel = gLevels[level];
        gBoard = buildBoard();
        gMines = generateMinesArray();//TODO a1
        gMinesForHint = mineCopy(gMines); // TODO a1
        setMinesNegsCount(gBoard); //TODO a1
        renderBoard(gBoard);
    }else if(gGame.life===0){
        var elTime = document.querySelector('#msg');
        elTime.innerText = 'You got no life left in the game.\nHow about a new game?\nYou can press the new game button at the bottom.';
    }
}

function buildCell(minesAroundCount,isShown,isMine,isMarked,cellElement){
    var tempCell = {
        minesAroundCount: minesAroundCount,
        isShown: isShown,
        isMine: isMine,
        isMarked: isMarked,
        cellElement: cellElement
    }
    return tempCell;
}

//Builds the board Set mines at random locations Call setMinesNegsCount() 
//Return the created board
function buildBoard() {
    var SIZE = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var tempCell = buildCell(0,false,false,false,false,EMPTY);
            board[i][j] = tempCell;
        }
    }
    return board;
}

//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    var tempCell;
    var len = board.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            var t = countMinesAround(board, i, j);
            var tempCell = buildCell(t,board[i][j].isShown,board[i][j].isMine,board[i][j].isMarked,board[i][j].cellElement);
            board[i][j] = tempCell;
        }
    }
}

//function to make setMinesNegsCount(board) more useful and good looking
function countMinesAround(board, i, j) {
    console.log('you are here')
    var ans = 0;
    if ((i - 1) >= 0 && (j - 1) >= 0 && (i - 1) < board.length && (j - 1) < board.length && board[i - 1][j - 1].isMine===true) ans++;
    if ((i - 1) >= 0 && (j) >= 0 && (i - 1) < board.length && (j) < board.length && board[i - 1][j].isMine===true) ans++;
    if ((i - 1) >= 0 && (j + 1) >= 0 && (i - 1) < board.length && (j + 1) < board.length && board[i - 1][j + 1].isMine===true) ans++;
    if (i >= 0 && (j - 1) >= 0 && (i) < board.length && (j - 1) < board.length && board[i][j - 1].isMine===true) ans++;
    if ((i ) >= 0 && (j + 1) >= 0 && (i ) < board.length && (j + 1) < board.length && board[i][j + 1].isMine===true) ans++;
    if ((i + 1) >= 0 && (j - 1) >= 0 && (i + 1) < board.length && (j - 1) < board.length && board[i + 1][j - 1].isMine===true) ans++;
    if ((i + 1) >= 0 && (j) >= 0 && (i + 1) < board.length && (j) < board.length && board[i + 1][j].isMine===true) ans++;
    if ((i + 1) >= 0 && (j + 1) >= 0 && (i + 1) < board.length && (j + 1) < board.length && board[i + 1][j + 1].isMine===true) ans++;
    console.log(ans);
    return ans;
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
            cellElement: EMPTY
        }
        var toPush = { location: tempLocation, cell: tempCell };
        gBoard[tempLocation.i][tempLocation.j] = tempCell;
        temp.push(toPush);
    }
    return temp;
}

//Render the board as a <table> to the page
//# use the function printMat from utils.js
function renderBoard(board) {
    printMat(board, '.board');
}

//Called when a cell (td) is clicked !left click!
function cellClicked(elCell, i, j) {
    if  (i<0 || i>=gLevel.SIZE || j < 0 || j >= gLevel.SIZE || gIsGameOver===true) { return; }
    else if(gIsHint && gGame.hints>=0){
        handleHint(elCell,gBoard, i, j);
        gIsHint = false;
    } 
    else if(!gFirstClicked){
            console.log('clicked first time')
            gTimer = new Date();
            gFirstClicked=true;
            gGame.shownCount++;
            elCell.classList.add('clicked');
            gBoard[i][j] = buildCell(0,true,false,false,EMPTYAF); 
            render(elCell, gBoard, i, j);
            startTimer();
            if(checkIfWon()){
                gameWon();
            }
    }
    else {
            console.log('clicked')
            gGame.shownCount++;
            elCell.classList.add('clicked');
            gBoard[i][j] = buildCell(gBoard[i][j].minesAroundCount,true,gBoard[i][j].isMine,gBoard[i][j].isShown,gBoard[i][j].cellElement); 
            render(elCell, gBoard, i, j);
            expandShown(gBoard,i,j);
            console.log('~ gBoard after clicks', gBoard);
            if(checkIfWon()){
                gameWon();
        }
    }
}

//revile the hidden cells at the end of any section  
//TODO: finish 
function revileBoard(gBoard) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if(!(gBoard[i][j].isShown)){
                var elTempCell = document.querySelector(`.cell${i}-${j}`);
                // renderCell({i:i,j:j},gBoard[i][j].cellElement);
                render(elTempCell,gBoard,i,j);
            }
        }
    }
}

//rendering stupid cells
//*working
function render(elCell, board, i, j) {
    if(board[i][j].isMine && gGame.life<=0){
        board[i][j].cellElement=MINE;
        renderCell({ i, j }, MINE); 
        gameOver(); //TODO remmner
    }else if(board[i][j].isMine){
        board[i][j].cellElement=MINE;
        renderCell({ i, j }, MINE);  
        lifeLost(elCell, i, j);
        elCell.classList.add('marked');
        gBoard[i][j] = buildCell(gBoard[i][j].minesAroundCount,gBoard[i][j].isShown,gBoard[i][j].isMine,true,FLAG);
        elCell.classList.add('li');
        renderCell({ i, j }, WHITE);
    }else{
        var na = board[i][j].minesAroundCount;
        switch (na) {
            case 0:
                elCell.classList.add('blank');
                board[i][j].cellElement=EMPTYAF;
                renderCell({ i, j }, EMPTYAF);
                break;
            case 1:
                elCell.classList.add('num1');
                board[i][j].cellElement=ONE;
                renderCell({ i, j }, ONE);
                break;
            case 2:
                elCell.classList.add('num2');
                board[i][j].cellElement=TWO;
                renderCell({ i, j }, TWO);
                break;
            case 3:
                elCell.classList.add('num3');
                board[i][j].cellElement=THREE;
                renderCell({ i, j }, THREE);
                break;

            }
        }
    
}


//Called on !right click! to mark a cell (suspected to be a mine) 
//Search the web (and implement) how to hide the context menu on right click
//?how to unable the contexmenu?  => did it in index.html inside body 
function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isMarked===true) {
        unMark(elCell, i, j);
    } else if(gBoard[i][j].cellElement!==MINE) {
        mark(elCell, i, j);
    }else{
        return;
    }
    if(checkIfWon()){
        gameWon();
    }
}
//unmark the cell
function unMark(elCell, i, j) {
    elCell.classList.remove('marked');
    gBoard[i][j] = buildCell(gBoard[i][j].minesAroundCount,gBoard[i][j].isShown,gBoard[i][j].isMine,false,EMPTY);
    renderCell({ i, j }, EMPTY);
}
//mark the cell
function mark(elCell, i, j) {
    elCell.classList.add('marked');
    gBoard[i][j] = buildCell(gBoard[i][j].minesAroundCount,gBoard[i][j].isShown,gBoard[i][j].isMine,true,FLAG);
    renderCell({ i, j }, FLAG);
}

//*--------------------------------------------win/lost handler---------------------------
function gameWon() {
    gTimerFlag=false;
    var elSmile = document.querySelector('#smile');
    elSmile.innerText = WIN;
    var elButton = document.querySelector('#go');
    elButton.innerText='new game?';
    gScore+=10;
    var elScore = document.querySelector('#score');
    elScore.innerText = parseInt(gScore);
}

function gameOver() {
    gIsGameOver=true;
    gTimerFlag=false;
    var elSmile = document.querySelector('#smile');
    elSmile.innerText = LOSE;
    var elButton = document.querySelector('#go');
    elButton.innerText='new game?';
    var elMsg = document.querySelector('#msg');
    elMsg.innerText ='Game Lost :( lets play another one'; 
    // revileBoard(gBoard); //TODO: finish revile
}

//Game ends when all mines are marked, and all the other cells are shown
function checkIfWon(){
    var flag = true;
    for (var i = 0; i < gMines.length && flag; i++) {
        if((!gBoard[gMines[i].location.i][gMines[i].location.j].isMarked)){
            flag = false;
        }
    }
    return flag;
}
//sync the new lives count to the dom
function lifeLost(){
    gGame.life--;
    var lifeRemain = gGame.life;
    var elLife = document.querySelector('#lives');
    switch(lifeRemain) {
        case 2:
            elLife.innerText='💚💚';
            break;
        case 1:
            elLife.innerText='💚';
            break;
        case 0:
            elLife.innerText='GG';
            break;        
    }
}

/*
When user clicks a cell with no mines around, we need to open not only
that cell, but also its neighbors. NOTE: start with a basic implementation
that only opens the non-mine 1st degree neighbors 
BONUS: if you have the time later, try to work more like the real algorithm
*/
function expandShown(board, i, j) {
    if (((i - 1) >= 0) && ((j - 1) >= 0) && ((i - 1) < board.length) && ((j - 1) < board.length) && !(board[i - 1][j - 1].isMine) && !(board[i - 1][j - 1].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i-1}-${j-1}`);
        render(elTempCell, board,i-1,j-1);
    }if (((i - 1) >= 0) && ((j) >= 0) && ((i - 1) < board.length) && ((j) < board.length) && !(board[i - 1][j].isMine) && !(board[i - 1][j].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i-1}-${j}`);
        render(elTempCell, board,i-1,j);
    }if (((i - 1) >= 0) && ((j + 1) >= 0) && ((i - 1) < board.length) && ((j + 1) < board.length) && !(board[i - 1][j + 1].isMine) && !(board[i - 1][j + 1].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i-1}-${j+1}`);
        render(elTempCell, board,i-1,j+1);
    }if (((i) >= 0) && ((j - 1) >= 0) && ((i) < board.length) && ((j - 1) < board.length) && !(board[i][j - 1].isMine) && !(board[i][j - 1].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i}-${j-1}`);
        render(elTempCell, board,i,j-1);
    }if (((i) >= 0) && ((j + 1) >= 0) && ((i) < board.length) && ((j + 1) < board.length) && !(board[i][j + 1].isMine) && !(board[i][j + 1].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i}-${j+1}`);
        render(elTempCell, board,i,j+1);
    }if (((i + 1) >= 0) && ((j - 1) >= 0) && ((i + 1) < board.length) && ((j - 1) < board.length) && !(board[i + 1][j - 1].isMine) && !(board[i + 1][j - 1].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i+1}-${j-1}`);
        render(elTempCell, board,i+1,j-1);
    }if (((i + 1) >= 0) && ((j) >= 0) && ((i + 1) < board.length) && ((j) < board.length) && !(board[i + 1][j].isMine) && !(board[i + 1][j].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i+1}-${j}`);
        render(elTempCell, board,i+1,j);
    }if (((i + 1) >= 0) && ((j + 1) >= 0) && ((i + 1) < board.length) && ((j + 1) < board.length) && !(board[i + 1][j + 1].isMine) && !(board[i + 1][j + 1].isMarked)) {
        var elTempCell = document.querySelector(`.cell${i+1}-${j+1}`);
        render(elTempCell, board,i+1,j+1);
    }
}

//*----------------------------------------time handler section--------------------------
//initiate timer on first click
function startTimer(){
 if(gTimerFlag){
    var date = new Date();
    var gameSecs = parseInt((gTimer-date.getTime())/1000); // secs that pased since initGame
    gGame.secsPassed = gameSecs;
    var secsF = (gameSecs.toFixed(0))*(-1);
    console.log('~ secsF', secsF)
    var elTime = document.querySelector('#time');
    elTime.innerText = secsF;
    gIntervalGameTimer = setTimeout(startTimer,1000);
 }
}
function stopTimer(){
    clearInterval(gIntervalGameTimer);
}
function resetTimer(){
    clearInterval(gIntervalGameTimer);
    var elTime = document.querySelector('#time');
    elTime.innerText = parseInt(0);
}


//*--------------------------------------------Section Hints--------------------------------------------
function hints(){
    gIsHint=true;
    console.log('hint pressed');
    gGame.hints--;
    var hintRemain = parseInt(gGame.hints);
    console.log('~ hintRemain', hintRemain)
    var elHint = document.querySelector('#hints');
    if(hintRemain>=0){
        switch(hintRemain) {
            case 2:
                elHint.innerText='💡💡';
                break;
            case 1:
                elHint.innerText='💡';
                break; 
            case 0:
                elHint.innerText='GG';
                break;       
        }
    }else{
        elHint.innerText='🤐';
    }
}
//do work on nabors
function handleHint(elCell,board, i, j){
    var arr = [];
    if ((i - 1) >= 0 && (j - 1) >= 0 && (i - 1) < board.length && (j - 1) < board.length) arr.push({i:i-1,j:j-1});
    if ((i - 1) >= 0 && (j) >= 0 && (i - 1) < board.length && (j) < board.length) arr.push({i:i-1,j:j});
    if ((i - 1) >= 0 && (j + 1) >= 0 && (i - 1) < board.length && (j + 1) < board.length) arr.push({i:i-1,j:j+1});
    if (i >= 0 && (j - 1) >= 0 && (i) < board.length && (j - 1) < board.length) arr.push({i:i,j:j-1});
    if ((i) >= 0 && (j + 1) >= 0 && (i) < board.length && (j + 1) < board.length) arr.push({i:i,j:j+1});
    if ((i + 1) >= 0 && (j - 1) >= 0 && (i + 1) < board.length && (j - 1) < board.length) arr.push({i:i+1,j:j-1});
    if ((i + 1) >= 0 && (j) >= 0 && (i + 1) < board.length && (j) < board.length) arr.push({i:i+1,j:j});
    if ((i + 1) >= 0 && (j + 1) >= 0 && (i + 1) < board.length && (j + 1) < board.length) arr.push({i:i+1,j:j+1});
    console.log(arr)
    for(var i=0; i<arr.length; i++){
        var elCell = document.querySelector(`.cell${arr[i].i}-${arr[i].j}`);
        elCell.style.backgroundColor = '#ffeb3b';
        render(elCell,board,arr[i].i,arr[i].j)
        setTimeout(unRender,1000,elCell);
    }
}

function unRender(elCell){
    elCell.classList.remove('blank');
    elCell.classList.remove('num1');
    elCell.classList.remove('num2');
    elCell.classList.remove('num3');
    elCell.classList.add('hid');
    elCell.style.backgroundColor = '#ffdab9'; 
}


//*-----------------------------------------end of my code-------------------------------------
//?my function dosent relate to the pdf :)
// function hintsHandler(elHint) {
//     if(gGame.hints>0 && !(isEmpty(gMinesForHint))){
//         console.log('hint pressed');
//         gGame.hints--;
//         var hintRemain = parseInt(gGame.hints);
//         console.log('~ hintRemain', hintRemain)
//         var elHint = document.querySelector('#hints');
//         switch(hintRemain) {
//             case 2:
//                 elHint.innerText='💡💡';
//                 break;
//             case 1:
//                 elHint.innerText='💡';
//                 break; 
//             case 0:
//                 elHint.innerText='GG';
//                 break;       
//         }
//         var temp = gMinesForHint.pop();
//         var location = temp.location;
//         var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
//         elCell.style.backgroundColor = '#ffeb3b';
//         setTimeout(hinted,1000,elCell);
//     }else{
//         var elHint = document.querySelector('#hints');
//         elHint.innerText='🤐';
//     }
// }

// function hinted(elCell){
//     elCell.style.backgroundColor = '#ffdab9';
// }





