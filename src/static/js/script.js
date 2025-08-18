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
  const today = new Date();
  const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
  const todayDate = dateString(today);
  const tomorrowDate = dateString(tomorrow);

  const numEvents = 10;

  try {    
    await fetch(
      `http://localhost:8000/api/event/getevents/${0}/${numEvents}`, //replace 0 with today.utcstring when we have more events
    )
    .then(data => data.json())
    .then(events => {
      const container = document.getElementById("event-container");      

      let prevDay = "";

      for(let i = 0; i < events.length; i++) {
        let event = events[i];
        eventDiv = document.createElement('div');

        const time = new Date(event.start);
        const eventDate = dateString(time);

        event.start = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });

        let day = time.toLocaleDateString('en-US', {
          month:'short', 
          day:'numeric'
        });

        if (day != prevDay) {
          const date = document.createElement('h3');
          date.className = 'event-date'
          
          if (todayDate == eventDate) {
            date.textContent = 'Today';
          } else if (tomorrowDate == eventDate) {
            date.textContent = 'Tomorrow';
          } else {
            date.textContent = day;
          }

          container.appendChild(date);
          prevDay = day;
        }

        eventDiv.innerHTML = ejs.render(cardpartial, {event: event});
        eventDiv.addEventListener('click', () => {renderEvent(event)});
        container.appendChild(eventDiv);
      };

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