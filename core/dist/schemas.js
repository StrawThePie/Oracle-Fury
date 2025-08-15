import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import characterSchema from '../schemas/character.schema.json';
import factionSchema from '../schemas/faction.schema.json';
import relationshipSchema from '../schemas/relationship.schema.json';
import worldStateSchema from '../schemas/worldState.schema.json';
import eventSchema from '../schemas/event.schema.json';
import savegameSchema from '../schemas/savegame.schema.json';
import moduleSchema from '../schemas/module.schema.json';
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
export const validateCharacter = ajv.compile(characterSchema);
export const validateFaction = ajv.compile(factionSchema);
export const validateRelationship = ajv.compile(relationshipSchema);
export const validateWorldState = ajv.compile(worldStateSchema);
export const validateEvent = ajv.compile(eventSchema);
export const validateSavegame = ajv.compile(savegameSchema);
export const validateModule = ajv.compile(moduleSchema);
//# sourceMappingURL=schemas.js.map