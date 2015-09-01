var fs = require('fs-extra')
var path = require('path')
var Handlebars = require('handlebars')

exports.build = build

function build (file, opt) {
  if (!opt.theme) opt.theme = 'dark'

  var basename = path.basename(file) // => index.md
  var baseseg = basename.split('.')[0] // => index
  opt.url = basename

  var source = fs.readFileSync(path.join(__dirname, './web/ppt.hbs'), {encoding: 'utf8'})
  var template = Handlebars.compile(source, {noEscape: true})
  var out = template({'opt': JSON.stringify(opt)})

  var dir = path.dirname(file)
  fs.copySync(path.resolve(__dirname, 'web', 'ppt_'), path.resolve(dir, 'ppt_'))
  fs.writeFileSync(path.resolve(dir, baseseg + '.html'), out) // => index.html
}
