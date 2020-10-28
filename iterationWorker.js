importScripts("simulationFunctions.js");

onmessage = (e) => {
  let map = e.data[0];

  postMessage(
    simulateInfection(map.infected.length, map.masked.length, map.empty)
  );
};

function simulateInfection(infectedCount, maskedCount, emptyCoords) {
  let iterationMap = {
    virus: [],
    empty: [],
    humans: [],
    infected: [],
    masked: [],
    occupied: [],
    imune: [],
    infectedAfter: [],
  };
  reserveEmptyCells(emptyCoords, iterationMap);
  reserveHumanCells(iterationMap);

  for (let i = 0; i < infectedCount; i++) {
    let bestPos;
    let prevCount;
    iterationMap.humans.forEach((coords, index) => {
      let iterationMapTemp = {
        virus: [],
        empty: [...iterationMap.empty],
        humans: [...iterationMap.humans],
        infected: [...iterationMap.infected],
        masked: [],
        occupied: [],
        imune: [],
        infectedAfter: [],
      };
      createInfectedStrictBefore(coords, iterationMapTemp);
      infectInfectedSpreadField(
        infectedSpreadField(iterationMapTemp),
        100,
        iterationMapTemp
      );

      if (index == 0) {
        prevCount = iterationMapTemp.infectedAfter.length;
        bestPos = coords;
      } else {
        if (iterationMapTemp.infectedAfter.length < prevCount) {
          prevCount = iterationMapTemp.infectedAfter.length;
          bestPos = coords;
        }
      }
    });

    iterationMap.infected.push(bestPos);
    const infectedIndex = iterationMap.humans.findIndex((coords) => {
      return coords[0] == bestPos[0] && coords[1] == bestPos[1];
    });
    iterationMap.humans.splice(infectedIndex, 1);
  }

  for (let i = 0; i < maskedCount; i++) {
    let bestPos;
    let prevCount;
    let useList = infectedSpreadField(iterationMap).filter(
      (coords) => getType(coords, iterationMap) == "humans"
    );
    useList.length == 0 ? (useList = iterationMap.humans) : useList;

    useList.forEach((coords, index) => {
      let iterationMapTemp = {
        virus: [],
        empty: [...iterationMap.empty],
        humans: [...iterationMap.humans],
        infected: [...iterationMap.infected],
        masked: [...iterationMap.masked],
        occupied: [],
        imune: [],
        infectedAfter: [],
      };

      createMaskedStrict(coords, iterationMapTemp);
      imuneImunityField(immunityField(iterationMapTemp), iterationMapTemp);
      infectInfectedSpreadField(
        infectedSpreadField(iterationMapTemp),
        100,
        iterationMapTemp
      );

      if (index == 0) {
        prevCount = iterationMapTemp.infectedAfter.length;
        bestPos = coords;
      } else {
        if (iterationMapTemp.infectedAfter.length < prevCount) {
          prevCount = iterationMapTemp.infectedAfter.length;
          bestPos = coords;
        }
      }
    });

    iterationMap.masked.push(bestPos);
    const maskedIndex = iterationMap.humans.findIndex((coords) => {
      return coords[0] == bestPos[0] && coords[1] == bestPos[1];
    });
    iterationMap.humans.splice(maskedIndex, 1);
  }

  deleteImune(iterationMap);
  imuneImunityField(immunityField(iterationMap), iterationMap);

  return iterationMap;
}
