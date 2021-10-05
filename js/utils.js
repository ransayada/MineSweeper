function printMat(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j].cellElement;
        var className = 'cell cell' + i + '-' + j;
        strHTML += `<td class="${className}" onclick = "cellClicked(this ,${i}, ${j})" oncontextmenu="cellMarked(this,${i}, ${j})"> <span id="span-cell-${i}-${j}" class="hiddenCell">${cell}</span></td>`
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }



  // location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }
  
  function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //hardCopy array
  function mineCopy(gMines){
    var mine =[];
    for(var i=0;i<gMines.length;i++){
        var tCell =  { location: gMines[i].location, cell: buildCell(gMines[i].cell.minesAroundCount,gMines[i].cell.isShown,gMines[i].cell.isMine,gMines[i].cell.isMarked,gMines[i].cell.cellElement) };
        mine.push(tCell);
    }
    return mine;
}

function isEmpty(array){
  if(array.length === 0) return true;
  else return false;
}