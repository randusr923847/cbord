interface Event {
  id: string;
  accepted: boolean;
  title: string;
  start: Date | string;
  end: Date | string;
  date?: string;
  loc: string;
  desc: string;
  tags: string[];
  image: string;
  org: string;
  email: string;
}

interface EventByDate {
  [key: string]: Event[];
}

export function eventParser(data: Event): Event {
  let event: Event = {
    id: data.id,
    accepted: data.accepted,
    title: data.title,
    start: data.start,
    end: data.end,
    date: data.date,
    loc: data.loc,
    desc: data.desc,
    tags: data.tags,
    image: data.image,
    org: data.org,
    email: data.email
  };

  const eventStart = new Date(convertTZ(new Date(data.start)));
  const eventEnd = new Date(convertTZ(new Date(data.end)));

  event.start = eventStart.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  event.end = eventEnd.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  event.date = dateString(eventStart);

  return event;
}

export function orderByDate(data: Event[]): EventByDate {
  let events: EventByDate = {};

  const today = new Date();
  const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
  const todayDate = dateString(today);
  const tomorrowDate = dateString(tomorrow);
  let prevDay = '';

  for (let i = 0; i < data.length; i++) {
    let event = eventParser(data[i]);
    let eventDate = event.date || '';

    if (eventDate != prevDay) {
      if (eventDate == todayDate) {
        if (eventDate in events) {
          events['Today'].push(event);
        } else {
          events['Today'] = [event];
        }
      } else if (eventDate == tomorrowDate) {
        if (eventDate in events) {
          events['Tomorrow'].push(event);
        } else {
          events['Tomorrow'] = [event];
        }
      } else {
        if (eventDate in events) {
          events[eventDate].push(event);
        } else {
          events[eventDate] = [event];
        }
      }

      prevDay = eventDate;
    }
  }

  return events;
}

function convertTZ(date: Date) {
  return date.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
}

function dateString(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}