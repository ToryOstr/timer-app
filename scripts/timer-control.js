//timer buttons
const btnStart = document.querySelector('.start');
const btnStop = document.querySelector('.stop');
const btnReset = document.querySelector('.reset');

const btnMinusTime = document.querySelector('.minus');
const btnPlusTime = document.querySelector('.plus');
const timerInput = document.querySelector('.timer-input');

//timer display
const timerTime = document.querySelector('.timer-time');
const displayTime = document.querySelector('.display-time');
const progress = document.querySelector('.progress');
const HISTORY_KEY = 'timerHistory';

let startTime = 1800; //seconds in 30min

timerInput.value = Math.trunc(startTime / 60);

const audio = new Audio('audio1.mp3');

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
  const h = Math.trunc(t / 3600).toString().padStart(2, '0');
  const m = Math.trunc((t / 60) % 60).toString().padStart(2, '0');
  const s = Math.trunc(t % 60).toString().padStart(2, '0');

  return `${h}:${m}:${s}`
}

function refreshTimerInput(t) {
  timerInput.value = Math.trunc(t / 60);
}

function refreshTimerDisplay(t) {
  timerTime.innerText = formaingTimerTime(t);
}

// refreshTimerDisplay(startTime);
function refreshTimer(t) {
  refreshTimerDisplay(t);
  refreshTimerInput(t);
  calcProgress();
}

//progress bar
function calcProgress() {
  const pr = 100 / (+timerInput.value * 60);
  const progressValue = (pr * startTime).toFixed(2);

  progress.style.background =
    ` conic-gradient(var(--accent-blue) 0% ${progressValue}%, var(--timer-background-color) ${progressValue}% 100%)`;
}


function decrementTimerValue() {
  stopTimer();
  startTime -= 300;
  disabledBtn();
  refreshTimer(startTime);
}

function incrementTimerValue() {
  stopTimer();
  disabledBtn();
  startTime += 300;
  refreshTimer(startTime);

}

const getHistory = () =>
  JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

btnMinusTime.addEventListener('click', decrementTimerValue);
btnPlusTime.addEventListener('click', incrementTimerValue);

let timerInterval;
let eventsTimer = getHistory();

//genereted timer event
function generetedTimerStartEvent(id) {
  const newEvent = {
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
  const result = array.filter(event => event.end != null);
  arrangeHistoryID(result);

  return result;
}

function arrangeHistoryID(array) {
  const result = [];
  array.forEach((element, index) => {
    element.id = index;
    result.push(element)
  });

  return result;
}

function addToHistory(array) {
  const filteredArray = filterHistory(array);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredArray));
};


function activeTimer() {
  generetedTimerStartEvent(eventsTimer.length);

  timerInterval = setInterval(() => {
    startTime -= 1;
    refreshTimerDisplay(startTime);
    calcProgress();

    if (startTime == 0) {
      stopTimer();
      audio.play();
      generetedTimerEndEvent(eventsTimer.length - 1, new Date());
      addToHistory(eventsTimer);
      generetedHistoryHtml();
      setTimeout(() => {
        startTime = 1800;
        refreshTimer(startTime);
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
  startTime = Math.round(startTime / 60) * 60;
  btnStart.disabled = false;
  btnStop.disabled = true;

}

btnStart.addEventListener('click', activeTimer);

btnStop.addEventListener('click', () => {
  stopTimer();
  audio.play();
  refreshTimer(startTime);
  generetedTimerEndEvent(eventsTimer.length - 1, new Date());
  addToHistory(eventsTimer);
  generetedHistoryHtml();
});

btnReset.addEventListener('click', () => {
  stopTimer();
  startTime = 1800;
  refreshTimer(startTime);
  disabledBtn();
})

const btnHistoryControl = document.querySelector('.history-control');
const btnClearHistory = document.querySelector('.clear-history');
const historyContainer = document.querySelector('.history');

function toggleHistoryActiveClass() {

  historyContainer.classList.toggle('active');

  const isActive = historyContainer.classList.contains('active');

  if (isActive) {
    btnHistoryControl.innerHTML =`<span>
        Close history
        <svg style='transform: rotate(0)'>
          <use href="./images/sprite.svg#icon-arrow"></use>
        </svg>
      </span>`;
  } else {
    btnHistoryControl.innerHTML = `<span>
        Open history
        <svg>
          <use href="./images/sprite.svg#icon-arrow"></use>
        </svg>
      </span>`;
  }
}

btnHistoryControl.addEventListener('click', toggleHistoryActiveClass);

function formatingTime(t) {

  const hour = new Date(t).getHours().toLocaleString().padStart(2, '0');
  const minute = new Date(t).getMinutes().toLocaleString().padStart(2, '0');
  const second = new Date(t).getSeconds().toLocaleString().padStart(2, '0');

  return `
    ${hour}:${minute}:${second}
    `;
}

function formatingDate(d) {

  const day = new Date(d).getUTCDate().toString().padStart(2, '0');
  const month = (new Date(d).getMonth() + 1).toString().padStart(2, '0');

  return `${day}.${month}`
}
function totalTime(start, end) {

  const ms = new Date(end) - new Date(start);
  let totalMinutes = ms / (1000 * 60);

  if (totalMinutes < 1) {
    totalMinutes *= 60;
    return `${Math.round(totalMinutes)}s`
  }
  return `${totalMinutes.toFixed(2)}min`;
}

function generetedHistoryHtml() {

  const timerHistory = getHistory();
  let html;

  if (!timerHistory.length) {
    html = '<span class="history-empty">You don`t have a history yet</span>';
  } else {
    html = timerHistory.reverse().map(elem => {
      return `<div class="history-element">
                <span class="day">${formatingDate(elem.start)}</span>
                <span class="time-start">${formatingTime(elem.start)}</span>
                <span  class="time-end">${formatingTime(elem.end)}</span>
                <span class="total-time">${totalTime(elem.start, elem.end)}</span>
              </div>`;
    }).join('');
  }

  historyContainer.querySelector('.history-body').innerHTML = html;
}

generetedHistoryHtml();

btnClearHistory.addEventListener('click', () => {
  localStorage.removeItem(HISTORY_KEY);
  eventsTimer = getHistory();
  generetedHistoryHtml();

});

const message = document.querySelector('.message');
const wWidth = window.visualViewport.width;
const wHeght = window.visualViewport.height;

document.addEventListener('mousemove', (e) => {

  if (e.pageY < 50 || e.pageX < 50 || e.pageX > wWidth - 50 || e.pageY > wHeght - 50) {
    message.classList.add('visible-message');
  } else {
    message.classList.remove('visible-message');
  }
  

})