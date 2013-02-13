$(function(){
  $('#slides').slides({
    preload: true,
    preloadImage: '_static/loading.gif',
    play: 2000,
    pause: 2500,
    hoverPause: true,
    animationStart: function(current){
      $('.caption').animate({
          bottom:-35
      },100);
    },
    animationComplete: function(current){
       $('.caption').animate({
           bottom:0
       },200);
     },
    slidesLoaded: function() {
       $('.caption').animate({
          bottom:0
       },200);
    }
  });
});
