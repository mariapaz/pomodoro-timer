//import { animationInterval } from "./interval.js";
const body = document.querySelector("body");
const display = document.getElementById("display");
const controlBtn = document.getElementById("control-btn");
const pomodoroBtn = document.getElementById("pomodoro-btn");
const shortBreakBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");
// const save = document.getElementById("save");
controlBtn.addEventListener("click", startStopTimer);
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

console.log(modes[1].name.toLowerCase().replace(/ /g, "-"));
modes.forEach((mode) =>
  mode.button.addEventListener("click", (e) => {
    console.log(e.target);
    clearTimeout(interval);
    body.classList.remove("pomodoro", "short-break", "long-break");
    // name to lower case, no spaces between words, joined by a dash
    const nameClass = mode.name.toLowerCase().replace(/ /g, "-");
    body.classList.add(nameClass);
    display.innerHTML = "";
    controlBtn.innerHTML = "START";
    pomodoroMode = mode.timer;
    message = mode.name;
    displayTime(pomodoroMode, 0);
  })
);

function startStopTimer() {
  if (controlBtn.innerHTML === "START") {
    startTime = Date.now();
    startStopPomodoro(message, pomodoroMode);
    controlBtn.innerHTML = "STOP";
  } else {
    elapsedTime += Date.now() - startTime;
    clearTimeout(interval);
    controlBtn.innerHTML = "START";
  }
}
function startStopPomodoro(message, timer) {
  interval = setInterval(function () {
    const time = Date.now() - startTime + elapsedTime;
    const pomodoroTime = pomodoroMode * 60000;
    const seconds = parseInt((timer * 60 - time / 1000) % 60);
    const minutes = parseInt((timer - time / (1000 * 60)) % 60);
    // call function to display the time
    if (time >= pomodoroTime) {
      clearTimeout(interval);
      displayTime(0, 0);
      notify(message);
    } else {
      displayTime(minutes, seconds);
    }
  }, 1);
}

function displayTime(minutes, seconds) {
  // if only one digit prepend a zero
  const time = [minutes, seconds].map((time) =>
    time < 10 ? `0${time}` : time
  );
  display.innerHTML = time.join(":");
  document.title = time.join(":");
}
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
