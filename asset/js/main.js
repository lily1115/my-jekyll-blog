require.config({
    paths : {
      "jquery" : "jquery.min"
    },
    waitSeconds : 0
});
require(['jquery','base'],function($,Base){
  
  var base = new Base.Base();
  base.bottom_bar_hander();
  base.slip_side_bar();
  base.title_tip();
  base.li_title();
  $(window).resize( function(){
    base.bottom_bar_hander();
  } );


});
