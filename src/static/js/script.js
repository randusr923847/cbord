/*global EVENTS_PER_LOAD*/
/*global ejs*/
/*global card_partial*/

const events_container = document.getElementById('event-cont');
const loading_container = document.getElementById('loading-cont');
const no_events_cont = document.getElementById('no-events-cont');
const error_cont = document.getElementById('error-cont');
const net_error_cont = document.getElementById('net-error-cont');

window.onload = async function () {
  resizeImages();

  // let time = Date.now();
  // await loadEvents(time, 0);
  // console.log(Date.now() - time);
};

function resizeImages() {
  let cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    let cardBody = card.querySelector('.card-body');
    let cardImg = card.querySelector('.card-img img');

    if (cardBody && cardImg) {
      let height = 0;

      Array.from(cardBody.children).forEach((item) => {
        height += item.offsetHeight;
      });

      cardImg.style.maxHeight = `calc(${height}px + 2.1rem)`;
    }
  });
}

window.addEventListener('resize', resizeImages);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function loadEvents(start, skip) {
  loading_container.removeAttribute('hidden');
  let response = null;

  try {
    response = await fetch(
      `/api/event/get/${start}/${EVENTS_PER_LOAD}/${skip}`,
      {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
      },
    );
  } catch (err) {
    net_error_cont.removeAttribute('hidden');
    console.log(err);
  }

  try {
    if (response) {
      if (response.ok) {
        const res = await response.json();
        if (res.success) {
          console.log(res);
          renderEvents(res.events);
        } else {
          error_cont.removeAttribute('hidden');
        }
      } else {
        error_cont.removeAttribute('hidden');
      }
    }
  } catch (err) {
    error_cont.removeAttribute('hidden');
    console.log(err);
  }

  resizeImages();
  loading_container.setAttribute('hidden', 'none');
}

function renderEvents(dates) {
  let dates_obj = Object.keys(dates);

  if (dates_obj.length == 0) {
    no_events_cont.removeAttribute('hidden');
  } else {
    const today = new Date();
    const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
    const todayDate = dateString(today);
    const tomorrowDate = dateString(tomorrow);

    dates_obj.forEach((date) => {
      let events = dates[date];

      if (!document.getElementById(date)) {
        let eventDate = date;
        let date_label = document.createElement('h3');
        date_label.id = date;
        date_label.className = 'event-date';

        if (date == todayDate) {
          eventDate = 'Today';
        } else if (date == tomorrowDate) {
          eventDate = 'Tomorrow';
        }

        date_label.textContent = eventDate;
        events_container.appendChild(date_label);
      }

      for (const event of events) {
        let event_div = document.createElement('div');
        event_div.innerHTML = ejs.render(card_partial, {
          id: event.id,
          event: event,
          desc: false,
          full_time: false,
        });
        events_container.appendChild(event_div);
      }
    });
  }
}

function dateString(date) {
  let curr = new Date().getFullYear();

  if (curr != date.getFullYear()) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
