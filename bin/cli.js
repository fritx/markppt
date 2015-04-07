#!/usr/bin/env node
var markppt = require('../')
var file = process.argv[2]

if (!file) {
  console.error('filename required.')
  return
}
markppt.build(file)
