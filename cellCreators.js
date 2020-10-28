import { pickCell, getRandom, getAllCoords } from "./index.js";
import { columns, rows } from "./index.js";

/* the global map holds real-time coordinates of every element */
let globalMap = {
  virus: [],
  empty: [],
  humans: [],
  infected: [],
  masked: [],
  occupied: [],
  imune: [],
};

/* render the map into the dom */
function renderMap(map) {
  map.virus.forEach((coords) => {
    createVirus(pickCell(...coords));
  });
  map.empty.forEach((coords) => {
    createEmpty(pickCell(...coords));
  });
  map.humans.forEach((coords) => {
    createHuman(pickCell(...coords));
  });
  map.infected.forEach((coords) => {
    createInfected(pickCell(...coords));
  });
  map.masked.forEach((coords) => {
    createMasked(pickCell(...coords));
  });
  map.imune.forEach((coords) => {
    createImune(pickCell(...coords));
  });
}

/* check the type of the cell useing coordinates passed as argument */
function getType(coords, map) {
  let type;
  for (const prop in map) {
    if (prop != "occupied") {
      map[prop].forEach((coordsMap) => {
        if (coords[0] == coordsMap[0] && coords[1] == coordsMap[1]) {
          type = prop;
        }
      });
    }
  }
  return type;
}

/* get the index of the coordinates */
function getIndex(coords, type, map) {
  let index;
  map[type].forEach((elem, i) => {
    if (elem[0] == coords[0] && elem[1] == coords[1]) {
      index = i;
    }
  });
  return index;
}

/* check if specific cell is empty */
function checkCoords(coords, map) {
  let vacant = true;
  map.occupied.forEach((array) => {
    if (coords[0] == array[0] && coords[1] == array[1]) {
      vacant = false;
    }
  });
  return vacant;
}

/* reserve the virus coordinates on the map */
function reserveVirusCells(virusQty, map) {
  for (let i = 1; i <= virusQty; i++) {
    let coords = [getRandom(columns - 2), getRandom(rows - 2)];
    createVirusStrict(coords, map);
  }
}

/* push the virus coordinates into the map */
function createVirusStrict(coords, map) {
  map.virus.push(coords);
  map.occupied.push(coords);
}

/* render the virus cells into the dom */
function createVirus(cell) {
  cell.innerHTML = `<div class="virus" title="virus"><i class="fas fa-virus rotate"></i><div>`;
  cell.setAttribute("draggable", "false");
}

/* reserve the empty cells coordinates on the map */
/* function reserveEmptyCells(emptyCoords, map) {
  emptyCoords.forEach((coords) => {
    createEmptyStrict(coords, map);
  });
}
 */
/* push the empty cells coordinates into the map */
function createEmptyStrict(coords, map) {
  map.empty.push(coords);
  map.occupied.push(coords);
}

/* render the empty cells into the dom */
function createEmpty(cell) {
  cell.innerHTML = `<div class="empty" title="empty"><i class="fas fa-expand blob"></i></div>`;
  cell.setAttribute("draggable", "false");
}

/* push the masked cells coordinates into the map */
function createMaskedStrict(coords, map) {
  map.masked.push(coords);
  map.occupied.push(coords);
}

/* render the masked cells in the dom */
function createMasked(cell) {
  cell.innerHTML = `<div class="human masked" title="masked"><i class="fas fa-head-side-mask transcend" ></i></div>`;
  draggable(cell);
}

/* reserve the masked coordinates on the map */
function reserveMaskedCells(maskedQty, map) {
  for (let i = 1; i <= maskedQty; i++) {
    let coords;
    do {
      coords = [getRandom(columns - 1), getRandom(rows - 1)];
    } while (!checkCoords(coords, map));
    createMaskedStrict(coords, map);
  }
}

/* push the humans coordinates into the map */
function createHumanStrict(coords, map) {
  map.humans.push(coords);
  map.occupied.push(coords);
}

/*  render the human cells in the dom */
function createHuman(cell) {
  cell.innerHTML = `<div class="human" title="unmasked"><i class="fas fa-head-side-cough blob"></i></div>`;
  draggable(cell);
}

/* reserve the human cells on the map */
function reserveHumanCells(map) {
  getAllCoords().forEach((coords) => {
    if (checkCoords(coords, map)) {
      createHumanStrict(coords, map);
    }
  });
}

/* add the draggable attribute to the cell */
function draggable(cell) {
  cell.setAttribute("draggable", "true");
}

/* push infected coordinates into the map */
function createInfectedStrict(coords, map) {
  map.infected.push(coords);
}

/*  render the infected cells in the dom */
function createInfected(cell) {
  cell.innerHTML = `<div class="human infected" title="infected" id="0"><i class="fas fa-head-side-virus blob"></i>`;
  draggable(cell);
}

/* transform human(imune) coordinates to infected on the map */
function infect(percentage, coords, map) {
  if (getType(coords, map) == "humans") {
    if (Math.floor(Math.random() * 100) < percentage) {
      createInfectedStrict(coords, map);
      map.humans.forEach((humansCoords, index) => {
        if (coords[0] == humansCoords[0] && coords[1] == humansCoords[1]) {
          map.humans.splice(index, 1);
        }
      });
    }
  } else if (getType(coords, map) == "imune") {
    if (Math.floor(Math.random() * 100) < percentage / 2) {
      map.imune.forEach((imuneCoords, index) => {
        if (coords[0] == imuneCoords[0] && coords[1] == imuneCoords[1]) {
          map.imune.splice(index, 1);
        }
      });
    }
  }
}

/* push imune coordinates into the map */
function createImuneStrict(coords, map) {
  map.imune.push(coords);
}

/* render the imune cell into the dom */
function createImune(cell) {
  cell.childNodes[0].classList.add("imune");
  cell.childNodes[0].setAttribute("title", "imune");
}

/* transform human(imune) coordinates to imune on the map */
function imune(coords, map) {
  if (getType(coords, map) == "humans") {
    createImuneStrict(coords, map);
    map.humans.forEach((humansCoords, index) => {
      if (coords[0] == humansCoords[0] && coords[1] == humansCoords[1]) {
        map.humans.splice(index, 1);
      }
    });
  }
}

/* ----------------------------------------- */

export {
  reserveHumanCells,
  reserveVirusCells,
  reserveMaskedCells,
  createHumanStrict,
  createMaskedStrict,
  createEmptyStrict,
  createImune,
  createHuman,
  infect,
  imune,
  renderMap,
  getType,
  getIndex,
};

export { globalMap };
