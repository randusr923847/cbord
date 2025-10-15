/*global logView*/

const emailInput = document.getElementById('email-text');
const sub = document.getElementById('sub');
const unsub = document.getElementById('unsub');
const success = document.getElementById('success');
const failure = document.getElementById('failure');

emailInput.addEventListener('input', checkButton);

window.onload = function () {
  logView();
};

sub.onclick = async function () {
  let response;

  try {
    response = await fetch('/api/notifs/subscribe', {
      method: 'POST',
      mode: 'same-origin',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailInput.value }),
    });
  } catch (err) {
    failure.removeAttribute('hidden');
    console.log(err);
  }

  try {
    if (response) {
      if (response.ok) {
        const res = await response.json();
        if (res.success) {
          success.removeAttribute('hidden');
          setTimeout(redirect, 3500);
        } else {
          failure.removeAttribute('hidden');
        }
      } else {
        failure.removeAttribute('hidden');
      }
    }
  } catch (err) {
    failure.removeAttribute('hidden');
    console.log(err);
  }
};

unsub.onclick = async function () {
  let response;

  try {
    response = await fetch('/api/notifs/unsubscribe', {
      method: 'POST',
      mode: 'same-origin',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailInput.value }),
    });
  } catch (err) {
    failure.removeAttribute('hidden');
    console.log(err);
  }

  try {
    if (response) {
      if (response.ok) {
        const res = await response.json();
        if (res.success) {
          success.removeAttribute('hidden');
          setTimeout(redirect, 5000);
        } else {
          failure.removeAttribute('hidden');
        }
      } else {
        failure.removeAttribute('hidden');
      }
    }
  } catch (err) {
    failure.removeAttribute('hidden');
    console.log(err);
  }
};

function redirect() {
  window.location.href = '/';
}

function checkButton() {
  if (checkEmail(emailInput.value)) {
    sub.removeAttribute('disabled');
    unsub.removeAttribute('disabled');
  } else {
    sub.setAttribute('disabled', '');
    unsub.setAttribute('disabled', '');
  }
}

function isWhitespace(str) {
  return !str.replace(/\s/g, '').length;
}

function checkEmail(email) {
  return (
    !isWhitespace(email) &&
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
  );
}
