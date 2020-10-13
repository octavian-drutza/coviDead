import { pickCell, getRandom, checkVacancy } from "./index.js";
import { columns, rows } from "./index.js";

function createVirus(cell) {
  cell.innerHTML = `<div class="virus" title="virus"><i class="fas fa-virus rotate"></i><div>`;
  cell.setAttribute("draggable", "false");
}

function placeVirusCells(virusQty) {
  for (let i = 1; i <= virusQty; i++) {
    createVirus(pickCell(getRandom(columns - 2), getRandom(rows - 2)));
  }
}

function createEmpty(cell) {
  cell.innerHTML = `<div class="empty" title="empty"><i class="fas fa-expand blob"></i></div>`;
  draggable(cell);
}

function placeEmptyCells(emptyQty) {
  for (let i = 1; i <= emptyQty; i++) {
    let cell;
    do {
      cell = pickCell(getRandom(columns - 1), getRandom(rows - 1));
    } while (!checkVacancy(cell));
    createEmpty(cell);
  }
}

function createMasked(cell) {
  cell.innerHTML = `<div class="human masked" title="masked"><i class="fas fa-head-side-mask transcend" ></i></div>`;
  draggable(cell);
}

function placeMaskedCells(maskedQty) {
  for (let i = 1; i <= maskedQty; i++) {
    let cell;
    do {
      cell = pickCell(getRandom(columns - 1), getRandom(rows - 1));
    } while (!checkVacancy(cell));
    createMasked(cell);
  }
}

function createHuman(cell) {
  cell.innerHTML = `<div class="human" title="unmasked"><i class="fas fa-head-side-cough blob"></i></div>`;
  draggable(cell);
}

function placeHumanCells(cellList) {
  cellList.forEach((cell) => {
    createHuman(cell);
  });
}

function createImune(cell) {
  if (cell.childNodes[0].title == "unmasked") {
    cell.childNodes[0].classList.add("imune");
    cell.childNodes[0].setAttribute("title", "imune");
  }
}

function draggable(cell) {
  cell.setAttribute("draggable", "true");
}

function infect(cell, percentage) {
  if (cell.childNodes[0].title == "unmasked") {
    if (Math.floor(Math.random() * 100) < percentage) {
      cell.innerHTML = `<div class="human infected" title="infected" id="0"><i class="fas fa-head-side-virus blob"></i>`;
      draggable(cell);
    }
  } else if (cell.childNodes[0].title == "imune") {
    if (Math.floor(Math.random() * 100) < percentage / 2) {
      cell.innerHTML = `<div class="human infected" title="infected" id="0"><i class="fas fa-head-side-virus blob"></i>`;
      draggable(cell);
    }
  }
}

export {
  placeEmptyCells,
  placeHumanCells,
  placeVirusCells,
  placeMaskedCells,
  createEmpty,
  createHuman,
  createMasked,
  createImune,
  infect,
};
