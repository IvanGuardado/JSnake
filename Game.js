var Keys = {
    ARROW_UP: 38,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    PAUSE: 80
};

/**
 * Singleton game object
 */
var Game = {

    //The base object
    ground: null,

    //The game status
    paused: true,

    //Earned points
    points: 0,

    //JQueryObject: the text with the points
    $points: null,

    //Game velocity
    velocity: 100,
    
    /**
     *  Increases the user points
     */
    incPoints: function(){
        this.points += 10;
        this.$points.text(this.points);
    },

    /**
     * Decreases the user points
     */
    decPoints: function(){
        this.points -= 50;
        if(this.points < 0){
            this.points = 0;
        }
        this.$points.text(this.points);
    },

    /**
     * Increases the game velocity
     */
    incVelocity: function(){
        if(this.velocity >50){
            this.velocity--;
        }
    },

    /**
     * Start the game
     */
    start: function(context, canvas){
        this.ground = new Ground(context, canvas);
        this.ground.resize();
        this.ground.init();
        this.ground.centerSnake();

        if(!this.$points){
            this.$points = $('#points');
        }
        this.paused = false;
    },

    /**
     * Pause the game
     */
    pause: function(){
        this.paused = true;
    },

    /**
     * Stop the game
     */
    stop: function(){
        this.pauses = true;
    },

    /**
     * Play / pause the game
     */
    togglePause: function(){
        if(this.paused){
            this.start();
        }else{
            this.pause();
        }
    },

    /**
     * Event handler on key press
     */
    sendKey: function(ev){
        switch(ev.which){
            case Keys.ARROW_LEFT:
                this.ground.snake.setDirection(SnakeDirection.LEFT);
            break;
            case Keys.ARROW_UP:
                this.ground.snake.setDirection(SnakeDirection.UP);
            break;
            case Keys.ARROW_DOWN:
                this.ground.snake.setDirection(SnakeDirection.DOWN);
            break;
            case Keys.ARROW_RIGHT:
                this.ground.snake.setDirection(SnakeDirection.RIGHT);
            break;
            case Keys.PAUSE:
                this.togglePause();
            break;
        }
    }
};