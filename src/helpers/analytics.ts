import { Request } from 'express';
import View from '../models/analytics';
import { hash } from './crypto';
import { lookup } from 'ip-location-api';
import { TZ } from './consts';
import '../types/session';

interface ViewObject {
  page: string[];
  iph: string;
  ua: string;
  loc: string;
  sid: string;
  tss: number[];
  delay: number[];
}

export function trackRoute(req: Request) {
  req.session.route = req.url;
  req.session.ts = Date.now();
}

export async function countView(req: Request, api = false): Promise<boolean> {
  const curr_ts = Date.now();
  const route = api ? `/api/.${req.url}` : req.session.route;
  const call_ts = api ? curr_ts + 1 : req.session.ts;

  if (route && call_ts) {
    const call_delay = curr_ts - call_ts;
    if (await View.exists({ sid: req.session.id })) {
      const view = await View.findOne({ sid: req.session.id });

      if (view) {
        const page = view.page;
        const tss = view.tss;
        const delay = view.delay;
        page.push(route);
        tss.push(curr_ts);
        delay.push(call_delay);

        const res = await View.updateOne(
          { sid: req.session.id },
          { page: page, tss: tss, delay: delay },
        );

        if (res.modifiedCount != 1) {
          console.log('Something went wrong updating analytics view count.');
        }
      }
    } else {
      const page = [route];
      const ips =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'];

      let ip = 'na';

      if (!ips) {
        ip = req.connection.remoteAddress || ip;
      } else if (typeof ips === 'string') {
        ip = ips.split(',')[0].trim();
      } else {
        ip = ips[0].trim();
      }

      console.log(`IP ADDR: ${ip}`);

      const iph = hash(ip);
      const ua = req.headers['user-agent'] || 'unknown';
      let loc = 'unknown';

      if (ip != 'na') {
        const loc_data = await lookup(ip);

        if (loc_data) {
          loc = `${loc_data.city || ''}-${loc_data.region1_name || ''}-${
            loc_data.country || ''
          }`;
        }
      }

      console.log(`LOC: ${loc}`);

      const sid = req.session.id;
      const tss = [curr_ts];
      const delay = [call_delay];

      const obj: ViewObject = {
        page: page,
        iph: iph,
        ua: ua,
        loc: loc,
        sid: sid,
        tss: tss,
        delay: delay,
      };

      await View.create(obj);
    }

    if (!api) {
      req.session.route = undefined;
      req.session.ts = undefined;
    }
  }

  return true;
}

function toDateTimeString(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  });
}

function truncTime(time: number, bin: number): number {
  return Math.floor(time / bin) * bin;
}

export async function getUniqueViewers(
  min_time: number,
  bin: number,
): Promise<Record<string, number>> {
  const data = await View.find().lean().sort({ 'tss.0': 1 }).exec();

  const start = Math.max(data[0].tss[0], min_time);

  let end = start;

  for (const view of data) {
    const last = view.tss.slice(-1)[0];
    if (last > end) {
      end = last;
    }
  }

  const startTimeHr = truncTime(start, bin);
  const endTimeHr = truncTime(end, bin);

  const hours: Record<string, number> = {};

  for (let t = startTimeHr; t <= endTimeHr; t += bin) {
    const hr = toDateTimeString(new Date(t));
    hours[hr] = 0;
  }

  for (const view of data) {
    let last = '';
    for (let i = 0; i < view.tss.length; i++) {
      if (!view.page[i].includes('api')) {
        const ts = view.tss[i];

        if (ts >= min_time) {
          const hr = toDateTimeString(new Date(truncTime(ts, bin)));
          if (hr != last) {
            hours[hr] += 1;
            last = hr;
          }
        }
      }
    }
  }

  return hours;
}
