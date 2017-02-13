---
layout: post
title:  "JavaScript 语言学习"
date:   2017-02-13 23:16:33 +0800
categories: JavaScript
---
*以下摘自《JavaScript语言精粹》*
* length属性的值是其数组的最大整数属性名加上1，但它不一定等于数组里的属性的个数
{% highlight js linenos %}
var myArray = [];
myArray.length            // 0

myArray[1000000] = true;
myArray.length            // 1000001
// myArray只包含一个属性

var myArray = ['num',false,true]
myArray.length //3
myArray[100000] = true;
myArray.length  //1000003
{% endhighlight %}

* 判断对象是否为数组的好方法：
{% highlight js linenos %}
var is_array = function (value){
    return Object.prototype.toString.apply(value) === '[object Array]'
}
{% endhighlight %}

* Array的sort方法不能对一组数字进行正确排序

{% highlight js linenos %}
var n = [3, 4, 23, 45, 122, 9, 8];
n.sort(); // n = [122, 23, 3, 4, 45, 8, 9]
{% endhighlight %}
JavaScript的默认比较函数把要被排序的元素都视为字符串，所以得到了一个错的离谱的结果，解决方法如下：

{% highlight JavaScript linenos %}
n.sort(function(a, b){
    return a-b;
})
{% endhighlight %}

* 摩尔定律并不适用于电池

* NaN是IEEE 754中定义的一个特殊的数量值，它表示的是*不是一个数字*，但是下面表达式返回的是true：
`typeof NaN === 'number'   //true`
所以判断是否为数字的最佳方法是：

{% highlight js linenos %}
var isNumber = function(value){
    retur typeof value === 'number' && isFinite(value);
}
{% endhighlight %}

* 一门语言最糟糕的特性不是那些一看就知道很危险或者没有价值的特性，那些特性很容易被避免。最糟糕的特性就像带刺的玫瑰，它们是有用的，但也是危险的。

* 用圆括号把JSON文本括起来是一种避免JavaScript语法歧义的变通方案。
`var myData = eval(‘(’+ myJSONText +’)’)`

*以下摘自《了不起的node.js》*

