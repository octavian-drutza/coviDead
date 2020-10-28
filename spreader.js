import {
  infect,
  imune,
  globalMap,
  createHumanStrict,
  createMaskedStrict,
  createEmptyStrict,
  renderMap,
  getType,
} from "./cellCreators.js";
import { addDragEventListeners } from "./eventListeners.js";
import { automationStart, automationStop } from "./simulation.js";

let turnBtn = document.getElementById("next-turn");
let turnsDisplay = document.querySelector(".turns");
let healthyDisplay = document.querySelector(".healthy-info");
let infectedDisplay = document.querySelector(".infected-info");
let emptyDisplay = document.querySelector(".empty-info");
let maskedDisplay = document.querySelector(".masked-info");
let deadDisplay = document.querySelector(".dead-info");
let message = document.querySelector(".central-message");

let turns = 0;
let died = 0;
let gameOn = true;
const killRythm = 5;
const killPerc = 20;
const maskRythm = 3;
const virusInfectChance = 50;
const humanInfectChance = 25;

startBTN();

function startBTN() {
  turns == 0
    ? (turnBtn.innerText = "START")
    : (turnBtn.innerText = "NEXT TURN");
}

function nextTurn() {
  turnBtn.addEventListener("click", () => {
    if (checkGameStatus(globalMap)) {
      turns++;
      if (turns > 1) {
        infectInfectedSpreadField(
          infectedSpreadField(globalMap),
          humanInfectChance,
          globalMap
        );
      } else {
        infectVirusSpreadField(
          virusSpreadField(globalMap),
          virusInfectChance,
          globalMap
        );
        deleteVirus(globalMap);
      }
      automationStop();
      automationStart();
      startBTN();
      addDragEventListeners();
      addMasked(maskRythm, globalMap);
      killInfected(killRythm, killPerc, globalMap);
      renderMap(globalMap);
      count(globalMap);
      checkGameStatus(globalMap);

      /*       console.log("next turn:", globalMap); */
    }
  });
}

/* calculate the spread field of virus */
function virusSpreadField(map) {
  return map.virus.reduce((acc, cl) => {
    acc.push(
      [cl[0], cl[1] + 1],
      [cl[0], cl[1] - 1],
      [cl[0] + 1, cl[1]],
      [cl[0] - 1, cl[1]],
      [cl[0] + 1, cl[1] + 1],
      [cl[0] - 1, cl[1] + 1],
      [cl[0] + 1, cl[1] - 1],
      [cl[0] - 1, cl[1] - 1]
    );
    return acc;
  }, []);
}

/* infect the virus spread field */
function infectVirusSpreadField(field, perc, map) {
  field.forEach((coords) => {
    infect(perc, coords, map);
  });
}

/* calculate the spread field of an infected human */
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

/* calculate the imunity field of a masked human */
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

/* delete the virus coordinates from the map after first turn, add human coordinates to the map instead */
function deleteVirus(map) {
  map.virus.forEach((virusCoords) => {
    createHumanStrict(virusCoords, map);
  });
  map.virus = [];
  map.occupied = eliminateDuplicates(map.occupied);
}

/* delete the imune human coordinates from the map (used in the drag and drop events), add human coordinates to the map instead */
function deleteImune(map) {
  map.imune.forEach((imuneCoords) => {
    createHumanStrict(imuneCoords, map);
  });
  map.imune = [];
  map.occupied = eliminateDuplicates(map.occupied);
}

/* delete infected coordinates, add empty coordinates to the map instead */
function killInfected(deathturns, percentage, map) {
  died = 0;
  map.infected.reverse().forEach((infected, index) => {
    if (turns % deathturns === 0) {
      if (Math.floor(Math.random() * 100) < percentage) {
        createEmptyStrict(infected, map);
        map.infected.splice(index, 1);
        died++;
      }
    }
  });
  deadDisplay.innerText = died;
}

/* add masked coordinates to the map, delete the human coordinates */
function addMasked(maskturns, map) {
  if (turns % maskturns === 0 && map.humans.length > 0) {
    createMaskedStrict(map.humans[0], map);
    map.humans.splice(0, 1);
  }
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

function checkGameStatus(map) {
  if (map.humans.length == 0) {
    gameOn = false;
    message.style.display = "inline";
    message.innerText = `Game Over, You managed to save ${map.masked.length} humans!`;
  } else if (turns > 1 && checkSpreadFieldBlock(map).length == 0) {
    gameOn = false;
    message.style.display = "inline";
    message.innerText = `You managed to stop the spreading and saved ${
      map.masked.length + map.humans.length
    } humans!`;
  }
  return gameOn;
}

function count(map) {
  turnsDisplay.innerText = turns;
  healthyDisplay.innerText = map.humans.length;
  infectedDisplay.innerText = map.infected.length;
  emptyDisplay.innerText = map.empty.length;
  maskedDisplay.innerText = map.masked.length;
}

/* check if the virus spread field is blocked */
function checkSpreadFieldBlock(map) {
  return infectedSpreadField(map).reduce((acc, coords) => {
    if (getType(coords, map) == "humans") {
      acc.push(coords);
    }
    return acc;
  }, []);
}

export {
  nextTurn,
  deleteImune,
  imuneImunityField,
  immunityField,
  infectInfectedSpreadField,
  infectedSpreadField,
};
export { turns, gameOn };
