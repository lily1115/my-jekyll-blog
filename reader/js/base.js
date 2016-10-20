(function(){

	var util = (function(){
		var prefix = "html5_reader_";
		var storageGetter = function(key){
			return localStorage.getItem(prefix + key);
		};
		var storageSetter = function(key,value){
			return localStorage.setItem(prefix + key,value);
		};
		var getJSONP = function( url, callback ){
			return $.jsonp({
				url : url,
				cache : true,
				callback : 'duokan_fiction_chapter',
				success : function( result )
							{ 
								// debugger
								var data = $.base64.decode(result);
								var json = decodeURIComponent(escape(data));
								callback(json);
							}
			});
		};
		return {
			storageGetter : storageGetter,
			storageSetter : storageSetter,
			getJSONP : getJSONP
		};
	})();
	var Dom = {
		win : $(window),
		doc : $(document),
		topNav : $("#top_nav"),
		botNav : $("#bottom_nav"),
		setNav : $(".font_control"),
		root : $("#root"),
		h4 : '',
		content : $("#chapter_content"),
		lineHeight : '',
		fontInfo : $('#font_info'),
		initTitleSize: 20,
		initContentSize: 14,
		initLineHeight: 24
	};

	var dataModel,readerUI;

	function main(){
		readerBaseFrame();
		dataModel = readerModel();
		dataModel.getChapterTitle();
		readerUI = readerData( Dom.content );
		dataModel.init( function(data)
			{ 
				readerUI(data); 
			});
		eventHandler();
	}

	function readerModel(){		
		var chapter_ID;
		var chapter_length;
		var chapterHTML;
		var init = function( callback ){
			getChapterInfo( function(){
				getChapterContent(chapter_ID,function( data ){
					callback( data );
				});
			} );
		};
		// 实现阅读器相关的数据交互方法
		var getChapterInfo = function( callback ){
			$.get('data/chapter.json',function( data ){
				//获取章节信息后执行什么
				//这里有个误区需要注意这里的chapter_ID,是章节ID
				//而getchapterContent（）中的chapterId，其实是获得章节中的不同小节
				//由于这里模仿数据传递，所以参数所代表的意义不够准确，容易被误导
				chapter_ID = data.chapters[1].chapter_id;
				chapter_length = data.chapters.length;
				callback && callback();
			},'json');
		};
		var getChapterContent = function( chapterId , callback ){
			
			if( util.storageGetter('chapter_ID') && util.storageGetter('chapter_ID') != 'NaN' )
			{
				chapterId = parseInt( util.storageGetter('chapter_ID'),10);
			}

			$.get('data/data'+chapterId+'.json',function( data ){
				if( data.result == 0 )
				{
					var url = data.jsonp;
					util.getJSONP( url , function( data ){
						// debugger
						callback && callback(data);
					});
				}
			},'json');
		};
		var prevChapter = function( callback ){
			if( chapter_ID == 1 )
			{
				return true;
			}
			chapter_ID -= 1;
			getChapterContent( chapter_ID , function(data){ callback(data); });
			util.storageSetter('chapter_ID',chapter_ID);
			return false;
		};
		var nextChapter = function( callback ){
			if( chapter_ID == 4 ) //测试也只有4页 正常应该是chapter_length
			{
				return true;
			}
			chapter_ID += 1;
			getChapterContent( chapter_ID , function(data){ callback(data); });
			util.storageSetter('chapter_ID',chapter_ID);
			return false;
		};
		var getChapterTitle = function(){
			chapterHTML = '';
			$.get('data/chapter.json',function( data ){
				chapters = data.chapters;
				chapters.forEach(function(item){
					chapterHTML+=('<li><a href="#">'+item.title+'</a></li>');
				});
				$('#chapterTitleshow').html('<ul>'+chapterHTML+'</ul>');
			},'json');
		};
		return { 
			init : init ,
			prevChapter : prevChapter ,
			nextChapter : nextChapter ,
			getChapterTitle : getChapterTitle
		};	
	}

	function readerData( contentbox ){
		//  渲染数据基本的UI结构
		function parseChapterDta( json_data ){
			var jsonData = JSON.parse( json_data );
			var html = '<h4>'+jsonData.t+'</h4>';
			for( var i = 0; i < jsonData.p.length; i++ )
			{
				html += '<p>'+jsonData.p[i]+'</p>';
			}
			return html;
		}

		return function( data ){

			contentbox.html( parseChapterDta( data ) );
			// 锁定父体的高度
			if( $('#root').offset().height < screen.availHeight)
			{
				$('#root').css('height',screen.availHeight +'px');
			}
			//获取阅读器设置样式信息 并更新DOM
			Dom.h4 = $("#chapter_content h4");
			Dom.lineHeight = $('#chapter_content p');
			// console.log(util.storageGetter('h4FontSize'));
			if( util.storageGetter('h4FontSize') &&  util.storageGetter('h4FontSize') != 'NaN' ) //注意这里即使没有设定 h4FontSize 那么返回的不是undefined而是null
			{
				//初始化字体模块
				Dom.initTitleSize = parseInt( util.storageGetter('h4FontSize') );
				Dom.initContentSize = parseInt( util.storageGetter('contentFontSize') );
				Dom.initLineHeight = parseInt( util.storageGetter('lineHeight') );	
			}
			Dom.h4.css('font-size', Dom.initTitleSize + 'px');
			Dom.content.css('font-size', Dom.initContentSize + 'px');
			Dom.lineHeight.css('line-height', Dom.initLineHeight + 'px');
			if( util.storageGetter( 'rootBg') )
			{
				//初始化背景模块
				var getbg = util.storageGetter( 'rootBg');
				var getcolor = util.storageGetter( 'contentColor' );
				Dom.content.css('color',getcolor);
				Dom.root.css('background-color',getbg);
			}
			// console.log(Dom.initTitleSize);
		};

	}

	function readerBaseFrame(){

		if( $('.bottom_btn .fontset').hasClass('fontset_active') )
		{
			$('.bottom_btn .fontset').removeClass('fontset_active');
		}
		if( Dom.setNav.css('display') == 'block')
		{
			Dom.setNav.hide();
		}
		// bottom_nav click handler button
		function active( obj, className ){
			obj.mousedown(function(){
				$(this).addClass(className);
			});
			obj.mouseup(function(){
				var _this = $(this);
				setTimeout(function(){
					//注意这里就不能直接使用this，因为这里的作用域已经发送变法
					_this.removeClass(className);
				},350);
			});
		}
		active( $('.bottom_btn li span'), 'bot_active' );
		active( $('.top_nav .nav_title'), 'bot_active' );
		active( $('.chapter_btn li'), 'page_active' );
		active( $('.set_btn'), 'setbutton_active' );
		active($('#chapterTitleshow li'), 'bot_active' );
		//点击每个小节后隐藏小节显示
		$('#chapterTitleshow li').click(
			function(){
				setTimeout(function(){
					$('#chapterTitleshow').hide();
				},800);
			});
	}

	function eventHandler(){	
		// 交互事件的绑定
		$("#model_action .mid_action").click(function(){		
			readerBaseFrame();
			if(Dom.topNav.css('display') == 'none'){
				Dom.topNav.show();
				Dom.botNav.show();
			}else{
				Dom.topNav.hide();
				Dom.botNav.hide();
			}
		});
		// titleshow **********************
		$(".titleshow").click(function(){
			readerBaseFrame();
			//显示所有章节	
			if( $('#chapterTitleshow').css('display') === "none" )
			{
				$('#chapterTitleshow').show();
			}else{
				$('#chapterTitleshow').hide();
			}
		});
		//font_set************************
		$('.bottom_btn .fontset').click(function(){
			$('#chapterTitleshow').hide();
			if(Dom.setNav.css('display') == 'none')
			{
				$(this).addClass('fontset_active');
				Dom.setNav.show();
			}else{
				Dom.setNav.hide();
				$(this).removeClass('fontset_active');
			}
		});

			// set font-size 字体大小设置
			var setFontSize = function( obj ){
				Dom.initTitleSize += obj.num;
				Dom.initContentSize += obj.num;
				Dom.initLineHeight += obj.num;
				var max = false, min = false;
				if( Dom.initTitleSize >= 28 )
				{
					Dom.initTitleSize = 28;
					max = true;
				}else if( Dom.initTitleSize <= 18){
					Dom.initTitleSize = 18;
					min = true;
				}else{
					max = false;
					min = false;
				}	
				
				if( Dom.initContentSize >= 34 )
				{
					Dom.initContentSize = 34;
					Dom.initLineHeight = 44;
					max = true;
				}else if( Dom.initContentSize <= 14 ){
					Dom.initContentSize = 14;
					Dom.initLineHeight = 24;
					min = true;
				}else{
					max = false;
					min = false;
				}

				if( max || min ){
					Dom.fontInfo.show().html(obj.info);
					setTimeout(function(){
						Dom.fontInfo.hide();
					},1000);
				}
				Dom.h4.css('font-size', Dom.initTitleSize + 'px');
				Dom.content.css('font-size', Dom.initContentSize + 'px');
				Dom.lineHeight.css('line-height', Dom.initLineHeight + 'px');
				
				util.storageSetter( 'h4FontSize',Dom.initTitleSize);
				util.storageSetter( 'contentFontSize',Dom.initContentSize);
				util.storageSetter( 'lineHeight',Dom.initLineHeight);
			};
			$('#lg_font').click(function(){
				setFontSize({
					num: 2,
					info: '爷！不能再大啦'
				});
			});

			$('#sm_font').click(function(){
				setFontSize({
					num: -2,
					info: '爷！不能再小啦'
				});
			});
			// 背景设置
			$('.bg_type').click(function(){
				var bg = $(this).css('background-color');
				if( bg == 'rgb(85, 85, 85)' )
				{
					Dom.content.css('color','#a3a3a3');
				}else{
					Dom.content.css('color','rgb(0, 0, 0)');
				}
				Dom.root.css('background-color',bg);
				util.storageSetter( 'rootBg',bg);
				util.storageSetter( 'contentColor',Dom.content.css('color'));
			});
		//readtype_set************************
		$('.bottom_btn .readtype').click(function(){
			$('#chapterTitleshow').hide();
			readerBaseFrame();
			if( $(this).hasClass('readtype_day') ){
				$(this).removeClass('readtype_day');
				$(this).html('夜间');
				//在切换时需要重新设定背景和字色，如果用户有设置那么就取用设置值
				if( util.storageGetter( 'rootBg') ){
					Dom.root.css('background-color',util.storageGetter( 'rootBg'));
					Dom.content.css('color',util.storageGetter( 'contentColor'));
				}else{
					Dom.root.css('background-color','rgb(233, 223, 199)');
					Dom.content.css('color','rgb(0, 0, 0)');
				}
			}else{
				$(this).addClass('readtype_day');
				$(this).html('昼间');
				Dom.root.css('background-color','rgb(15, 20, 16)');
				Dom.content.css('color','rgb(104, 101, 101)');
			}	
		});

		Dom.win.scroll(function(){
			readerBaseFrame();
			Dom.topNav.hide();
			Dom.botNav.hide();
		});

		// 上一章 下一章 交互设定
		var turnPage = function( callback , msg ){
			var flag = callback(function(data){
				readerUI(data);
			});
			if( flag ){
				Dom.fontInfo.show().html(msg);
				setTimeout(function(){
					Dom.fontInfo.hide();
				},1000);
			}
		};
		$('#prev_btn').click(function(){
			turnPage(dataModel.prevChapter , '爷！已经到头啦');
		});
		$('#next_btn').click(function(){
			turnPage(dataModel.nextChapter , '爷！已经没有啦');
		});



	}
	main();
})();