import { timeMap, getOffset } from './time';
import { tags as allowedTags, FILE_LIMIT, TZ } from './consts';
import Event from '../models/event';

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
  accepted: number;
  title: string;
  org: string;
  startTime: number;
  endTime: number;
  loc: string;
  description: string;
  tags: string[];
  email: string;
  image: string;
  submitTime: number;
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
  email?: string;
  submitted?: string;
}

type EventByDate = Record<string, CliEvent[]>;

function getImagePreset(tags: string[]): string {
  const base = '/static/images/fliers/';

  if (tags.length == 0) {
    return base + 'social.png';
  }

  return base + tags[0].toLowerCase() + '.png';
}

export function validateCreateReq(body: CreateBody): EventObj | string {
  if (!body.title || !body.org) {
    return 'No title or org name';
  }

  if (!body.date || !body.start || !body.end) {
    return 'No date or start/end time';
  }

  const offset = getOffset(TZ);
  const startDate = new Date(`${body.date}T${timeMap[body.start]}${offset}`);
  const endDate = new Date(`${body.date}T${timeMap[body.end]}${offset}`);

  if (!startDate) {
    return 'Invalid start datetime';
  }

  if (!endDate) {
    return 'Invalid end datetime';
  }

  if (startDate >= endDate) {
    return 'Invalid times';
  }

  let tags: string[] = [];

  if (body.tags) {
    tags = body.tags.filter((item) => allowedTags.includes(item)).slice(0, 3);
  }

  if (!body.bldg && !body.room) {
    return 'No location given';
  }

  let loc = body.bldg;

  if (loc && body.room) {
    loc += ' ' + body.room;
  } else if (!loc) {
    loc = body.room;
  }

  let image = '';

  if (body.image) {
    if (!body.image_type) {
      return 'No image type';
    }

    if (body.image.length > FILE_LIMIT + 500 * 1024) {
      return 'Image too big';
    }

    image = body.image_type + '|' + body.image;
  } else {
    image = getImagePreset(tags);
  }

  const ret: EventObj = {
    id: 'unset',
    accepted: 0,
    title: body.title,
    org: body.org,
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
    loc: loc,
    description: body.desc,
    tags: tags,
    email: body.email,
    image: image,
    submitTime: Date.now(),
  };

  return ret;
}

export function eventParser(
  data: EventObj,
  include_email = false,
  include_submit_time = false,
): CliEvent {
  const eventStart = new Date(data.startTime);
  const eventEnd = new Date(data.endTime);

  const start = toTZTimeString(eventStart);
  const end = toTZTimeString(eventEnd);
  const date = dateString(eventStart);

  let image = '';

  if (data.image.includes('|')) {
    image = `/api/event/img/${data.id}`;
  } else {
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
  };

  if (include_email) {
    event.email = data.email;
  }

  if (include_submit_time) {
    const subDate = new Date(data.submitTime);
    event.submitted = dateString(subDate) + ' ' + toTZTimeString(subDate);
  }

  return event;
}

export async function getEvents(limit: number): Promise<EventByDate> {
  const data = await Event.find({
    endTime: { $gt: Date.now() },
    accepted: 1,
  })
    .lean()
    .sort({ startTime: 1 })
    .limit(limit)
    .exec();

  const events = orderByDate(data as EventObj[]);

  return events;
}

export async function getAdminEvents(): Promise<CliEvent[]> {
  const data = await Event.find({
    startTime: { $gt: Date.now() },
    accepted: 0,
  })
    .lean()
    .sort({ startTime: 1 })
    .exec();

  const events: CliEvent[] = [];

  for (const datum of data) {
    const event = eventParser(datum as EventObj, true, true);
    events.push(event);
  }

  return events;
}

export function orderByDate(data: EventObj[]): EventByDate {
  const events: EventByDate = {};

  for (const datum of data) {
    const event = eventParser(datum);
    const eventDate = event.date;

    if (eventDate in events) {
      events[eventDate].push(event);
    } else {
      events[eventDate] = [event];
    }
  }

  return events;
}

function toTZTimeString(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  });
}

export function dateString(date: Date) {
  const curr = new Date().getFullYear();

  if (curr != date.getFullYear()) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: TZ,
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: TZ,
  });
}
