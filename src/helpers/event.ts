import { timeMap, getOffset } from './time';
import { tags as allowedTags, FILE_LIMIT, TZ } from './consts';

interface CreateBody {
  title: string;
  org: string;
  date: string;
  start: string;
  end: string;
  bldg: string;
  room: string;
  email: string;
  desc: string;
  tags: string[];
  image_type?: string;
  image?: string;
}

export interface EventObj {
  id: string;
  accepted: boolean;
  title: string;
  org: string;
  startTime: number;
  endTime: number;
  loc: string;
  description: string;
  tags: string[];
  email: string;
  image: string;
}

interface CliEvent {
  id: string;
  title: string;
  org: string;
  start: string;
  end: string;
  date: string;
  loc: string;
  desc: string;
  tags: string[];
  image: string;
}

type EventByDate = Record<string, CliEvent[]>;

export function validateCreateReq(body: CreateBody): EventObj | string {
  if (!body.title || !body.org) {
    return "No title or org name";
  }

  if (!body.date || !body.start || !body.end) {
    return "No date or start/end time";
  }

  const offset = getOffset(TZ);
  const startDate = new Date(`${body.date}T${timeMap[body.start]}${offset}`);
  const endDate = new Date(`${body.date}T${timeMap[body.end]}${offset}`);

  if (!startDate) {
    return "Invalid start datetime";
  }

  if (!endDate) {
    return "Invalid end datetime";
  }

  if (startDate >= endDate) {
    return "Invalid times";
  }

  let tags: string[] = [];

  if (body.tags) {
    tags = body.tags.filter(item => allowedTags.includes(item)).slice(0, 3);
  }

  if (!body.bldg && !body.room) {
    return "No location given";
  }

  let loc = body.bldg;

  if (loc && body.room) {
    loc += " " + body.room;
  }
  else if (!loc) {
    loc = body.room;
  }

  let image = "";

  if (body.image) {
    if (!body.image_type) {
      return "No image type";
    }

    if (body.image.length > FILE_LIMIT) {
      return "Image too big";
    }

    image = body.image_type + "|" + body.image;
  }
  else {
    image = "/static/images/test_flier.jpg";
  }

  const ret: EventObj = {
    id: "unset",
    accepted: false,
    title: body.title,
    org: body.org,
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
    loc: loc,
    description: body.desc,
    tags: tags,
    email: body.email,
    image: image
  };

  return ret;
}

export function eventParser(data: EventObj): CliEvent {
  const eventStart = new Date(convertTZ(new Date(data.startTime)));
  const eventEnd = new Date(convertTZ(new Date(data.endTime)));

  const start = eventStart.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const end = eventEnd.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const date = dateString(eventStart);

  let image = "";

  if (data.image.includes("|")) {
    image = `/api/event/img/${data.id}`;
  }
  else {
    image = data.image;
  }

  const event: CliEvent = {
    id: data.id,
    title: data.title,
    org: data.org,
    start: start,
    end: end,
    date: date,
    loc: data.loc,
    desc: data.description,
    tags: data.tags,
    image: image,
  }

  return event;
}

export function orderByDate(data: EventObj[]): EventByDate {
  const events: EventByDate = {};

  const today = new Date();
  const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
  const todayDate = dateString(today);
  const tomorrowDate = dateString(tomorrow);
  let prevDay = '';

  for (const datum of data) {
    const event = eventParser(datum);
    const eventDate = event.date || '';

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
  return date.toLocaleDateString('en-US', { timeZone: TZ });
}

function dateString(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
