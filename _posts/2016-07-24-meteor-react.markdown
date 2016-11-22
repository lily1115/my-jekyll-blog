---
layout: post
title:  "跟着时代的步伐加入React"
categories: React
---

为什么我要选择React作为我的第一个框架呢？其实真正的原因只有一个容易上手啦，不像Angular那样学习线路陡峭，而且目前国内的React发展也是相当迅速，后来有居上之势。

另外为了增强用户体验，SPA（single page web application,单页面开发）也是相当的火热，而如今react短小精干的架势个人觉得完全符合SPA开发，当然看各位大神对React的见解，要让React能在SPA中游刃有余还需要一个搞定前后端的伴侣，这里我依照先人们的足迹，选择的meteor。

`meteor是基于node的开发框架`，关键数据的实时交互这点和SPA的要求是完全符合，SPA要的就是无刷新数据交互嘛。

今天就先说一下如何安装meteor吧，MAC安装这个就很容易了，windows要麻烦一点，我说一下windows吧。 进入[下载页面]。

选择windows下载安装即可，这个下载速度嘛当然是有点虐心的，大家可以在下载阶段干点别的啥，

安装完成后，我们来生成一个项目页面，进入后台CMD

{% highlight ruby %}
cd path //指定一个你需要创建的文件夹路径
meteor create xxxxx //项目名字
{% endhighlight %}

完成后等文件加载完毕，该项目就建立好了，然后进入该项目

{% highlight ruby %}
cd xxxxx
meteor
{% endhighlight %}

这里就跟操作Jekylls server命令是一样的，会告诉你一个页面在本地服务器已经启动了，你可以打开看看一般是http://localhost:3000/

接着我们就需要你准备好Node.js，将通过npm来安装react。

[下载页面]:https://www.meteor.com/install