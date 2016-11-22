

define(['jquery','tool'],function( $, Tool ){
  

  function renderUI(){
    this.tool = new Tool.Tool();
    //加入hover显示描述动画
    this.tool.hover_animate({
      parent : '.project-message',
      show : 'h2',
      hover_show : 'p',
      type: 'toTop',
      eventTarget : '.project-content>a'
    });
    // 加入底部按钮
    this.render_bottom_bar({
      num : 1,
      class : 'back-top',
      html : '&#xea32;'
    });
    this.back_top();
    // 加入mobile-nav 移动端菜单
    var nav = $('.header-nav').html();
    this.mobile_nav = $('<ul class="mobile-nav"></ul>').appendTo('body');
    this.mobile_nav.html( nav );
    // 加入遮罩
    this.local = $('<div class="local"></div>').appendTo('body');
    // 居中侧边栏
    this.set_side_bar();
    // 获取侧边栏数据并执行DOM渲染
    this.updata_side_bar( $('#show-ul'), '本页导航栏' );
    this.check_tag_list( $('.tag-list') , $('.blog-tag') );
    this.side_bar_title_position($('.list-ul'));
    //给文章列表加入提示信息
    this.title_tip = $('<p class="title-tip"></p>').appendTo('.side-box');
  }


  renderUI.prototype = {
    
    render_bottom_bar : function( obj ){
      //obj{ 创建数量num ，类名class（单个或数组），标签类容html与class一样 }
      var _html = '';
      var _li = '';
      if( typeof obj.html == 'undefined' ){
        obj.html = [];
      }else if( typeof obj.html == 'string' ){
        var _text = obj.html;
        obj.html = [_text];
      }
      if( obj )
      {
        if( obj.num > 0 )
        {
          var j,k;
          for( var i = 0; i < obj.num; i++ ){
            if( obj.class instanceof Array )
            {
              j = i > obj.class.length ? obj.class.length-1 : i;
              k = i > obj.html.length ? obj.html.length-1 : i;
              _li += ( '<li class="'+ obj.class[j] +'">'+ obj.html[k] +'</li>');  
            }else if(  typeof obj.class == 'string' ){
              k = i > obj.html.length ? obj.html.length-1 : i;
              _li += ( '<li class="'+ obj.class +'">'+ obj.html[k] +'</li>');
            }else if( typeof obj.class == 'undefined' ){
              k = i > obj.html.length ? obj.html.length-1 : i;
              _li += ('<li>'+ obj.html[k] +'</li>');
            }
          }
          _html = '<div class="bottom-bar"><ul class="menu-ul">'+ _li +'<li class="nav-bar"></li></ul></div>';
        }
      }else{
        _html = '<div class="bottom-bar"><ul class="menu-ul"><li class="nav-bar"></li></ul></div>';
      }
      $(_html).appendTo('body');
    },
    set_bottom_bar : function(){
      var nav_bar = $('.nav-bar');
      if( $(window).width() <= 623 ){
        // 初始移动端菜单按钮的基本样式
        nav_bar.html('&#xe9bd;');
        this.mobile_nav.css({
          "top" : - this.mobile_nav.height(),
          "left" : ( $(window).width() - this.mobile_nav.width() )/2
        });
      }else{
        nav_bar.html('&#xe9ba;');
        this.mobile_nav.hide();
        this.local.hide();
      }
    },
    set_side_bar : function( ){
      // 居中侧边栏
      $('.list').css({
        'left': ( $('.side-bar').width() - $('.list').width() )/2 ,
        'top': ( $(window).height() - $('.list').height() )/2 
      });
    },
    updata_side_bar: function( targetEle ,title ){
      //侧边栏初始数据设置 ,targetEle数据来源目标
      if( targetEle.length != 0 ){
        var _length =  targetEle.find('.about-li').length;
        var _html = '';
        var _more = false;
        for( var i = 0; i < _length; i++ )
        {
          var _ele = targetEle.find('.about-li')[i];
          var __text_content = '';
          var _list_ul = '',_list_li = '';
          if( $(_ele).find('h3').length != 0 ){
            _text_content = $(_ele).find('h3').html();
          }else{
            _text_content = $(_ele).find('.show-h3').html();
          }
          if( $(_ele).find('.project-decration').length > 1 )
          {
            var _list_sum = $(_ele).find('.project-decration').length;
            _more = true;
            for( var j = 0; j < _list_sum; j++ )
            {
              var _list_h4 = $(_ele).find('.project-decration')[j];
              if( $(_list_h4).find('h4').length != 0 )
              {
                var _list_h4_text = $(_list_h4).find('h4').html();
                _list_li += ('<li data-top='+ Math.floor( $(_list_h4).offset().top )+'><a href="javascript:;">'+ _list_h4_text +'</a></li>');
              }
            }
            _list_ul = '<ul class="tag-list">' + _list_li + '</ul>';
          }else{
            _more = false;
            _list_li = _list_ul = '';
          }
          if( _more ){
            _html += ('<li class="blog-tag">'+ _text_content +'<span class="triangle"></span>'+ _list_ul +'</li>');
          }else{
            _html += ( '<li class="blog-tag" data-top='+ Math.floor( $(_ele).offset().top ) +'>'+ _text_content +'</li>' );
          }
        }
        $('.list-ul').html('');
        if( title ){
          $('.list>h3').html( title );
        }
        $(_html).appendTo('.list-ul');
      }else{
        console.log('agruments is null');
      }
    },
    side_bar_title_position : function( targetEle ){
      var _this = this;
      // var getTop = $(window).scrollTop();
      // $(window).scroll(function(){
      //   getTop = $(window).scrollTop();
      // });
      targetEle.find('li').each( function( index,ele )
      {
          if( $(ele).attr('data-top') != undefined )
          {
            var target = null;
            $(ele).click( function(){
              target = parseInt( $(this).attr('data-top') , 10 ) - 50;
              _this.tool.scroll_animate({
                target : target,
              });
            });
          }
      });      
    },
    check_tag_list : function( ele , father_ele ){
      //检测标题列表开关状态
      if( ele.css('display') == 'none' ){
        if( father_ele.find('.triangle').hasClass('triangle-open') )
        {
          father_ele.find('.triangle').removeClass('triangle-open');
        }
        father_ele.find('.triangle').addClass('triangle-closed');
      }else{
        if( father_ele.find('.triangle').hasClass('triangle-closed') )
        {
          father_ele.find('.triangle').removeClass('triangle-closed');
        }
        father_ele.find('.triangle').addClass('triangle-open');
      }
    },
    back_top : function()
    {
      var _this = this;
      var change = function(){
        if( $(window).scrollTop() > 800 )
        {
          $('.back-top').fadeIn();
        }else{
          $('.back-top').fadeOut();
        }
      };
      change();
      $(window).scroll( change );
      $('.back-top').click( function(){
        _this.tool.scroll_animate({
          target : 0,
          type : 'normal' 
        });
      } );
    }
  







  };






  return {
    renderUI : renderUI
  };



});