# markppt

项目源码 <https://github.com/fritx/markppt>

## 一篇markdown，一份ppt。

- 一个读取markdown文件，生成网页幻灯片(即ppt)的工具
- 很多时候，我们用markdown来书写我们的人生
- 很多时候，我们需要有一份ppt来向世界分享观点
- 网页实现，处处发布，随机背景色，css3动画切换
- 超响应式布局，自动缩放，不再畏惧屏幕尺寸

点击查看演示

- <http://fritx.github.io/markppt/mytalk/>
- <http://fritx.github.io/markppt/gulpeol/>

```
npm i -g markppt   # 从npm安装
markppt mytalk/talk.md   # markdown路径
```

将会在[原目录](https://github.com/fritx/markppt/tree/master/examples/mytalk/)

```
- mytalk/
  - Desert.jpg
  - talk.md
```

生成`_ppt`文件夹，和一份`talk.md.html`，打开即可[浏览ppt](http://fritx.github.io/markppt/mytalk/)

```
- mytalk/
  - _ppt/ (√)
  - Desert.jpg
  - talk.md
  - talk.md.html (√)
```
