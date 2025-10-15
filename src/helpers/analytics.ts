import { Request } from 'express';
import View from '../models/analytics';
import { hash } from './crypto';
import { lookup } from 'ip-location-api';
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
