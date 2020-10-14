import { pickCell, getCellCoords, getNodes } from "./index.js";
import {
  infect,
  createEmpty,
  createHuman,
  createMasked,
  createImune,
} from "./cellCreators.js";

let turnBtn = document.querySelector(".next-turn");
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

startBTN();

function startBTN() {
  turns == 0
    ? (turnBtn.innerText = "Start")
    : (turnBtn.innerText = "Next Turn");
}

function nextTurn() {
  turnBtn.addEventListener("click", () => {
    startBTN();
    checkGameStatus();
    if (gameOn) {
      /*       turnBtn.innerText = "Next Turn"; */
      turns++;
      if (turns > 1) {
        infectInfectedSpreadField();
      } else {
        infectVirusSpreadField();
        deleteVirus();
      }
      count();
      addMasked(1);
      killInfected(5, 10);
    }
  });
}

function getVirusesCoords() {
  let viruses = document.querySelectorAll(".virus");
  return Array.from(viruses).reduce((acc, virus) => {
    acc.push(getCellCoords(virus.parentNode));
    return acc;
  }, []);
}

function virusSpreadField() {
  return getVirusesCoords().reduce((acc, cl) => {
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

function infectVirusSpreadField() {
  virusSpreadField().forEach((coords) => {
    infect(pickCell(...coords), 50);
  });
}

function getInfectedCoords() {
  let infected = document.querySelectorAll(".infected");
  return Array.from(infected).reduce((acc, cell) => {
    acc.push(getCellCoords(cell.parentNode));
    return acc;
  }, []);
}

function infectedSpreadField() {
  let field = [];
  getInfectedCoords()
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
      if (el[0] != 0 && el[1] != 0 && el[0] != 13 && el[1] != 13) {
        field.push(el);
      }
    });
  return eliminateDuplicates(field);
}

function infectInfectedSpreadField() {
  infectedSpreadField().forEach((coords) => {
    infect(pickCell(...coords), 50);
  });
}

function checkSpreadFieldBlock() {
  return infectedSpreadField().reduce((acc, coords) => {
    if (pickCell(...coords).childNodes[0].title == "unmasked") {
      acc.push(coords);
    }
    return acc;
  }, []);
}

function getMaskedCoordinates() {
  let masked = document.querySelectorAll(".masked");
  return Array.from(masked).reduce((acc, cell) => {
    acc.push(getCellCoords(cell.parentNode));
    return acc;
  }, []);
}

function immunityField() {
  let imune = [];
  getMaskedCoordinates().forEach((cl) => {
    if (cl[0] > 2 && cl[0] < 11) {
      if (pickCell(cl[0] + 2, cl[1]).childNodes[0].title == "masked") {
        imune.push([cl[0] + 1, cl[1]]);
      } else if (pickCell(cl[0] - 2, cl[1]).childNodes[0].title == "masked") {
        imune.push([cl[0] - 1, cl[1]]);
      }
    } else if (cl[0] <= 2) {
      if (pickCell(cl[0] + 2, cl[1]).childNodes[0].title == "masked") {
        imune.push([cl[0] + 1, cl[1]]);
      }
    } else if (cl[0] >= 11) {
      if (pickCell(cl[0] - 2, cl[1]).childNodes[0].title == "masked") {
        imune.push([cl[0] - 1, cl[1]]);
      }
    }
    if (cl[1] > 2 && cl[1] < 11) {
      if (pickCell(cl[0], cl[1] + 2).childNodes[0].title == "masked") {
        imune.push([cl[0], cl[1] + 1]);
      } else if (pickCell(cl[0], cl[1] - 2).childNodes[0].title == "masked") {
        imune.push([cl[0], cl[1] - 1]);
      }
    } else if (cl[1] <= 2) {
      if (pickCell(cl[0], cl[1] + 2).childNodes[0].title == "masked") {
        imune.push([cl[0], cl[1] + 1]);
      }
    } else if (cl[1 >= 11]) {
      if (pickCell(cl[0], cl[1] - 2).childNodes[0].title == "masked") {
        imune.push([cl[0], cl[1] - 1]);
      }
    }
  });

  return eliminateDuplicates(imune);
}

function imune() {
  immunityField().forEach((coords) => {
    createImune(pickCell(...coords));
  });
}

function count() {
  turnsDisplay.innerText = turns;
  healthyDisplay.innerText = getNodes("unmasked").length;
  infectedDisplay.innerText = getNodes("infected").length;
  emptyDisplay.innerText = getNodes("empty").length;
  maskedDisplay.innerText = getNodes("masked").length;
}

function deleteVirus() {
  getNodes("virus").forEach((virus) => {
    createHuman(virus);
  });
}

function deleteImune() {
  let imune = document.querySelectorAll(".imune");
  imune.forEach((cell) => {
    createHuman(cell.parentNode);
  });
}

function killInfected(deathturns, percentage) {
  died = 0;
  getNodes("infected")
    .reverse()
    .forEach((infected) => {
      if (turns % deathturns === 0) {
        let rand = Math.floor(Math.random() * 100);
        if (rand < percentage) {
          createEmpty(infected);
          died++;
        }
      }
    });
  deadDisplay.innerText = died;
}

function addMasked(maskturns) {
  if (turns % maskturns === 0) {
    createMasked(getNodes("unmasked")[0]);
  }
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

function checkGameStatus() {
  if (getNodes("unmasked").length == 0) {
    gameOn = false;
    message.style.display = "inline";
    message.innerText = `Game Over, You managed to save ${
      getNodes("masked").length - 1
    } humans!`;
  } else if (turns > 1 && checkSpreadFieldBlock().length == 0) {
    gameOn = false;
    message.style.display = "inline";
    message.innerText = `You managed to stop the spreading and saved ${
      getNodes("masked").length + getNodes("unmasked").length - 1
    } humans!`;
  }
}

export { nextTurn, imune, deleteImune, gameOn };
