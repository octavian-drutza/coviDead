import { globalMap, renderMap } from "./cellCreators.js";

let automation = document.getElementById("automation");
let automationUse = document.getElementById("automation-use");
let automationSee = document.getElementById("automation-see");
let percentage = document.getElementById("percentage");
let state = false;
let config;

let w = new Worker("iterationWorker.js");

export function automationStart() {
  automation.addEventListener("click", () => {
    state = true;
    console.log("start automation");
    console.time();
    percentage.innerText = "Processing...";
    if (window.Worker) {
      w.postMessage([globalMap]);
      w.onmessage = function (event) {
        config = event.data;
        console.log(config);
        percentage.innerText = "Solution Ready!";
      };
    } else {
      console.log("Sorry! No Web Worker support");
    }
    console.timeEnd();
  });
  let first = true;
  automationSee.addEventListener("click", () => {
    if (state == true) {
      if (first == true) {
        automationSee.innerText = "VIEW SOLUTION : ON";
        automationSee.style.backgroundColor = "red";
        renderMap(config);
        first = false;
      } else {
        renderMap(globalMap);
        automationSee.innerText = "VIEW SOLUTION : OFF";
        automationSee.style.backgroundColor = "";
        first = true;
      }
    }
  });
}

export function automationStop() {
  config = globalMap;
  state = false;
  automationSee.innerText = "VIEW SOLUTION : OFF";
  automationSee.style.backgroundColor = "";
}
