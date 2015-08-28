;(function(){

// 使用visibility属性 实现占位
$.fn.vshow = function(){
  //return $(this).css('visibility', 'visible')
  return $(this).css({
    position: 'absolute',
    width: '100%',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0'
  })
}
$.fn.vhide = function(){
  //return $(this).css('visibility', 'hidden')
  return $(this).css({
    position: 'absolute',
    width: '100%',
    left: '-100%',
    right: '100%',
    top: '0',
    bottom: '0'
  })
}

var isDev = /[\?&]dev/.test(location.search)
var isTouch = 'ontouchmove' in document

var current = 0 // 当前页码
var total // 总页数
var opt // 自定义选项
var $main, $secs
var loaded = []

var ppt = window.ppt = {}
ppt.setup = setup

function setup(options) {
  opt = options
  $.ajax({
    type: 'GET',
    url: opt.url,
    error: function(err){
      // todo: 404
      console.error('load:', err)
    },
    success: function(text){
      text = text.trim() // 移除前后的空白/异常字符
      load(transfer(text))
    }
  })
}

function transfer(text) {
  var out = marked(text)
  var $root = $('<root>').append(out)
  var $children = $root.children()
  var $tmp = $('<tmp>')
  var $list = $('<main>').appendTo($tmp)
  var $inner

  // 暂时的一个hack
  // 如果末尾是一个hr，则视作hrOnly分页
  // 适用于专门的ppt-md 稍后给出sample
  var hrOnly = $children.last().is('hr')
  var pageBreak = hrOnly ? 'hr' :
    'h1, h2, h3, h4, h5, h6, hr'

  startEach()
  $children.each(function(i, el){
    var $el = $(el)
    if ($el.is(pageBreak)) {
      endEach()
      startEach()
      if ($el.is('hr')) return
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

function load(html) {
  $main = $(html).addClass(opt.theme)
  onload()

  // 提取并设置title
  var title = $main.find('h1, p').first().text() || ' '
  document.title = title

  // 添加箭头提示
  $('<div>').addClass('arrow bottom').appendTo($main)
}

function onload() {
  $main.prependTo('body')
  hljs.initHighlighting()

  $secs = $main.find('section')
  total = $secs.length

  $(window).on('resize', layout)
  style() // 装饰
  //jump(hashPage()) // 显示首页
  //jump(1) // 显示首页
  jump(isDev ? hashPage() : 1) // dev模式则锁定页码

  // 侦听键盘事件 前后页切换
  // 浏览器默认退格键为历史返回
  $(document).on('keydown', function(e){
    var code = e.keyCode
    if (code === 40 || code === 39 ||
      code === 32 || code === 13) { // 右/下/空格/回车 前进
      go(1)
    }
    else if (code === 37 || code === 38) { // 左/上 后退
      go(-1)
    }
  })

  // 侦听鼠标滚轮事件 前后页切换
  // fixme: 防止mac触摸板过度灵敏 需改进
  var lastWheel = -1
  $(document).on('mousewheel', function(e){
    if (e.ctrlKey) return // 忽略滚轮缩放
    if (Date.now() - lastWheel < 500) return
    lastWheel = Date.now()
    var delta = (e.originalEvent || e).wheelDelta
    if (delta < -3) { // 右/下 前进
      go(1)
    }
    else if (delta > 3) { // 左/上 后退
      go(-1)
    }
  })

  // 侦听lcoation.hash改变
  window.addEventListener('hashchange', function(){
    //console.log('on hash:', location.hash)
    jump(hashPage())
  })

  if (isTouch) {
    // 侦听swipe事件 前后页切换
    var mc = new Hammer($main.get(0))
    mc.get('swipe').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 5,
      velocity: 0.01
    })
    mc.on('swipeup swipedown', function(e){
      if (e.type === 'swipeup') {
        go(1)
      } else if (e.type === 'swipedown') {
        go(-1)
      }
    })
  }
}

function style() {
  $secs.each(function(i, sec){ // 每页随机着色
    var hsv = randomColor({
      luminosity: opt.theme,
      hue: opt.color,
      format: 'hsvArray'
    })
    if (opt.theme === 'dark') {
      hsv[2] = Math.min(hsv[2], 40)
    }
    if (opt.theme === 'bright') {
      hsv[2] = Math.min(hsv[2], 80)
    }
    var rgb = HSVtoRGB(hsv)
    console.log(rgb)
    $(sec).css({
      'background-color': 'rgb('+ rgb.join(',') +')'
    })
  })
}

function layout(page) {
  var $sec = $secs.eq(page - 1)
  var W = window.innerWidth
  var H = window.innerHeight
  if (W <= H) { // 竖屏
    var $div = $sec.children('div')
    var h = $div.outerHeight()
    $div.css({
      'position': 'absolute',
      'padding-left': '10%',
      'padding-right': '10%',
      'top': 100*.45 + '%',
      'margin-top': (-h/2) + 'px'
    })
    if (h > (H-20)/(1.5-.45)) { // 内容高度超出范围 需缩放
      $div.css({
        'top': '0',
        'margin-top': '0',
        '-webkit-transform': 'scale('+ (H-20)/h +')',
        'transform': 'scale('+ (H-20)/h +')'
      })
    }
  }
  else { // 横屏
    var $div = $sec.children('div')
    var h = $div.outerHeight()
    $div.css({
      'position': 'absolute',
      'padding-left': '20%',
      'padding-right': '20%',
      'top': 100*.47 + '%',
      'margin-top': (-h/2) + 'px'
    })
    if (h > (H-20)/(1.5-.47)) { // 内容高度超出范围 需缩放
      $div.css({
        'top': '0',
        'margin-top': '0',
        '-webkit-transform': 'scale('+ (H-20)/h +')',
        'transform': 'scale('+ (H-20)/h +')'
      })
    }
  }
}

function go(step) {
  jump(current + step)
}
function jump(page) {
  if (!loaded[page]) {
    $secs.eq(page - 1).waitForImages(function(){
      loaded[page] = true
      layout(page) // 布局
      layout(page) // hack再次调用生效
      jump(page)
    })
    return
  }
  //console.log('jump:', current, page)
  page = Math.max(1, Math.min(page, total))
  if (page === current) return
  hashPage(page)
  clear() // 清除全部
  slide(page) // 显示下一页
  current = page
}
function hashPage(page){
  if (arguments.length <= 0) {
    return parseInt(location.hash.substr(1)) || 1
  }
  location.hash = '' + page
  //console.log('set hash:', location.hash)
}

function clear() {
  $secs.vhide().css('z-index', 0)
    .removeClass([
      'slideInUp', 'slideInDown',
      'slideOutUp', 'slideOutDown',
      'animated',
      ].join(' '))
}
function slide(page) {
  var dir = page > current ? 'Up' : 'Down'
  var $next = $secs.eq(page - 1)
  var $prev = $secs.eq(current -1)
  $next.css('z-index', 2)
    .addClass([
      'slideIn' + dir, 'animated'
      ].join(' ')).vshow()
  if (current > 0) {
    $prev.css('z-index', 3)
      .addClass([
        'slideOut' + dir, 'animated'
        ].join(' ')).vshow()
  }
}


function HSVtoRGB (hsv) {

  // this doesn't work for the values of 0 and 360
  // here's the hacky fix
  var h = hsv[0];
  if (h === 0) {h = 1}
  if (h === 360) {h = 359}

  // Rebase the h,s,v values
  h = h/360;
  var s = hsv[1]/100,
      v = hsv[2]/100;

  var h_i = Math.floor(h*6),
    f = h * 6 - h_i,
    p = v * (1 - s),
    q = v * (1 - f*s),
    t = v * (1 - (1 - f)*s),
    r = 256,
    g = 256,
    b = 256;

  switch(h_i) {
    case 0: r = v, g = t, b = p;  break;
    case 1: r = q, g = v, b = p;  break;
    case 2: r = p, g = v, b = t;  break;
    case 3: r = p, g = q, b = v;  break;
    case 4: r = t, g = p, b = v;  break;
    case 5: r = v, g = p, b = q;  break;
  }
  var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
  return result;
}

})();
