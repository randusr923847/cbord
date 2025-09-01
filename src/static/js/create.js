/*global tag_arr*/
/*global FILE_LIMIT*/
/*global FORMAT_DATE*/
/*global time_conv_map*/

const tagEls = Array.from(document.getElementById('tags-cont').children);

const fileInput = document.getElementById('file');
const fileDisplay = document.getElementById('img-display');
const imgError = document.getElementById('image-error');

const titleInput = document.getElementById('title');
const orgInput = document.getElementById('org');
const dateInput = document.getElementById('date');
const bldgInput = document.getElementById('bldgs');
const roomInput = document.getElementById('room');
const emailInput = document.getElementById('email-text');
const descInput = document.getElementById('desc-text');

const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const startTimeOpts = document.getElementById('start_time_opts');
const startTimes = Array.from(startTimeOpts.children);
const endTimeOpts = document.getElementById('end_time_opts');
const endTimes = Array.from(endTimeOpts.children);

const submit = document.getElementById('submit');
const formError = document.getElementById('form-error');

window.onload = function () {
  titleInput.focus();
  resizeOrg();
  resizeDesc();
};

submit.onclick = async function () {
  formError.style.display = 'none';
  let data = {};

  data.title = titleInput.value;
  data.org = orgInput.value;
  data.date = dateInput.value;
  data.start = startTimeInput.value;
  data.end = endTimeInput.value;
  data.bldg = bldgInput.value;
  data.room = roomInput.value;
  data.email = emailInput.value;
  data.desc = descInput.value;
  data.tags = tag_arr;

  if (fileInput.files.length > 0) {
    let fileInfo = fileDisplay.src.split(',');
    data.image_type = fileInfo[0].split(';')[0].split(':')[1];
    data.image = fileInfo[1];
  }

  await fetch('/api/event/create', {
    method: 'POST',
    mode: 'same-origin',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.success) {
        window.location.href = '/event/' + res.id;
      } else {
        formError.style.display = 'block';
      }
    })
    .catch((err) => {
      formError.style.display = 'block';
      console.log(err);
    });
};

fileInput.addEventListener('change', function (event) {
  let file = event.target.files[0];

  if (file && file.type.startsWith('image/') && file.size < FILE_LIMIT) {
    imgError.style.display = 'none';
    let reader = new FileReader();

    reader.onload = function (e) {
      let dataUrl = e.target.result;
      fileDisplay.setAttribute('src', dataUrl);
    };

    reader.readAsDataURL(file);
    // fileDisplay.classList.remove('no-image');
  } else {
    imgError.style.display = 'block';
    // fileDisplay.removeAttribute('src');
    // fileDisplay.classList.add('no-image');
    fileInput.value = '';
  }
});

titleInput.addEventListener('input', resizeTitle);
window.addEventListener('resize', resizeTitle);

function resizeTitle() {
  titleInput.style.height = '72px';
  titleInput.style.height = titleInput.scrollHeight + 'px';
}

orgInput.addEventListener('input', resizeOrg);
window.addEventListener('resize', resizeOrg);

function resizeOrg() {
  orgInput.style.height = '53px';
  orgInput.style.height = orgInput.scrollHeight + 'px';
}

titleInput.addEventListener('input', checkButton);
orgInput.addEventListener('input', checkButton);
dateInput.addEventListener('change', checkButton);
startTimeInput.addEventListener('input', checkButton);
endTimeInput.addEventListener('input', checkButton);
bldgInput.addEventListener('input', checkButton);
roomInput.addEventListener('input', checkButton);
emailInput.addEventListener('input', checkButton);

descInput.addEventListener('input', resizeDesc);
window.addEventListener('resize', resizeDesc);

function resizeDesc() {
  descInput.style.height = '54px';
  descInput.style.height = 1 + descInput.scrollHeight + 'px';
}

function removeEndTimeDisables() {
  endTimes.forEach((end_time) => {
    end_time.style.display = 'block';
  });
}

function removeStartTimeDisables() {
  startTimes.forEach((start_time) => {
    start_time.style.display = 'block';
  });
}

startTimes.forEach((start_time) => {
  start_time.addEventListener('click', function () {
    removeEndTimeDisables();
    let min = new Date(
      FORMAT_DATE + time_conv_map[start_time.textContent],
    ).getTime();
    let val = new Date(
      FORMAT_DATE + time_conv_map[endTimeInput.value],
    ).getTime();

    if (val <= min) {
      endTimeInput.value = '';
    }

    endTimes.forEach((end_time) => {
      let curr = new Date(
        FORMAT_DATE + time_conv_map[end_time.textContent],
      ).getTime();

      if (curr <= min) {
        end_time.style.display = 'none';
      }
    });
  });
});

endTimes.forEach((end_time) => {
  end_time.addEventListener('click', function () {
    removeStartTimeDisables();
    let max = new Date(
      FORMAT_DATE + time_conv_map[end_time.textContent],
    ).getTime();
    let val = new Date(
      FORMAT_DATE + time_conv_map[startTimeInput.value],
    ).getTime();

    if (val >= max) {
      startTimeInput.value = '';
    }

    startTimes.forEach((start_time) => {
      let curr = new Date(
        FORMAT_DATE + time_conv_map[start_time.textContent],
      ).getTime();

      if (curr >= max) {
        start_time.style.display = 'none';
      }
    });
  });
});

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

function checkButton() {
  if (
    titleInput.value &&
    orgInput.value &&
    dateInput.value &&
    startTimeInput.value &&
    endTimeInput.value &&
    (bldgInput.value || roomInput.value) &&
    checkEmail(emailInput.value)
  ) {
    submit.removeAttribute('disabled');
  } else {
    submit.setAttribute('disabled', '');
  }
}

function updatePresetImage() {
  if (!fileDisplay.getAttribute('src').includes('data:')) {
    if (tag_arr.length == 0) {
      fileDisplay.setAttribute('src', '/static/images/fliers/social.png');
    } else {
      fileDisplay.setAttribute(
        'src',
        `/static/images/fliers/${tag_arr[0].toLowerCase()}.png`,
      );
    }
  }
}

tagEls.forEach((tag) => {
  tag.addEventListener('click', updatePresetImage);
});
