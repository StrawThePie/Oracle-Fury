#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { SeededRandom } from '@oracle-fury/core';
function loadFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
        return yaml.load(content);
    }
    return JSON.parse(content);
}
function getSchema(schemaName) {
    const schemaPath = path.resolve(__dirname, '../../core/schemas', schemaName);
    return JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
}
async function validateCmd(file, schema) {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const schemaObj = getSchema(schema);
    const data = loadFile(file);
    const validate = ajv.compile(schemaObj);
    const ok = validate(data);
    if (!ok) {
        console.error('Validation errors:', validate.errors);
        process.exit(1);
    }
    console.log('OK');
}
async function previewRolls(seed, expr, times) {
    const rng = new SeededRandom(seed);
    for (let i = 0; i < times; i++) {
        const v = Math.floor(rng.random() * 1000);
        console.log(i + 1, v);
    }
}
async function main() {
    const [cmd, ...rest] = process.argv.slice(2);
    if (cmd === 'validate') {
        const file = rest[0];
        const schema = rest[1];
        if (!file || !schema) {
            console.error('Usage: ofury validate <file.json|yaml> <schema.json>');
            process.exit(1);
        }
        await validateCmd(file, schema);
        return;
    }
    if (cmd === 'preview-rolls') {
        const seed = Number(rest[0] ?? 0);
        const expr = String(rest[1] ?? '');
        const times = Number(rest[2] ?? 10);
        await previewRolls(seed, expr, times);
        return;
    }
    console.error('Commands: validate, preview-rolls');
    process.exit(1);
}
main();
//# sourceMappingURL=cli.js.map