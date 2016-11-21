
// 基本功能组件开发
define(['jquery','renderUI'],function($,renderUI){

  function Base(){
    
    this.render = new renderUI.renderUI();

    this.config = {
      time : 100,
      _mobile_nav : $('.mobile-nav'),
      _local : $(".local")
    };
    var config = this.config;
    var reset = false; //防止动画被多次触发
    this.show_nav_bar = function( callback ){ 
      if( config._mobile_nav.css('display') == 'none' && !reset )
      {
        config._local.show();
        config._mobile_nav.animate({
          'top' : ( $(window).height() - config._mobile_nav.height() ) / 2,
          'opacity' : 1
        },config._time,function(){
          reset = true;
          if( callback ){ callback(); }
        }).show();
      }
    };  
    this.close_nav_bar = function( callback ){
      if( config._mobile_nav.css('display') == 'block' && reset ){
         config._mobile_nav.animate({
          'top' : - config._mobile_nav.height(),
          'opacity' : 0
         }, config._time, function(){
          reset = false;
          config._mobile_nav.hide();
          config._local.hide();
          if( callback ){ callback(); }
         }); 
      } 
    };

  }    

  Base.prototype={
    bottom_bar_hander : function(){
  
      this.render.set_bottom_bar();
      this.render.set_side_bar();

      var _this = this;
      var _local = this.config._local;
      var _menu_a = $('.mobile-nav li a');

      var mobile_hander = function(){
        // 兼容手机横屏状态时，无法启动resize事件,如果使用的是zepto工具库就不需要兼容这些了
        $('.mobile-nav').css('left', ( $(window).width() - $('.mobile-nav').width() )/2);
        // 再执行动画
        _this.show_nav_bar();
      };

      var pc_hander = function(){
        if( $('html').hasClass('padding') )
        {
          $('html').removeClass('padding');
          $('.side-bar').removeClass('side-bar-active');
          $(this).html('&#xe9ba;');
        }else{
          $('html').addClass('padding');
          $('.side-bar').addClass('side-bar-active');
          $(this).html('&#xea0f;');
        }
      };
      // 显示菜单栏
      var evt = ( 'ontouchend' in window ) ? 'touchend' : 'click';
      if( $(window).width() <= 623 && $('.header-nav').css('display') == 'none' ){
        //先移除PC端的事件再加载移动端事件
        //尽管这里是先判断当前窗口大小，但只要两个情况都出现后就会出现绑定2个事件函数
        //由于该元素唯一并多用于所以这里必须要全部移除该元素绑定的事件才有效。
        $('.nav-bar').unbind( evt );
        $('.nav-bar').bind( evt , mobile_hander);
      }else if( $(window).width() > 623 && $('.header-nav').css('display') == 'block' ){
        $('.nav-bar').unbind( evt );
        $('.nav-bar').bind( evt , pc_hander);
      }
      //关闭菜单栏
      _local.bind( evt, function(){
        _this.close_nav_bar();
      });
      _menu_a.bind( evt, function(){
        _this.close_nav_bar();
      }); 
    },
    //pc端标题全展示
    title_tip : function(){
      $('.tag-list li').hover( function(){
        if( event.target.nodeName.toLowerCase() === 'a' )
        {
          var _info = $(this).find('a').html();
          var _top = $(this).find('a').offset().top - ( $('.title-tip').height() / 2 ) - $(window).scrollTop();
          $('.title-tip').css('top',_top).html( _info ).fadeIn('fast');
        } 
      } , function(){
        $('.title-tip').fadeOut('fast');
      } );
    },
    //移动端划出菜单
    slip_side_bar : function(){
      var opt = {
        start_time : null,
        end_time : null,
        start_x : null,
        end_x : null,
        open : false,
        do : false
      };
      $(window).bind( 'touchstart' , function(){
        // event.preventDefault();
        opt.start_time = new Date() * 1;//转化为数字
        opt.start_x = event.touches[0].pageX;
      });
      $(window).bind( 'touchmove' , function(){
        opt.end_x = Math.floor(event.touches[0].pageX - opt.start_x );
        if( opt.end_x < -10 && opt.end_x > -300 )
        {
          $('.side-bar').css( 'transform' , 'translate3d('+ (300+opt.end_x) +'px, 0, 0)');
          opt.do = true;
        }
      });
      $(window).bind( 'touchend' , function(){
        // event.preventDefault();
        opt.end_time = new Date() * 1;
        var _time = opt.end_time - opt.start_time;
        
        if( !opt.open && opt.do ){//当opt.open为真是表示侧边栏已经打开，不再执行这里的函数，否则就会有BUG
          
          if( _time >= 600 && opt.end_x <= -50){
            $('.local').fadeIn();
            $('.side-bar').css( 'transform' , 'translate3d(0, 0, 0)');
            opt.open = true;
          }else if( opt.end_x >= 100 || _time <= 500 ){
            $('.side-bar').css( 'transform' , 'translate3d(300px, 0, 0)');
            opt.do = false;
          }else{
            $('.side-bar').css( 'transform' , 'translate3d(300px, 0, 0)');
            opt.do = false;
          }

        }  

      });
      $(window).bind('touchend',function(){
        if( event.target.className === 'local' && opt.open )
        {
          $('.local').fadeOut('fast');
          $('.side-bar').css( 'transform' , 'translate3d(300px, 0, 0)');
          opt.open = false;
          opt.do = false;
        }
      });
    },
    //开关标题列表
    li_title : function(){
      var render = this.render;
      $('.blog-tag').click( function(){
        if( event.target.className === 'blog-tag' ){
          var _this = $(this);
          if( $(this).find('.tag-list').length != 0 ){
            $(this).find('.tag-list').toggle('normal' ,function(){
              render.check_tag_list( $(this) , _this );
            });
          }
        } 
      });
    }
  };

  return {
    Base : Base
  };


});
