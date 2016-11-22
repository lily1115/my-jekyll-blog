---
layout: post
title:  "React-router路由模块中的browerHistory"
categories: React
---

`browserHistory` 中的 `History` 也就是历史，做啥的呢？

这得要知道HTML5中的History API 接口这一部分。

HTML5 history API 包括2个方法、1个事件：

{% highlight ruby %}
history.pushState()
history.replaceState()
window.onpopstate
{% endhighlight %}

**history.pushState()**

{% highlight ruby %}
history.pushState(stateObject, title, url) 
stateObject : 状态对象，可以理解为组装网页路径的的一些属性  
title ： 标题，字符串，可以为空  
url : 当前路径显示，字符串。仅同源下有效
{% endhighlight %}

*该函数执行后有3个变化：*

1.网站的地址变为参数中url地址

2.将新生成一条历史记录，可用浏览器的“后退”和“前进”来导航

3.该函数将返回一个数字，我猜测应该网页驻留时间值，目前还未找到可信赖的依据。

`history.pushState` 接口是可以自由操作浏览器 URL 的，这个也就是 react-router 可以工作的底层机制保障。

browserHistory 就是 React Router 对 History API 进行的封装。更多说明可以参考官方文档 [Histories]。

**history.replaceState()**

这个就是字面意思啦，作用就是替换掉当前记录，用法和pushState()基本相同，但不会生成新的历史纪录。

**window.onpopstate**

这是在页面发生前进或后退时触发的事件，而调用上面两个函数是不是触发该事件的。
具体技术参考该文档，[window.onpopstate]

关于HTML5中的history的api,[了解更多]。

[了解更多]: https://segmentfault.com/a/1190000002447556
[Histories]: https://github.com/reactjs/react-router/blob/master/docs/guides/Histories.md
[window.onpopstate]: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate