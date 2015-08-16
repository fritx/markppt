#!/usr/bin/env node
var path = require('path')
var markppt = require('../')
var file = process.argv[2]

if (!file) {
  console.error('filename required.')
  return
}

// 读取markppt.json自定义配置
var cfg = path.resolve(file, '../markppt.json')
try {
  var opt = require(cfg)
} catch(e) {
  var opt = {}
}
markppt.build(file, opt)
