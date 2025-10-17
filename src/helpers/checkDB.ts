import Event from '../models/event';
import { EventObj } from './event';

import View from '../models/analytics';

async function checkEvent(id: string): Promise<boolean> {
  const result = await Event.find({
    id: id,
  })
    .lean()
    .exec();

  console.log(result as EventObj[]);
  return true;
}

async function checkViews() {
  const result = await View.find().lean().exec();

  console.log(result);
}

(async () => {
  if (process.argv.length > 2) {
    const id = process.argv[process.argv.length - 1];

    console.log(`Running for id: ${id}`);
    const result = await checkEvent(id);
    console.log(`Operation was a ${result ? 'success' : 'failure'}!`);
  } else {
    console.log('Checking views');
    await checkViews();
  }
})();
