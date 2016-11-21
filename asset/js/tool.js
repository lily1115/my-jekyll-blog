define(['jquery'],function($){

  function Tool( ){

  }
  Tool.prototype = {
    scroll_animate : function(obj)
    {
      //运动目标值
      var target = obj.target,
          time = obj.time ? obj.time : 20,
          step = obj.step ? obj.step : 400,
          type = obj.type ? obj.type : 'normal';//动画的速度，fast/normal/slow
      var now_scrollTop = '';
      var over = true;
      //获取运动最终速度值
      switch( type )
      {
        case 'fast':
          step += 450;
          time = 20;
          break;
        case 'slow':
          step = 200;
          time = 50;
          break;
        case 'normal':
          step = 300;
          time = 30;
          break;
      }
      var animate = function()
      {
        setTimeout( function(){
          now_scrollTop = $(window).scrollTop();
          if( now_scrollTop === target ){
            over = true;
            obj.callback && obj.callback( );
          }else{
            if( now_scrollTop < target )
            {
              now_scrollTop += step;
              if( now_scrollTop >  target || Math.abs( now_scrollTop - target ) < step )
              {
                now_scrollTop = target;
                $(window).scrollTop( now_scrollTop );
                over = true;
              }
            }else{
              now_scrollTop -= step;
              if( now_scrollTop <  target || Math.abs( now_scrollTop - target ) < step )
              {
                now_scrollTop = target;
                $(window).scrollTop( now_scrollTop );
                over = true;  
              }
            }
            $(window).scrollTop( now_scrollTop );
            over = false;
            animate();
          }
        }, time);
      };
      if( over ){ animate(); }   
    },
    // 鼠标移入移出显示动画
    hover_animate : function( obj )
    {
      //参数类型为css选择器 字符串
      //实现动画的子元素的父元素，必须。
      //这里需要注意父元素必须是绝对定位absolute
      var parent = obj.parent,
          eventTarget = obj.eventTarget ? obj.eventTarget : parent,//事件触发元素必须包含parent元素
          show = obj.show,//需要显示的元素，如果没有指定那么初始就是全部隐藏
          hover_show = obj.hover_show,//在鼠标移入是需要显示的元素，如果没有指定将子元素全部显示
          time = obj.time ? obj.time : 800,//动画时间
          //动画样式，默认向上toTop,toLeft\toRight\toBottom\toTop,这里必须是有hover_show才有效
          //同时这里需要根据布局方向需要来选择动画方向。
          type = obj.type ? obj.type : 'toTop'; 
      $( parent ).css('overflow','hidden');
      var _height,_width;
      var setType = function(ele,x,y){
        switch( type )
        {
          case 'toTop':
            ele.css({
              'bottom': 0,
              'transform' : 'translate3d(0,'+ x +'px,0)',
              'transition' : 'all '+ ( time/1000 ) +'s'
            });
            break; 
          case 'toBottom':
            ele.css({
              'top': 0,
              'transform' : 'translate3d(0,'+ ( -x ) +'px,0)',
              'transition' : 'all '+ ( time/1000 ) +'s'
            });
            break; 
          case 'toLeft':
            ele.css({
              'right': 0,
              'transform' : 'translate3d(' + y + 'px,0,0)',
              'transition' : 'all '+ ( time/1000 ) +'s'
            });
            break;
          case 'toRight':
            ele.css({
              'left': 0,
              'transform' : 'translate3d(' + (-y) + 'px,0,0)',
              'transition' : 'all '+ ( time/1000 ) +'s'
            });
            break;
          default:
            ele.css({
              'bottom': 0,
              'transform' : 'translate3d(0,'+ _height +'px,0)',
              'transition' : 'all '+ ( time/1000 ) +'s'
            });   
        }
      };

      $( parent ).each( function(index,key){
        $(key).children().hide();
        if( show ){
          $(key).find(show).show();
        }
        if( hover_show )
        {
          $(key).find(hover_show).show();
          _height = $( key ).find( hover_show ).outerHeight();
          _width = $( key ).find( hover_show ).outerWidth();
          setType( $( key ), _height, _width );
        }
      });

      $(eventTarget).hover( function(){
        var ele = $(this).find(parent);
        if( hover_show )
        {
          ele.css('transform' , 'translate3d(0,0,0)');
        }else{
          ele.children().fadeIn();
        }
      } , function(){
        var ele = $(this).find(parent);
        if( hover_show )
        {
          _height = ele.find( hover_show ).outerHeight();
          _width = ele.find( hover_show ).outerWidth();
          setType( ele, _height, _width );
        }else{
          ele.children().fadeOut();
        }
      } );

    }

















  };



  return {
    Tool : Tool
  };
});