//timer buttons
let btnStart = document.querySelector('.start');
let btnStop = document.querySelector('.stop');
let btnReset = document.querySelector('.reset');

let btnMinusTime = document.querySelector('.minus');
let btnPlusTime = document.querySelector('.plus');
let timerInput = document.querySelector('.timer-input');

//timer display
let timerTime = document.querySelector('.timer-time');
let displayTime = document.querySelector('.display-time');
let progress = document.querySelector('.progress');
const TIMER_HISTORY = 'timerHistory';

let startTime = 1800; //seconds in 30min

timerInput.value = Math.trunc(startTime / 60);

let audio = new Audio('audio1.mp3');

function disabledBtn() {
  if (timerInput.value <= 5) {
    btnMinusTime.disabled = true;
    startTime = 300;
  }
  if (timerInput.value > 5) {
    btnMinusTime.disabled = false;
  }
}

function formaingTimerTime(t) {
  let h = Math.trunc(t / 3600).toString().padStart(2, '0');
  let m = Math.trunc((t / 60) % 60).toString().padStart(2, '0');
  let s = Math.trunc(t % 60).toString().padStart(2, '0');

  return `${h}:${m}:${s}`
}

function refreshTimerInput(t) {
  timerInput.value = Math.trunc(t / 60);
}

function refreshTimer(t) {
  timerTime.innerText = formaingTimerTime(t);

}
refreshTimer(startTime);

function decrementTimerValue() {
  stopTimer();
  Math.round(startTime/60)
  startTime = (Math.round(startTime / 60) * 60) - 300;
  disabledBtn();
  refreshTimer(startTime);
  refreshTimerInput(startTime);
  calcProgress();
}

function incrementTimerValue() {
  stopTimer();
  disabledBtn();
  startTime = (Math.round(startTime / 60) * 60) + 300;
  refreshTimer(startTime);
  refreshTimerInput(startTime);
  calcProgress();
}

let getHistory = () =>
  JSON.parse(localStorage.getItem("timerHistory")) || [];

btnMinusTime.addEventListener('click', decrementTimerValue);
btnPlusTime.addEventListener('click', incrementTimerValue);

let timerInterval;
let eventsTimer = getHistory();

//genereted new timer event
function generetedTimerStartEvent(id) {
  let newEvent = {
    id: id,
    start: new Date(),
    end: null,
  };
  eventsTimer.push(newEvent);
}


function generetedTimerEndEvent(index, endTimer) {
  eventsTimer[index].end = endTimer;
}

function filterHistory(array) {
  let result = array.filter(event => event.end != null);
  arrangeHistoryID(result);

  return result;
}

function arrangeHistoryID(array) {
  let result = [];
  array.forEach((element, index) => {
    element.id = index;
    result.push(element)
  });

  return result;
}

function addToHistory(array) {
  let filteredArray = filterHistory(array);
  localStorage.setItem(TIMER_HISTORY, JSON.stringify(filteredArray));
};

//progress bar
function calcProgress() {
  let pr = 100 / (+timerInput.value * 60);
  let progressValue = (pr * startTime).toFixed(2);
  console.log(progressValue);

  progress.style.background =
    ` conic-gradient(var(--accent-blue) 0% ${progressValue}%, var(--timer-background-color) ${progressValue}% 100%)`;
}

function activeTimer() {
  generetedTimerStartEvent(eventsTimer.length);

  timerInterval = setInterval(() => {
    startTime -= 1;
    refreshTimer(startTime);
    calcProgress();

    if (startTime == 0) {
      stopTimer();
      audio.play();

      setTimeout(() => {
        startTime = 1800;
        refreshTimer(startTime);
        refreshTimerInput(startTime)
        calcProgress();
      }, 1000);
    }
  }, 1000);

  displayTime.classList.add('active-timer');
  btnStart.disabled = true;
  btnStop.disabled = false;
}

function stopTimer() {
  clearInterval(timerInterval);
  displayTime.classList.remove('active-timer');
  btnStart.disabled = false;
  btnStop.disabled = true;

}

btnStart.addEventListener('click', activeTimer);

btnStop.addEventListener('click', () => {
  stopTimer();
  audio.play();
  generetedTimerEndEvent(eventsTimer.length - 1, new Date());
  addToHistory(eventsTimer);
});
btnReset.addEventListener('click', () => {
  stopTimer();
  startTime = 1800;
  refreshTimer(startTime);
  refreshTimerInput(startTime)
  disabledBtn();
  calcProgress();
})
export { btnStop, TIMER_HISTORY, getHistory };