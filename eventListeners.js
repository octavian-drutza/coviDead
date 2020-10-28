import { getCellCoords, pickCell } from "./index.js";
import { deleteImune, immunityField, imuneImunityField } from "./spreader.js";
import {
  globalMap,
  getType,
  getIndex,
  createImune,
  createHuman,
} from "./cellCreators.js";

let initialCoords = [];
let initialEl;

export function addDragEventListeners() {
  let allCells = document.querySelectorAll(".column");
  allCells.forEach((cell) => {
    cell.addEventListener("dragstart", dragstart);
  });
  allCells.forEach((cell) => {
    cell.addEventListener("dragover", dragOver);
    cell.addEventListener("dragenter", dragEnter);
    cell.addEventListener("dragleave", dragLeave);
    cell.addEventListener("drop", dragDrop);
  });
}

function dragstart() {
  initialCoords = getCellCoords(this);
  initialEl = this;
  /* delete the imunes from the dom without rendering the map */
  if (getType(initialCoords, globalMap) == "masked") {
    globalMap.imune.forEach((imuneCoords) => {
      createHuman(pickCell(...imuneCoords));
    });
    /* delete the imunes from the map */
    deleteImune(globalMap);
  }
}

function dragEnter() {
  this.classList.add("over");
}

function dragOver(e) {
  e.preventDefault();
}

function dragLeave() {
  cleanHover(this);
}

function cleanHover(elem) {
  elem.classList.remove("over");
}

function dragDrop() {
  let thisCoords = getCellCoords(this);
  cleanHover(this);
  if (
    getType(thisCoords, globalMap) != "virus" &&
    getType(initialCoords, globalMap) != "virus" &&
    getType(thisCoords, globalMap) != "imune" &&
    getType(initialCoords, globalMap) != "imune" &&
    getType(thisCoords, globalMap) != "empty" &&
    getType(initialCoords, globalMap) != "empty"
  ) {
    /* swap the cells in the dom */
    [this.innerHTML, initialEl.innerHTML] = [
      initialEl.innerHTML,
      this.innerHTML,
    ];
    /* swap the cells on the map */
    let initialType = getType(initialCoords, globalMap);
    let thisType = getType(thisCoords, globalMap);
    [
      globalMap[initialType][getIndex(initialCoords, initialType, globalMap)],
      globalMap[thisType][getIndex(thisCoords, thisType, globalMap)],
    ] = [
      globalMap[thisType][getIndex(thisCoords, thisType, globalMap)],
      globalMap[initialType][getIndex(initialCoords, initialType, globalMap)],
    ];
  }
  console.log(globalMap);
  /* reserve the imune coordinates on the map  */
  imuneImunityField(immunityField(globalMap), globalMap);
  /* create imunes directly in the dom without rerendering the map */
  globalMap.imune.forEach((imuneCoords) => {
    createImune(pickCell(...imuneCoords));
  });
}
