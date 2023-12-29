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
          <use href="./images/icons/symbol-defs.svg#icon-arrow"></use>
        </svg>
      </span>`
    );
  } else {
    btnHistoryControl.innerHTML = `<span>
        Open history
        <svg>
          <use href="./images/icons/symbol-defs.svg#icon-arrow"></use>
        </svg>
      </span>`;
  }
}

btnHistoryControl.addEventListener('click', toggleHistoryActiveClass);

function generetedHistoryHtml() {
  let history = localStorage.getItem('timerHistory') ? JSON.parse(localStorage.getItem('timerHistory')) : 'you don`t have a history yet';

  let html = '';
  let time = (t) => {
    return `
    ${(new Date(t).getHours().toLocaleString() < 10 ? '0' + (new Date(t).getHours().toLocaleString()) : new Date(t).getHours().toLocaleString())}:${(new Date(t).getMinutes().toLocaleString() < 10 ? '0' + (new Date(t).getMinutes().toLocaleString()) : new Date(t).getMinutes().toLocaleString())}:${(new Date(t).getSeconds().toLocaleString() < 10 ? '0' + (new Date(t).getSeconds().toLocaleString()) : new Date(t).getSeconds().toLocaleString())}
    `
  }
  let day = (d) => {
    if (new Date(d).getUTCDate() < 10) {
      return '0' + (new Date(d).getUTCDate());
    }
    return new Date(d).getUTCDate();
  }
  let month = (d) => {
    if ((new Date(d).getMonth() + 1) < 10) {
      return '0' + (new Date(d).getMonth() + 1);
    }
    return new Date(d).getMonth() + 1;
  }

  if (history !== 'you don`t have a history yet') {
    html = history.map(elem => {
      return `<div class="history-element">
                <span class="day">${day(elem.start)}.${month(elem.start)}</span>
                <span class="time-start">${time(elem.start)}</span>
                <span  class="time-end">${time(elem.end)}</span>
              </div>`;
    }).join('');
  } else {
    html = '<span class="history-empty">You don`t have a history yet</span>';
  }

  historyContainer.querySelector('.history-body').innerHTML = html;
}
generetedHistoryHtml();
btnStop.addEventListener('click', generetedHistoryHtml);

btnClearHistory.addEventListener('click', () => {
  localStorage.removeItem('timerHistory');
  eventsTimer = [];
  generetedHistoryHtml();

});