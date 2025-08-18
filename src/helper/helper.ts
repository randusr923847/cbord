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

export function eventParser(data: Event): Event {
  let event = {
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

  const eventStart = new Date(dateString(new Date(data.start)));
  const eventEnd = new Date(dateString(new Date(data.end)));

  event.start = eventStart.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  event.end = eventEnd.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  event.date = eventStart.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return event;
}

function dateString(date: Date) {
  return date.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
}