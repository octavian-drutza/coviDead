import { globalMap, renderMap } from "./cellCreators.js";

let automation = document.getElementById("automation");
let percentage = document.getElementById("percentage");

let w = new Worker("iterationWorker.js");

export function automationStart() {
  automation.addEventListener("click", () => {
    console.log("start automation");
    console.time();
    percentage.innerText = "Processing...";
    if (window.Worker) {
      w.postMessage([globalMap]);
      w.onmessage = function (event) {
        let config = event.data;
        console.log(config);
        percentage.innerText = "Solution Ready!";
      };
    } else {
      console.log("Sorry! No Web Worker support");
    }
    console.timeEnd();
  });
}
