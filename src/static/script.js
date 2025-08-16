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

async function loadEvents() {
  const date = new Date().toUTCString();
  const numEvents = 10;

  try {    
    await fetch(
      `http://localhost:8000/api/event/getevents/${0}/${numEvents}`, //replace 0 with date when we have more events
    )
    .then(data => data.json())
    .then(events => { 
      const container = document.getElementById("event-container");      

      for(let i = 0; i < events.length; i++) {
        let event = events[i];
        eventDiv = document.createElement('div');
        eventDiv.innerHTML = ejs.render(cardpartial, {event: event})

        container.appendChild(eventDiv);
      };

      resizeImages();
    });
  } catch (err) {
    console.error(err.message);
  }
}

window.addEventListener('load', loadEvents);
window.addEventListener('resize', resizeImages);