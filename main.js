//Anonymous function to isolate
(function($){
    
    //On Document Ready...
    $(function(){
        //Get importante elements to initialize
        var $window = $(window),
            $canvas = $('#canvas');
        
        //Initialize and start the game
        Game.start($canvas, $window);
                
        //The main game loop based on game velocity
        requestAnimationFrame(loop);
        var startDate = new Date();
        function loop(event){
            var currentDate = new Date();
            if(currentDate-startDate > Game.velocity && !Game.paused){
                Game.ground.tick();
                startDate = currentDate;
            }
            requestAnimationFrame(loop);
        }
        
        //Capture window events
        $window.resize(function(){Game.ground.resize($canvas)});
        $window.keydown(function(e){Game.sendKey(e)});
        //Event for touch devices
        $window.swipe({
            swipe: function(e, direction){
                var object = {which: 0};
                switch(direction){
                    case 'left':
                        object.which = Keys.ARROW_LEFT;
                    break;
                    case 'right':
                        object.which = Keys.ARROW_RIGHT;
                    break;
                    case 'up':
                        object.which = Keys.ARROW_UP;
                    break;
                    case 'down':
                        object.which = Keys.ARROW_DOWN;
                    break;
                }
                if(object.which){
                    Game.sendKey(object);
                }
            },
		    threshold:0
        });
    });

})(jQuery);

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
      window.setTimeout( callback, 1000 / 60 );
    };
  } )();
}