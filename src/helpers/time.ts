function generateTimeList() {
  const times = [];
  let id = 0;
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const displayHr = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMin = minute.toString().padStart(2, '0');
      const tod = hour < 12 ? 'AM' : 'PM';
      times.push({
        id: id++,
        val: `${displayHr}:${displayMin} ${tod}`,
      });
    }
  }
  return times;
}

function timeReformat(time: string): string {
  const parts = time.split(' ');
  const tparts = parts[0].split(':');
  const tod = parts[1];

  const hr = parseInt(tparts[0]);
  let ret = '';

  if (tod == 'AM' && hr == 12) {
    ret += '00';
  } else if (tod == 'PM' && hr != 12) {
    ret += String(hr + 12).padStart(2, '0');
  } else {
    ret += String(hr).padStart(2, '0');
  }

  ret += ':' + tparts[1] + ':00';

  return ret;
}

// Adapted from: https://stackoverflow.com/a/64262840
function getOffset(timeZone: string): string {
  const timeZoneName = Intl.DateTimeFormat('ia', {
    timeZoneName: 'short',
    timeZone,
  })
    .formatToParts()
    .find((i) => i.type === 'timeZoneName')?.value;

  if (!timeZoneName) return '';

  const offset = timeZoneName.slice(3);
  if (!offset) return '';

  const offsetSplit = offset.split(':');
  const sign = offsetSplit[0][0];
  let ret = sign;
  const hr = parseInt(offsetSplit[0].slice(1));
  ret += String(hr).padStart(2, '0') + ':';

  if (offsetSplit.length > 1) {
    ret += offsetSplit[1];
  } else {
    ret += '00';
  }

  return ret;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const timeMap: { [index: string]: string } = {
  '1:00 AM': '01:00:00',
  '1:30 AM': '01:30:00',
  '1:00 PM': '13:00:00',
  '1:30 PM': '13:30:00',
  '2:00 AM': '02:00:00',
  '2:30 AM': '02:30:00',
  '2:00 PM': '14:00:00',
  '2:30 PM': '14:30:00',
  '3:00 AM': '03:00:00',
  '3:30 AM': '03:30:00',
  '3:00 PM': '15:00:00',
  '3:30 PM': '15:30:00',
  '4:00 AM': '04:00:00',
  '4:30 AM': '04:30:00',
  '4:00 PM': '16:00:00',
  '4:30 PM': '16:30:00',
  '5:00 AM': '05:00:00',
  '5:30 AM': '05:30:00',
  '5:00 PM': '17:00:00',
  '5:30 PM': '17:30:00',
  '6:00 AM': '06:00:00',
  '6:30 AM': '06:30:00',
  '6:00 PM': '18:00:00',
  '6:30 PM': '18:30:00',
  '7:00 AM': '07:00:00',
  '7:30 AM': '07:30:00',
  '7:00 PM': '19:00:00',
  '7:30 PM': '19:30:00',
  '8:00 AM': '08:00:00',
  '8:30 AM': '08:30:00',
  '8:00 PM': '20:00:00',
  '8:30 PM': '20:30:00',
  '9:00 AM': '09:00:00',
  '9:30 AM': '09:30:00',
  '9:00 PM': '21:00:00',
  '9:30 PM': '21:30:00',
  '10:00 AM': '10:00:00',
  '10:30 AM': '10:30:00',
  '10:00 PM': '22:00:00',
  '10:30 PM': '22:30:00',
  '11:00 AM': '11:00:00',
  '11:30 AM': '11:30:00',
  '11:00 PM': '23:00:00',
  '11:30 PM': '23:30:00',
  '12:00 AM': '00:00:00',
  '12:30 AM': '00:30:00',
  '12:00 PM': '12:00:00',
  '12:30 PM': '12:30:00',
};

const HOUR = 3600000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 4 * WEEK;

export {
  generateTimeList,
  timeReformat,
  getOffset,
  timeMap,
  HOUR,
  DAY,
  WEEK,
  MONTH,
};
