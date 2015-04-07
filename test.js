var markppt = require('./')
var assert = require('assert')
var fs = require('fs-extra')

describe('markppt', function(){

  before(function(){
    try {
      fs.removeSync('./tmp')
      fs.mkdirSync('./tmp')
    } catch(e) {
      throw e
      // ignore
    }
  })

  it('should transfer markdown to html', function(){

    var src = fs.readFileSync('./examples/mytalk/talk.md').toString()
    var out = markppt.transfer(src)
    assert.equal(out, '<div><section><div><h1 id="talk">Talk</h1><p><em>Date</em></p></div></section><section><div><h2 id="heading-1">Heading 1</h2><p>Paragraph 1</p><p>Paragraph 1-1</p></div></section><section><div><h2 id="heading-2">Heading 2</h2><p><img src="Desert.jpg" alt="Desert"></p><p>Paragraph 2</p></div></section><section><div><h2 id="heading-3">Heading 3</h2><p>Paragraph 3</p><ul>\n\
<li>Item 3-1</li>\n\
<li>Item 3-2</li>\n\
<li>Item 3-3</li>\n\
</ul></div></section></div>')

  })

  it('should build markdown to ppt html', function(){

    fs.copySync('./examples/mytalk', './tmp/mytalk')
    markppt.build('./tmp/mytalk/talk.md')
    var out = fs.readFileSync('./tmp/mytalk/talk.md.html').toString()
    assert.equal(out, '<meta charset="utf-8">\n\
<meta name="viewport" content="width=device-width">\n\
<link rel="stylesheet" href="_ppt/animate.min.css">\n\
<link rel="stylesheet" href="_ppt/ppt.css">\n\
<div><section><div><h1 id="talk">Talk</h1><p><em>Date</em></p></div></section><section><div><h2 id="heading-1">Heading 1</h2><p>Paragraph 1</p><p>Paragraph 1-1</p></div></section><section><div><h2 id="heading-2">Heading 2</h2><p><img src="Desert.jpg" alt="Desert"></p><p>Paragraph 2</p></div></section><section><div><h2 id="heading-3">Heading 3</h2><p>Paragraph 3</p><ul>\n\
<li>Item 3-1</li>\n\
<li>Item 3-2</li>\n\
<li>Item 3-3</li>\n\
</ul></div></section></div>\n\
<script src="_ppt/jquery.min.js"></script>\n\
<script src="_ppt/ppt.js"></script>')

  })
  
})
