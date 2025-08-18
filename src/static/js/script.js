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

      cardImg.style.maxHeight = `calc(${height}px + 2rem)`;
    }
  });
}

function dateString(date) {
  return date.toLocaleDateString('en-US', {timeZone: 'America/New_York'});
}

async function loadEvents() {
  const searchFrom = new Date().toUTCString();
  const numEvents = 10;

  try {    
    await fetch(
      `http://localhost:8000/api/event/getevents/${0}/${numEvents}`, //replace 0 with searchFrom when we have more events
    )
    .then(data => data.json())
    .then(eventsByDate => {
      console.log(eventsByDate);
      const container = document.getElementById("event-container");      

      Object.keys(eventsByDate).forEach(eventDate => {
        const date = document.createElement('h3');
        date.className = 'event-date';
        date.textContent = eventDate;
        container.appendChild(date);

        const events = eventsByDate[eventDate];
        for (let i = 0; i < events.length; i++) {
          eventDiv = document.createElement('div');
          eventDiv.innerHTML = ejs.render(cardpartial, { event: events[i] });
          eventDiv.addEventListener('click', () => { renderEvent(events[i]); });
        container.appendChild(eventDiv);
      }
    });
      resizeImages();
    });
  } catch (err) {
    console.error(err.message);
  }
}

function renderEvent(event) {
  window.open(`/event/${event.id}`);
}

window.addEventListener('load', loadEvents);
window.addEventListener('resize', resizeImages);