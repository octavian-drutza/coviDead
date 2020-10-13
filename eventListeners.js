import { getCellCoords } from "./index.js";
import { imune, deleteImune } from "./spreader.js";

let startCoords = [];
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
  startCoords = getCellCoords(this);
  initialEl = this;
  if (this.childNodes[0].title == "masked") {
    deleteImune();
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
  cleanHover(this);

  if (
    this.childNodes[0].title != "virus" &&
    initialEl.childNodes[0].title != "virus" &&
    this.childNodes[0].title != "imune" &&
    initialEl.childNodes[0].title != "imune"
  ) {
    [this.innerHTML, initialEl.innerHTML] = [
      initialEl.innerHTML,
      this.innerHTML,
    ];
  }
  imune();
}
