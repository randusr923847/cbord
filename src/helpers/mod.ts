import Mod from '../models/mod';
import { hash } from './crypto';

export async function checkMod(username: string): Promise<boolean> {
  const name_hash = hash(username);
  const result = await Mod.exists({ nameh: name_hash });
  return !!result;
}

async function addMod(username: string): Promise<boolean> {
  const name_hash = hash(username);

  await Mod.create({
    nameh: name_hash,
  });

  console.log('Mod added!');
  console.log(`Hash: ${name_hash}`);
  return true;
}

(async () => {
  if (process.argv.length > 2) {
    const username = process.argv[process.argv.length - 1];

    console.log(`Running for username: ${username}`);
    const result = await addMod(username);
    console.log(`Operation was a ${result ? 'success' : 'failure'}!`);
  }
})();
