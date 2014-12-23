#!/usr/bin/env node
/*eslint-disable no-process-exit*/
'use strict';
var badger = require('../');
var argv = require('yargs')
  .usage('Usage: $0 -f <input file> -o <output dir>')
  .describe('f','input file')
  .default('f','cobertura-coverage.xml')
  .describe('o','output directory')
  .default('o','.')
  .argv;
badger(argv.f,argv.o,function(err){
  if(err){
    console.error(err);
    return process.exit(1);
  }
  process.exit();
});
