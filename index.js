var fs = require('fs-extra')
var path = require('path')

exports.build = build

function build(file, opt) {
  if (!opt.theme) opt.theme = 'dark'
  if (!opt.pageBreak) {
    opt.pageBreak = [
      'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ]
  }

  var basename = path.basename(file)
  opt.url = basename
  var out = [
  '<!doctype html>',
  '<html>',
  '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width">',
    '<link rel="stylesheet" href="ppt_/animate.min.css">',
    '<link rel="stylesheet" href="ppt_/ppt.css">',
  '</head>',
  '<body>',
    '<script src="ppt_/marked.min.js"></script>',
    '<script src="ppt_/hammer.min.js"></script>',
    '<script src="ppt_/jquery.min.js"></script>',
    '<script src="ppt_/ppt.js"></script>',
    '<script>ppt.setup('+ JSON.stringify(opt) +')</script>',
  '</body>',
  '</html>'
  ].join('\n')

  var dir = path.dirname(file)
  fs.copySync(path.resolve(__dirname, 'web'), dir)
  fs.writeFileSync(path.resolve(dir, basename + '.html'), out)
}
