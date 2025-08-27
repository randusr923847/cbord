import { createHash, randomBytes } from 'crypto';

export function newState(): string {
  return randomBytes(32).toString('hex');
}

export function hash(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}
