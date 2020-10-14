/* set up grid*/
import {
  placeEmptyCells,
  placeHumanCells,
  placeVirusCells,
  placeMaskedCells,
} from "./cellCreators.js";
import { addDragEventListeners } from "./eventListeners.js";
import { imune, nextTurn } from "./spreader.js";

let columns = 12,
  rows = 12,
  emptyQty = 0,
  maskedQty = 3,
  virusQty = 1,
  grid = document.getElementById("grid"),
  restartBtn = document.querySelector(".restart");

init();
restart();

function init() {
  createGrid(columns, rows);
  placeVirusCells(virusQty);
  placeEmptyCells(emptyQty);
  placeMaskedCells(maskedQty);
  placeHumanCells(getEmptyNodes());
  imune();
  nextTurn();
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
      column.classList.add("column", "col-lg-1", "col-md-2");
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

function getEmptyNodes() {
  return Array.from(grid.childNodes).reduce((acc, node) => {
    node.childNodes.forEach((node) => {
      if (node.innerHTML == "") {
        acc.push(node);
      }
    });
    return acc;
  }, []);
}

function getNodes(title) {
  return Array.from(grid.childNodes).reduce((acc, node) => {
    node.childNodes.forEach((node) => {
      if (node.childNodes[0].title == title) {
        acc.push(node);
      }
    });
    return acc;
  }, []);
}

function getCellCoords(cell) {
  let colNr = parseInt(cell.id.substring(7, cell.id.length));
  let rowNr = parseInt(
    cell.parentElement.id.substring(4, cell.parentElement.length)
  );
  return [colNr, rowNr];
}

export { pickCell, getRandom, checkVacancy, getCellCoords, getNodes };
export { columns, rows, emptyQty, maskedQty, virusQty };
