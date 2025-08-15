import yaml from 'js-yaml';
import { validateEvent } from '../schemas';
export function loadEventTableFromString(id, content, format) {
    const raw = format === 'yaml' ? yaml.load(content) : JSON.parse(content);
    const events = Array.isArray(raw) ? raw : raw.events;
    if (!Array.isArray(events))
        throw new Error('Invalid event table: expected array or {events:[]}');
    const validated = [];
    for (const e of events) {
        const ok = validateEvent(e);
        if (!ok) {
            throw new Error(`Invalid event entry: ${JSON.stringify(validateEvent.errors)}`);
        }
        validated.push(e);
    }
    return { id, events: validated };
}
//# sourceMappingURL=loader.js.map