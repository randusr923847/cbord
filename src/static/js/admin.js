/*global email*/

var rejBtns = document.getElementsByName('rej-btn');
var accBtns = document.getElementsByName('acc-btn');
var hidBtns = document.getElementsByName('hid-btn');

window.onload = function () {
  removeUrlParams();
};

rejBtns.forEach((e) => {
  e.addEventListener('click', () => {
    reject(e.id.slice(0, -4));
  });
});

accBtns.forEach((e) => {
  e.addEventListener('click', () => {
    accept(e.id.slice(0, -4));
  });
});

hidBtns.forEach((e) => {
  e.addEventListener('click', () => {
    hide(e.id.slice(0, -4));
  });
});

function removeUrlParams() {
  const url = new URL(window.location.href);

  if (url.search) {
    url.search = '';
    window.history.replaceState({}, document.title, url.toString());
  }
}

async function reject(id) {
  console.log('trying reject fetch');
  try {
    await fetch('/api/event/reject/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data.success) {
          let mailto =
            'https://mail.google.com/mail/u/' +
            email +
            '/?view=cm&to=' +
            document.getElementById(id + '_em').innerHTML +
            '&su=Event Rejected&body=Hello,%0D%0A%0D%0AThank you for submitting your event. Unfortunately because of [enter reasoning here] we are unable to allow your event to be published on Bord.%0D%0A[If event can be fixed] Please submit a new event for review with the necessary changes.%0D%0A%0D%0ASincerely,%0D%0ABord Moderation Team';
          window.open(mailto);

          document.getElementById(id).remove();
        } else {
          console.log('Reject API: Something went wrong!');
        }
      });
  } catch {
    console.log('Fetch reject: Something went wrong.');
  }
}

async function accept(id) {
  console.log('trying accept fetch');
  try {
    await fetch('/api/event/accept/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data.success) {
          let mailto =
            'https://mail.google.com/mail/u/' +
            email +
            '/?view=cm&to=' +
            document.getElementById(id + '_em').innerHTML +
            '&su=Event Accepted&body=Hello,%0D%0A%0D%0AYour event has been accepted and will be published on CampusBord. If you need to make any changes, please reply to this email with the event name, date, and time and the desired changes.%0D%0A%0D%0ASincerely,%0D%0ABord Moderation Team';
          window.open(mailto);

          document.getElementById(id).remove();
        } else {
          console.log('Accept API: Something went wrong!');
        }
      });
  } catch {
    console.log('Fetch accept: Something went wrong.');
  }
}

async function hide(id) {
  console.log('trying hide fetch');
  try {
    await fetch('/api/event/hide/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data.success) {
          document.getElementById(id).remove();
        } else {
          console.log('Hide API: Something went wrong!');
        }
      });
  } catch {
    console.log('Fetch hide: Something went wrong.');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function logout() {
  await fetch('/api/logout/', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      window.location.reload(true);
    });
}
