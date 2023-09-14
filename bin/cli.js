#!/usr/bin/env node
var minimist = require('minimist')
var markppt = require('../')

var args = minimist(process.argv.slice(2))
var file = args._[0]

if (!file) {
  console.error('filename required.')
  return
}

// todo: 更多选项及较好的传递方式
markppt.build(file, {
  arbitrary: args['arbitrary'],
  color: args['color'],
  theme: args['theme']
})
