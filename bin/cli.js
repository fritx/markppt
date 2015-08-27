#!/usr/bin/env node
//var path = require('path')
var minimist = require('minimist')
var markppt = require('../')

var args = minimist(process.argv.slice(2))
var file = args._[0]

if (!file) {
  console.error('filename required.')
  return
}

// 读取markppt.json自定义配置
/*var cfg = path.resolve(file, '../markppt.json')
try {
  var opt = require(cfg)
} catch(e) {
  var opt = {}
}
markppt.build(file, opt)*/

// todo: 更多选项及较好的传递方式
markppt.build(file, {
  color: args['color'],
  theme: args['theme']
})
