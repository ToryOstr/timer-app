import { btnStop, TIMER_HISTORY, getHistory } from "./timer-control.js";
let btnHistoryControl = document.querySelector('.history-control');
let btnClearHistory = document.querySelector('.clear-history');
let historyContainer = document.querySelector('.history');

function toggleHistoryActiveClass() {
  historyContainer.classList.toggle('active');
  let isActive = historyContainer.classList.contains('active');

  if (isActive) {
    btnHistoryControl.innerHTML = (
      `<span>
        Close history
        <svg style='transform: rotate(0)'>
          <use href="./images/symbol-defs.svg#icon-arrow"></use>
        </svg>
      </span>`
    );
  } else {
    btnHistoryControl.innerHTML = `<span>
        Open history
        <svg>
          <use href="./images/symbol-defs.svg#icon-arrow"></use>
        </svg>
      </span>`;
  }
}

btnHistoryControl.addEventListener('click', toggleHistoryActiveClass);
function formatingTime(t) {

  let hour = new Date(t).getHours().toLocaleString().padStart(2, '0');
  let minute = new Date(t).getMinutes().toLocaleString().padStart(2, '0');
  let second = new Date(t).getSeconds().toLocaleString().padStart(2, '0');

  return `
    ${hour}:${minute}:${second}
    `;
}

function totalTime(start, end) {
  let ms = new Date(end) - new Date(start);
  let totalMinutes = ms / (1000 * 60);
  if (totalMinutes < 1) {
    totalMinutes *= 60;
    return `${Math.round(totalMinutes)}s`
  }
  return `${totalMinutes.toFixed(2)}min`;
}

function formatingDate(d) {
  let day = new Date(d).getUTCDate().toString().padStart(2, '0');
  let month = (new Date(d).getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`
}

function generetedHistoryHtml() {
  let timerHistory = getHistory();
  let html;

  if (!timerHistory.length) {
    html = '<span class="history-empty">You don`t have a history yet</span>';
  } else {
    html = timerHistory.map(elem => {
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

btnStop.addEventListener('click', generetedHistoryHtml);

btnClearHistory.addEventListener('click', () => {
  localStorage.removeItem(TIMER_HISTORY); 
  
  getHistory();

  generetedHistoryHtml();

});