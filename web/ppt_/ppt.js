;(function(){

// 使用visibility属性 实现占位
$.fn.vshow = function(){
  return $(this).css('visibility', 'visible')
}
$.fn.vhide = function(){
  return $(this).css('visibility', 'hidden')
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

function onerror(err) {
  console.error('ppt onerror', err)
  let searchParams = new URLSearchParams()
  searchParams.set('url', 'ppt_/oops.md')
  location.search = searchParams.toString()
}

function setup(options) {
  opt = options
  var url = opt.url
  if (opt.arbitrary) {
    url = new URL(location.href).searchParams.get('url') || url
  }
  $.ajax({
    type: 'GET',
    url: url,
    error: function(err){
      onerror(err)
    },
    success: function(text){
      text = text.trim() // 移除前后的空白/异常字符
      var worker
      if (opt.arbitrary) {
        // xxx: hacking `<base>` sequence
        worker = new Worker('ppt_/censorship.worker.js')
        $('img').each(function (i, el) {
          $(el).attr('src', el.src)
        })
        var iconHref
        $('link[rel*=icon]').each(function (i, el) {
          $(el).attr('href', el.href)
          iconHref = el.href
        })
        $('meta[name*=Image]').each(function (i, el) {
          $(el).attr('content', iconHref)
        })
        $('<base>').attr('href', url).appendTo('head')
      }
      load(transfer(text))
      if (opt.arbitrary) {
        console.log(new Date(), 'cencorship start')
        worker.onmessage = function (e) {
          var legal = e.data
          console.log(new Date(), 'cencorship result:', legal)
          if (!legal) onerror(new Error('Illegal content.'))
        }
        worker.postMessage(text)
      }
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
    .on(isTouch ? 'touchstart' : 'mousedown', function(e){
      e.preventDefault()
      go(1)
    })
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
  /*window.addEventListener('hashchange', function(){
    //console.log('on hash:', location.hash)
    jump(hashPage())
  })*/

  if (isTouch) {
    // 侦听swipe事件 前后页切换
    var sx, sy, dx, dy
    var isDragging = false
    $(document).on('touchstart', function(e){
      e = e.originalEvent || e
      if ($(e.target).closest('pre, table').length > 0) {
        return
      }
      isDragging = true
      sx = e.changedTouches[0].pageX
      sy = e.changedTouches[0].pageY
    })
    $(document).on('touchmove', function(e){
      e = e.originalEvent || e
      if (!isDragging) return
      e.preventDefault()
    })
    $(document).on('touchend', function(e){
      if (!isDragging) return
      isDragging = false
      e = e.originalEvent || e
      dx = e.changedTouches[0].pageX - sx
      dy = e.changedTouches[0].pageY - sy
      if (Math.abs(dy/dx) > 2) {
        if (dy < -20) go(1)
        else if (dy > 20) go(-1)
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
      hsv[2] = Math.min(hsv[2], 30)
    }
    if (opt.theme === 'bright') {
      hsv[2] = Math.min(hsv[2], 60)
    }
    var rgb = HSVtoRGB(hsv)
    //console.log(rgb)
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
  //location.hash = '' + page
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
