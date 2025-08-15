import yaml from 'js-yaml';
import { EventEntry, EventTable } from './index';
import { validateEvent } from '../schemas';

export function loadEventTableFromString(id: string, content: string, format: 'json' | 'yaml'): EventTable {
  const raw = format === 'yaml' ? (yaml.load(content) as any) : (JSON.parse(content) as any);
  const events: EventEntry[] = Array.isArray(raw) ? raw : raw.events;
  if (!Array.isArray(events)) throw new Error('Invalid event table: expected array or {events:[]}');
  const validated: EventEntry[] = [];
  for (const e of events) {
    const ok = validateEvent(e);
    if (!ok) {
      throw new Error(`Invalid event entry: ${JSON.stringify(validateEvent.errors)}`);
    }
    validated.push(e as EventEntry);
  }
  return { id, events: validated };
}