#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { VERSION } from '@oracle-fury/core';

const program = new Command();

program
  .name('oracle-fury')
  .description('CLI tools for Oracle Fury content creation')
  .version(VERSION);

program
  .command('validate')
  .description('Validate module files')
  .argument('<path>', 'Path to module or event file')
  .action((path) => {
    console.log(chalk.blue('Validating:'), path);
    console.log(chalk.yellow('Validation not yet implemented'));
  });

program
  .command('lint')
  .description('Lint event files')
  .argument('<path>', 'Path to event file or directory')
  .action((path) => {
    console.log(chalk.blue('Linting:'), path);
    console.log(chalk.yellow('Linting not yet implemented'));
  });

program
  .command('preview')
  .description('Preview event rolls with specific seed')
  .argument('<event>', 'Event ID to preview')
  .option('-s, --seed <seed>', 'Random seed to use', 'test-seed')
  .action((event, options) => {
    console.log(chalk.blue('Previewing event:'), event);
    console.log(chalk.gray('Seed:'), options.seed);
    console.log(chalk.yellow('Preview not yet implemented'));
  });

program.parse();