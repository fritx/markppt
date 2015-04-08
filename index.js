var marked = require('marked')
//var cheerio = require('cheerio')
var domino = require('domino')
var Zepto = require('zepto-node')
var fs = require('fs-extra')
var path = require('path')

exports.transfer = transfer
exports.build = build

function build(src) {
  var basename = path.basename(src)
  var text = fs.readFileSync(src).toString()
  text = text.trim() // 移除前后的空白/异常字符
  var out = transfer(text)
  out = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width">',
    '<link rel="stylesheet" href="ppt_/animate.min.css">',
    '<link rel="stylesheet" href="ppt_/ppt.css">',
    out,
    '<script src="ppt_/jquery.min.js"></script>',
    '<script src="ppt_/ppt.js"></script>'
  ].join('\n')

  var dir = path.dirname(src)
  fs.copySync(path.resolve(__dirname, 'web'), dir)
  fs.writeFileSync(path.resolve(dir, basename + '.html'), out)
}

// 使用cheerio 但是中文在html中转义 不可读
/*
function transfer(text) {
  var out = marked(text)
  var $ = cheerio.load(out)

  var $tmp = $('<tmp>').append('<div>')
  var $list = $tmp.find('div')

  $.root().children('h1,h2,h3,h4,h5,h6')
    .each(function(i, el){
      var $el = $(el)
      var $cur = $('<section>').append('<div>')
      var $inner = $cur.find('div')
      $inner.append($el.clone())
      $inner.append(
        $el.nextUntil('h1,h2,h3,h4,h5,h6').clone()
        )
      $list.append($cur)
    })

  return $tmp.html()
}
*/

// 使用zepto-node 速度较cheerio慢
function transfer(text) {
  var out = marked(text)
  var window = domino.createWindow()
  var $ = Zepto(window)
  var $root = $('<root>').append(out)

  var $tmp = $('<tmp>')
  var $list = $('<div>').appendTo($tmp)
  var $inner

  var children = $root.children()
  startEach()
  children.each(function(i, el){
    var $el = $(el)
    if ($el.is('h1') || $el.is('h2') || $el.is('h3') ||
      $el.is('h4') || $el.is('h5') || $el.is('h6')) {
      endEach()
      startEach()
    }
    $el.appendTo($inner)
  })
  endEach()

  return $tmp.html()

  function startEach(){
    $inner = $('<div>')
  }
  function endEach(){
    if ($inner.children().length < 1) return
    $('<section>').append($inner).appendTo($list)
  }
}
