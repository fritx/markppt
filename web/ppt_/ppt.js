;(function(){

// 使用visibility属性 实现占位
$.fn.vshow = function(){
  return $(this).css('visibility', 'visible')
}
$.fn.vhide = function(){
  return $(this).css('visibility', 'hidden')
}

var current // 当前页索引
var $secs
var ppt = window.ppt = {}
ppt.load = load

function load(url) {
  $.ajax({
    type: 'GET',
    url: url,
    error: function(err){
      // todo: 404
      console.error('load:', err)
    },
    success: function(text){
      text = text.trim() // 移除前后的空白/异常字符
      init(transfer(text))
    }
  })
}

function transfer(text) {
  var out = marked(text)
  var $root = $('<root>').append(out)
  var $tmp = $('<tmp>')
  var $list = $('<main>').appendTo($tmp)
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

function init(html) {
  var $main = $(html)
  var $imgs = $main.find('img')
  var numimg = $imgs.length
  if (numimg > 0) {
    var numload = 0
    $imgs.on('load', function(){
      // 所有图片加载后 即可调整布局
      if (++numload >= numimg) onload()
    })
  } else {
    onload()
  }

  // 侦听键盘事件 前后页切换  
  $(document).on('keydown', function(e){
    var code = e.keyCode
    if (code === 40 || code === 39) { // 右/下 前进
      go(1)
    }
    else if (code === 37 || code === 38) { // 左/上 后退
      go(-1)
    }
  })

  function onload() {
    current = 0
    $main.prependTo('body')
    $secs = $('section')
    $(window).on('resize', layout)
    style() // 装饰
    layout() // 布局
    layout() // hack 再次调用
    clear() // 清除全部
    show(0) // 显示首页
  }
}

function style() {
  var max = 255
  var range = 30
  $secs.each(function(i, sec){ // 每页随机着浅色
    var colors = [
      max - (Math.random()*range | 0),
      max - (Math.random()*range | 0),
      max - (Math.random()*range | 0)
    ]
    $(sec).css({
      'background-color': 'rgb('+ colors.join(',') +')'
    })
  })
}

function layout() {
  var W = window.innerWidth
  var H = window.innerHeight
  if (W <= H) { // 横屏
    $secs.each(function(i, sec){
      var $div = $(sec).children('div')
      var h = $div.height()
      $div.css({
        'position': 'absolute',
        'padding': '0 10%',
        'top': 100*.45 + '%',
        'margin-top': (-h/2) + 'px'
      })
      if (h > H/(1.5-.45)) { // 内容高度超出范围 需缩放
        $div.css({
          'top': 100*.5 + '%',
          '-webkit-transform': 'scale('+ H/h +')',
          '-moz-transform': 'scale('+ H/h +')',
          '-ms-transform': 'scale('+ H/h +')',
          '-o-transform': 'scale('+ H/h +')',
          'transform': 'scale('+ H/h +')'
        })
      }
    })
  }
  else { // 竖屏
    $secs.each(function(i, sec){
      var $div = $(sec).children('div')
      var h = $div.height()
      $div.css({
        'position': 'absolute',
        'padding': '0 20%',
        'top': 100*.47 + '%',
        'margin-top': (-h/2) + 'px'
      })
      if (h > H/(1.5-.47)) { // 内容高度超出范围 需缩放
        $div.css({
          'top': 100*.5 + '%',
          '-webkit-transform': 'scale('+ H/h +')',
          '-moz-transform': 'scale('+ H/h +')',
          '-ms-transform': 'scale('+ H/h +')',
          '-o-transform': 'scale('+ H/h +')',
          'transform': 'scale('+ H/h +')'
        })
      }
    })
  }
}

function go(step) {
  var next = current + step
  if (next < 0 || next >= $secs.length) {
    return
  }
  clear() // 清除全部
  show(next) // 显示下一页
  hide(current) // 隐藏当前页
  current = next
}
function clear() {
  $secs.vhide().css('z-index', 0).removeClass('animated zoomInUp zoomOutDown')
}
function show(index) {
  $secs.eq(index).css('z-index', 2).addClass('animated zoomInUp').vshow()
}
function hide(index) {
  $secs.eq(index).css('z-index', 3).addClass('animated zoomOutDown').vshow()
}

})();
