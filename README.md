# markppt

项目源码 <https://github.com/fritx/markppt>

<img width="140" src="https://raw.githubusercontent.com/fritx/markppt/dev/screenshots/2015-04-11%2002.09.47.png">
&nbsp;&nbsp;<img width="403" src="https://raw.githubusercontent.com/fritx/markppt/dev/screenshots/2015-04-10%2023.17.37.png">
&nbsp;&nbsp;<img width="100" src="https://raw.githubusercontent.com/fritx/markppt/dev/artwork/icon1_2.png">

## 一篇markdown，一份ppt。

- 一个读取markdown文件，生成网页slides/ppt的工具
- 很多时候，我们用markdown来书写我们的人生
- 很多时候，我们需要有一份ppt来向世界分享观点
- 网页实现，处处发布，随机背景色，css3动画切换
- 超响应式布局，自动缩放，不再畏惧屏幕尺寸
- 智能无缝分页匹配，无需更改markdown原文

点击查看演示

- [gulp-eol bug之总结 (light)](http://fritx.github.io/markppt/gulpeol-light/gulp-eol-bug.md.html)
- [gulp-eol bug之总结](http://fritx.github.io/markppt/gulpeol/gulp-eol-bug.md.html)
- [My Talk](http://fritx.github.io/markppt/mytalk/talk.md.html)

```
$ npm i -g markppt   # 从npm安装
$ markppt mytalk/talk.md   # markdown路径
$ markppt mytalk/talk.md --theme=light   # 指定css主题
```

将会在[原目录](https://github.com/fritx/markppt/tree/master/examples/mytalk/)

```
- mytalk/
  - Desert.jpg
  - talk.md
```

生成`ppt_`文件夹，和一份`talk.md.html`，打开即可[浏览ppt](http://fritx.github.io/markppt/mytalk/talk.md.html)

```
- mytalk/
  - ppt_/ (√)
  - Desert.jpg
  - talk.md
  - talk.md.html (√)
```
