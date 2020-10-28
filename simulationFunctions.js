/* cloned and tuned functions to be used for the worker calculations */
let columns = 12,
  rows = 12;

function getAllCoords() {
  let allCoords = [];
  for (let i = 1; i <= columns; i++) {
    for (let n = 1; n <= rows; n++) {
      allCoords.push([i, n]);
    }
  }
  return allCoords;
}

function getRandom(nr) {
  return Math.floor(Math.random() * nr) + 1;
}

function getType(coords, map) {
  let type;
  for (const prop in map) {
    if (prop != "occupied" && prop != "infectedAfter" && prop != "result") {
      map[prop].forEach((coordsMap) => {
        if (coords[0] == coordsMap[0] && coords[1] == coordsMap[1]) {
          type = prop;
        }
      });
    }
  }
  return type;
}

function checkCoords(coords, map) {
  let vacant = true;
  map.occupied.forEach((array) => {
    if (coords[0] == array[0] && coords[1] == array[1]) {
      vacant = false;
    }
  });
  return vacant;
}

/* push the empty cells coordinates into the map */
function createEmptyStrict(coords, map) {
  map.empty.push(coords);
  map.occupied.push(coords);
}

/* reserve the empty cells coordinates on the map */
function reserveEmptyCells(emptyCoords, map) {
  emptyCoords.forEach((coords) => {
    createEmptyStrict(coords, map);
  });
}

/* push the masked cells coordinates into the map */
function createMaskedStrict(coords, map) {
  map.masked.push(coords);
  map.occupied.push(coords);
}

/* push the humans coordinates into the map */
function createHumanStrict(coords, map) {
  map.humans.push(coords);
  map.occupied.push(coords);
}

/* reserve the human cells on the map */
function reserveHumanCells(map) {
  getAllCoords().forEach((coords) => {
    if (checkCoords(coords, map)) {
      createHumanStrict(coords, map);
    }
  });
}

/* push infected coordinates into the map */

function createInfectedStrictBefore(coords, map) {
  map.infected.push(coords);
}

function createInfectedStrict(coords, map) {
  map.infectedAfter.push(coords);
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

/* transfrom any coordinates to infected on the map */
/* function infectAll(percentage, coords, map) {
  if (getType(coords, map) != "infected" && getType(coords, map) != "empty") {
    if (Math.floor(Math.random() * 100) < percentage) {
      createInfectedStrict(coords, map);
      let type = getType(coords, map);
      map[type].forEach((typeCoords, index) => {
        if (coords[0] == typeCoords[0] && coords[1] == typeCoords[1]) {
          map[type].splice(index, 1);
        }
      });
    }
  }
} */

function infectedSpreadField(map) {
  let field = [];
  map.infected
    .reduce((acc, cl) => {
      acc.push(
        [cl[0], cl[1] + 1],
        [cl[0], cl[1] - 1],
        [cl[0] + 1, cl[1]],
        [cl[0] - 1, cl[1]]
      );
      return acc;
    }, [])
    .forEach((el) => {
      el[0] == 0 ? (el[0] = 12) : el[0];
      el[1] == 0 ? (el[1] = 12) : el[1];
      el[0] == 13 ? (el[0] = 1) : el[0];
      el[1] == 13 ? (el[1] = 1) : el[1];
      field.push(el);
    });
  return eliminateDuplicates(field);
}

/* infect the spread field of an infected human */
function infectInfectedSpreadField(field, perc, map) {
  field.forEach((coords) => {
    infect(perc, coords, map);
  });
}

/* infect the spread field of an infected human ALL */
/* function infectInfectedSpreadFieldAll(field, perc, map) {
  field.forEach((coords) => {
    infectAll(perc, coords, map);
  });
} */

function immunityField(map) {
  let imune = [];
  let masked = "masked";
  map.masked.forEach((cl) => {
    if (cl[0] > 2 && cl[0] < 11) {
      if (getType([cl[0] + 2, cl[1]], map) == masked) {
        imune.push([cl[0] + 1, cl[1]]);
      } else if (getType([cl[0] - 2, cl[1]], map) == masked) {
        imune.push([cl[0] - 1, cl[1]]);
      }
    } else if (cl[0] <= 2) {
      if (getType([cl[0] + 2, cl[1]], map) == masked) {
        imune.push([cl[0] + 1, cl[1]]);
      }
    } else if (cl[0] >= 11) {
      if (getType([cl[0] - 2, cl[1]], map) == masked) {
        imune.push([cl[0] - 1, cl[1]]);
      }
    }
    if (cl[1] > 2 && cl[1] < 11) {
      if (getType([cl[0], cl[1] + 2], map) == masked) {
        imune.push([cl[0], cl[1] + 1]);
      } else if (getType([cl[0], cl[1] - 2]) == masked) {
        imune.push([cl[0], cl[1] - 1]);
      }
    } else if (cl[1] <= 2) {
      if (getType([cl[0], cl[1] + 2], map) == masked) {
        imune.push([cl[0], cl[1] + 1]);
      }
    } else if (cl[1 >= 11]) {
      if (getType([cl[0], cl[1] - 2], map) == masked) {
        imune.push([cl[0], cl[1] - 1]);
      }
    }
  });

  return eliminateDuplicates(imune);
}

/* imune the imunity field of a masked human*/
function imuneImunityField(field, map) {
  field.forEach((coords) => {
    imune(coords, map);
  });
}

/* push imune coordinates into the map */
function createImuneStrict(coords, map) {
  map.imune.push(coords);
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

function deleteImune(map) {
  map.imune.forEach((imuneCoords) => {
    createHumanStrict(imuneCoords, map);
  });
  map.imune = [];
  map.occupied = eliminateDuplicates(map.occupied);
}

function eliminateDuplicates(arrayToFilter) {
  return arrayToFilter.filter((value, index, array) => {
    return (
      array.findIndex(
        (value2) => value[0] == value2[0] && value[1] == value2[1]
      ) == index
    );
  });
}

/* ----------------------------------------- */
