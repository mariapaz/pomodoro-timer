//import { animationInterval } from "./interval.js";
const body = document.querySelector("body");
const display = document.getElementById("display");
const controlBtn = document.getElementById("control-btn");
const pomodoroBtn = document.getElementById("pomodoro-btn");
const shortBreakBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");
const resetBtn = document.getElementById("reset");
// const save = document.getElementById("save");

// save.addEventListener("click", add_local);
const modes = [
  {
    button: pomodoroBtn,
    name: "Pomodoro",
    timer: 25,
  },
  {
    button: shortBreakBtn,
    name: "Short break",
    timer: 5,
  },
  {
    button: longBreakBtn,
    name: "Long break",
    timer: 15,
  },
];

let pomodoroMode = modes[0].timer;
let message = modes[0].name;
let startTime = 0;
let elapsedTime = 0;
let interval = null;

//-------------------//
// Event Listeners  //
//-----------------//
controlBtn.addEventListener("click", startStopTimer);
//
resetBtn.addEventListener("click", () => {
  clearTimeout(interval);
  displayTime(pomodoroMode, 0);
  controlBtn.innerHTML = "START";
  resetBtn.classList.remove("reset-visible");
});
modes.forEach((mode) =>
  mode.button.addEventListener("click", () => {
    clearTimeout(interval);
    body.classList.remove("pomodoro", "short-break", "long-break");
    // name to lower case, no spaces between words, joined by a dash
    const nameClass = mode.name.toLowerCase().replace(/ /g, "-");
    body.classList.add(nameClass);
    // display.innerHTML = "";
    controlBtn.innerHTML = "START";
    resetBtn.classList.remove("reset-visible");
    pomodoroMode = mode.timer;
    message = mode.name;
    displayTime(pomodoroMode, 0);
  })
);

//-----------------------//
// START / STOP Button  //
//-----------------====//

function startStopTimer() {
  if (controlBtn.innerHTML === "START") {
    startTime = Date.now();
    pomodoroCounter(message, pomodoroMode);
    //
    resetBtn.classList.add("reset-visible");
    controlBtn.innerHTML = "STOP";
  } else {
    elapsedTime += Date.now() - startTime;
    clearTimeout(interval);
    //
    resetBtn.classList.remove("reset-visible");
    controlBtn.innerHTML = "START";
  }
}

//-----------------------//
// COUNTDOWN  //
//-----------------====//
function pomodoroCounter(message, timer) {
  //
  interval = setInterval(function () {
    const time = Date.now() - startTime + elapsedTime;
    const pomodoroTime = pomodoroMode * 60000;
    const seconds = parseInt((timer * 60 - time / 1000) % 60);
    const minutes = parseInt((timer - time / (1000 * 60)) % 60);
    // COUTNTDOWN STOPS AT ZERO AND KICKS IN NOTIFICATION
    if (time >= pomodoroTime) {
      clearTimeout(interval);
      displayTime(0, 0);
      notify(message);
      controlBtn.innerHTML = "START";
      resetBtn.classList.remove("reset-visible");
    } else {
      displayTime(minutes, seconds);
    }
  }, 1);
}
//-----------------------//
// DISPLAY TIME  //
//-----------------====//
function displayTime(minutes, seconds) {
  // if only one digit prepend a zero
  const time = [minutes, seconds].map((time) =>
    time < 10 ? `0${time}` : time
  );
  display.innerHTML = time.join(":");
  document.title = time.join(":");
}
//-----------------------//
// BROWSER NOTIFICATIONS  //
//-----------------====//
//https://stackoverflow.com/questions/57523910/intercept-html5-web-notifications-in-a-browser-environment/57572671#57572671
function notify(message) {
  function notifyCallback(title, opt) {
    console.log("title", title);
  }

  const handler = {
    construct(target, args) {
      notifyCallback(...args);
      return new target(...args);
    },
  };

  const ProxifiedNotification = new Proxy(Notification, handler);

  window.Notification = ProxifiedNotification;

  Notification.requestPermission(function (permission) {
    if (permission === "granted") {
      const notif = new Notification(`${message} is over!`);
    }
  });
}

// function add_local() {
//   const display = {};
//   display.pomodoro = document.getElementById("pomodoroLength").value;

//   window.localStorage.setItem("display", JSON.stringify(display));
// }

// function show_local() {
//   let _display = JSON.parse(localStorage.getItem("display"));
//   console.log(_display);
//  }
