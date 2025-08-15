#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'node:fs';
import { parseEventTable } from '@oracle-fury/core';
import { validateEventTable } from './lib/validate';
import { previewRolls } from './lib/preview';

const program = new Command();
program.name('ofury').description('Oracle Fury tools CLI').version('0.1.0');

program
  .command('validate <file>')
  .description('Validate an event table JSON/YAML file')
  .action((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    const obj = parseEventTable(raw);
    const res = validateEventTable(obj);
    if (res.valid) {
      console.log('OK');
    } else {
      console.error('Invalid:', res.errors?.join('\n'));
      process.exitCode = 1;
    }
  });

program
  .command('preview-rolls')
  .description('Preview RNG outputs for a seed')
  .option('-s, --seed <seed>', 'seed value', '0')
  .option('-n, --count <count>', 'number of rolls', '5')
  .action((opts) => {
    const rolls = previewRolls(opts.seed, parseInt(opts.count, 10));
    console.log(JSON.stringify(rolls));
  });

program.parse(process.argv);