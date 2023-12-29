//timer buttons
let btnStart = document.querySelector('.start');
let btnStop = document.querySelector('.stop');

let btnMinusTime = document.querySelector('.minus');
let btnPlusTime = document.querySelector('.plus');
let timerInput = document.querySelector('.timer-input');

//timer display
let timerHour = document.querySelector('.timer-hour');
let timerMinute = document.querySelector('.timer-minute');
let progress = document.querySelector('.progress');

let startTime = 30;
let currantTime = startTime;
timerInput.value = currantTime;

function disableBtn() {
  if (timerInput.value <= 5) {
    btnMinusTime.disabled = true;
    startTime = 5;
    currantTime = startTime;
  }
  if (timerInput.value > 5) {
    btnMinusTime.disabled = false;
  }
}

function refreshTimer() {
  currantTime = startTime;
  timerInput.value = currantTime;

  if (currantTime >= 60) {
    timerHour.innerText = `${Math.floor(currantTime / 60)} h`;
    timerMinute.innerText = `${currantTime % 60 == 0 ? 0 : currantTime % 60} min`;
  } else {
    timerHour.innerText = currantTime;
    timerMinute.innerText = 'min';
  }
}

function decrementTimerValue() {
  startTime -= 5;
  disableBtn();
  refreshTimer();
  stopTimer();
}

function incrementTimerValue() {
  disableBtn();
  startTime += 5;
  refreshTimer();
  stopTimer();
}

btnMinusTime.addEventListener('click', decrementTimerValue);

btnPlusTime.addEventListener('click', incrementTimerValue);

let timerInterval;

//load saved history
let eventsTimer = [];

function loadHistory() {
  const storedHistory = localStorage.getItem('timerHistory');
  if (storedHistory) {
    eventsTimer = JSON.parse(storedHistory);
  }
}

loadHistory();

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

function addToHistory(array) {

  
  localStorage.setItem('timerHistory', JSON.stringify(array.map(event =>  ({
    id: event.id,
    start: event.start,
    end: event.end,
  }))));
};

function refreshTimerProgress() {
  let totalTime = startTime * 60;

  let progressValue = 100 - (((currantTime * 60) / totalTime) * 100);
  progress.style.background =
    ` conic-gradient(var(--accent-blue) 0 ${progressValue}%, var(--timer-background-color) ${progressValue}% 100%)`;
}

function startTimer() {
  generetedTimerStartEvent(eventsTimer.length);
  timerInterval = setInterval(() => {
    currantTime -= 1;
    refreshTimer();
    setInterval(refreshTimerProgress, 1000);
    if (currantTime == 0) {
      stopTimer();
      setTimeout(() => {
        currantTime = 30;
        refreshTimer();
        refreshTimerProgress();
      }, 1000);
    }
  }, 60000);
  document.querySelector('.display-time').classList.add('active-timer');
  btnStart.disabled = true;
  btnStop.disabled = false;
}

function stopTimer() {
  clearInterval(timerInterval);
  document.querySelector('.display-time').classList.remove('active-timer');
  btnStart.disabled = false;
  btnStop.disabled = true;
  console.log(eventsTimer);

}

btnStart.addEventListener('click', startTimer);

btnStop.addEventListener('click', () => {
  stopTimer();
  generetedTimerEndEvent(eventsTimer.length - 1, new Date());
  addToHistory(eventsTimer);
});


