# markppt

<a href="http://badge.fury.io/js/markppt"><img src="https://badge.fury.io/js/markppt.svg" alt="npm version" height="20"></a>
&nbsp;&nbsp;<a href="http://badge.fury.io/gh/fritx%2Fmarkppt"><img src="https://badge.fury.io/gh/fritx%2Fmarkppt.svg" alt="GitHub version" height="20"></a>
&nbsp;&nbsp;<a href="https://gitter.im/fritx/markppt?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"><img src="https://badges.gitter.im/Join%20Chat.svg" alt="Join the chat at https://gitter.im/fritx/markppt" height="20"></a>

<img width="161" src="https://raw.githubusercontent.com/fritx/markppt/dev/screenshots/20150901234930.png">&nbsp;&nbsp;<img width="320" src="https://raw.githubusercontent.com/fritx/markppt/dev/screenshots/20150901235103.png">&nbsp;&nbsp;<img width="140" src="https://raw.githubusercontent.com/fritx/markppt/dev/artwork/icon_400x400.png">

<img width="320" src="https://raw.githubusercontent.com/fritx/markppt/dev/screenshots/20150901233430.png">&nbsp;&nbsp;<img width="320" src="https://raw.githubusercontent.com/fritx/markppt/dev/screenshots/20150901233453.png">

## 一篇markdown，一份ppt。

- 一个读取markdown文件，生成网页slides/ppt的工具
- 很多时候，我们用markdown来书写我们的人生
- 很多时候，我们需要有一份ppt来向世界分享观点
- 网页实现，处处发布，随机背景色，css3动画切换
- 超响应式布局，自动缩放，不再畏惧屏幕尺寸
- 智能无缝分页匹配，无需更改markdown原文

点击查看演示

- [node.js技术交流会 (dark)](http://fritx.github.io/markppt/nodejs-talk/)
- [gulp-eol bug之总结 (bright)](http://fritx.github.io/markppt/gulpeol/gulp-eol-bug.html)
- [My Talk (bright)](http://fritx.github.io/markppt/mytalk/talk.html)
- [Kid.js (light)](http://fritx.github.io/markppt/kidjs/kidjs.html)

```plain
$ npm i -g markppt   # 从npm安装
$ markppt mytalk/talk.md   # markdown路径
$ markppt mytalk/talk.md --theme=light   # 指定css主题
$ markppt mytalk/talk.md --theme=bright   # 默认取dark
$ markppt mytalk/talk.md --color=green   # 指定主色调
```

将会在[原目录](https://github.com/fritx/markppt/tree/master/examples/mytalk/)

```plain
- mytalk/
  - Desert.jpg
  - talk.md
```

生成`ppt_`文件夹，和一份`talk.html`，打开即可[浏览ppt](http://fritx.github.io/markppt/mytalk/talk.html)

```plain
- mytalk/
  - ppt_/ (√)
  - Desert.jpg
  - talk.md
  - talk.html (√)
```

常见问题解答

- [运行无报错输出，但是打开html空白 #8](https://github.com/fritx/markppt/issues/8)
