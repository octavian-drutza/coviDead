/* set up grid*/
import {
  reserveHumanCells,
  reserveVirusCells,
  reserveMaskedCells,
  renderMap,
  globalMap,
} from "./cellCreators.js";
import { nextTurn } from "./spreader.js";
/* import { automationStart } from "./simulation.js"; */

let columns = 12,
  rows = 12,
  emptyQty = 0,
  maskedQty = 2,
  virusQty = 1,
  grid = document.getElementById("grid"),
  restartBtn = document.getElementById("restart");

init();
restart();

function init() {
  createGrid(columns, rows);
  reserveVirusCells(virusQty, globalMap);
  reserveMaskedCells(maskedQty, globalMap);
  reserveHumanCells(globalMap);
  nextTurn();
  renderMap(globalMap);
  /* automationStart(); */
}

function restart() {
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}

function createGrid(columns, rows) {
  for (let i = 1; i <= rows; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    row.id = `row-${i}`;
    grid.appendChild(row);
    for (let n = 1; n <= columns; n++) {
      let column = document.createElement("div");
      column.classList.add("column", "col-lg-1", "col-md-1", "col-sm-1");
      column.id = `column-${n}`;
      row.appendChild(column);
    }
  }
}

function pickCell(colNr, rowNr) {
  return document
    .querySelector(`#row-${rowNr}`)
    .querySelector(`#column-${colNr}`);
}

function getRandom(nr) {
  return Math.floor(Math.random() * nr) + 2;
}

function checkVacancy(cell) {
  if (cell.innerHTML == "") {
    return cell;
  }
  return false;
}

/* function getEmptyNodes() {
  return Array.from(grid.childNodes).reduce((acc, node) => {
    node.childNodes.forEach((node) => {
      if (node.innerHTML == "") {
        acc.push(node);
      }
    });
    return acc;
  }, []);
} */

/* function getNodes(title) {
  return Array.from(grid.childNodes).reduce((acc, node) => {
    node.childNodes.forEach((node) => {
      if (node.childNodes[0].title == title) {
        acc.push(node);
      }
    });
    return acc;
  }, []);
} */

/* function getAllNodes() {
  return Array.from(grid.childNodes).reduce((acc, node) => {
    node.childNodes.forEach((node) => {
      acc.push(node);
    });
    return acc;
  }, []);
} */

function getCellCoords(cell) {
  let colNr = parseInt(cell.id.substring(7, cell.id.length));
  let rowNr = parseInt(
    cell.parentElement.id.substring(4, cell.parentElement.length)
  );
  return [colNr, rowNr];
}

function getAllCoords() {
  let allCoords = [];
  for (let i = 1; i <= columns; i++) {
    for (let n = 1; n <= rows; n++) {
      allCoords.push([i, n]);
    }
  }
  return allCoords;
}

export { pickCell, getRandom, checkVacancy, getAllCoords, getCellCoords };
export { columns, rows, emptyQty, maskedQty, virusQty };
