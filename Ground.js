/**
 * Ground class constructor
 * @param CanvasContext ctx
 * @param CanvasElement canvas
 */
function Ground($canvas, $window){
    
    //The canvas JQuery object
    this.$canvas = $canvas;

    //Window DOM element
    this.$window = $window;

    //The canvas element
    this.canvas = $canvas[0],

    //The canvas context
    this.ctx = canvas.getContext("2d"),

    //The canvas width
    this.width = canvas.width;

    //The canvas height
    this.height = canvas.height;

    //Max blocks for ground width (block size is calculated later)
    this.groundBlocks = 30;       

    //List of current apples on the ground
    this.apples = [];

    //The snake!
    this.snake = new Snake(this);
    
}

/**
 * Snake class definition
 */
Ground.prototype = {
    /**
     * Initialize the ground
     */
    init: function(){
        if(this.snake){
            this.snake.reallocate();
        }
        this.addApple();
    },

    /*
     * Center the snake on the ground
     */
    centerSnake: function(){
        this.snake.center();
    },

    /**
     * Add a new apple to the ground
     * @param bool _isBad
     */
    addApple: function(_isBad){
        var isBad = _isBad || false;
        
        var heightBlocks = Math.floor(this.height/this.blockSize)-2;
        var x, y;
        do{
            x =  Math.floor(Math.random()*(this.groundBlocks-2-(1-1))) + 1;
            y =  Math.floor(Math.random()*(heightBlocks-(1-1))) + 1;
            
        }while(this.snake.hasPoint(x*this.blockSize, y*this.blockSize));
        var apple = new Apple(this, this.blockSize*x, this.blockSize*y);
        apple.isBad = isBad;
        this.apples.push(apple);
    },

    /**
     * Calculates the block size for the current screen
     * @param int width The width of the screen
     */
    calculateBlockSize: function(width){
        this.blockSize = Math.floor(width/this.groundBlocks);
    },

    /**
     * Draw the borders of the ground
     */
    drawBounds: function(){
        this.ctx.fillStyle   = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle   = '#e1e1e1';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle   = '#000';

        /*
        //Show a grid for testing
        for(var i=0;i<this.groundBlocks;i++){
            for(var j=0;j<this.height;j++){
                this.ctx.strokeRect(i*this.blockSize,j*this.blockSize,this.blockSize, this.blockSize);
            }
        }*/
    },

    /**
     * Function called from the main game loop
     * Prints the ground
     * Moves the snake and check for collisions
     * Does the eaten logic
     * Creates the apples
     * Set the game velocity
     */
    tick: function(){
        this.clear();
        this.drawBounds();
        if(this.snake.move()){
            Game.stop();
        }
        this.snake.draw();
        var eatenApple = this.snake.eat(this.apples);

        if(eatenApple !== false){
            var apple = this.apples.splice(eatenApple,1)[0];
            
            if(apple.isBad){
                Game.decPoints();
            }else{
                Game.incVelocity();
                Game.incPoints();
                this.addApple();
            }
        }
        if(Math.floor ( Math.random ( ) * 100 + 1 )  == 100){
            this.addApple(true);
        }
        this.drawApples();
    },

    /**
     * Specified method for draw the apples on the ground
     */
    drawApples: function(){
        for(var i=0; i<this.apples.length; i++){
            var apple = this.apples[i];
            if(apple.isBad){
                if(apple.timeLife > 0){
                    apple.draw();
                }else{
                    delete this.apples[i];
                    this.clearApples();
                }
                apple.timeLife--;
            }else{
                apple.draw();
            }
        }
    },

    /**
     * Remove the current apples
     */
    clearApples: function(){
        var newApples = [];
        for(var i=0; i<this.apples.length; i++){
            if(this.apples[i] != undefined){
                newApples.push(this.apples[i]);
            }
        }
        this.apples = newApples;
    },

    /**
     * Recalculate the blocksize when the user window is resized
     * @param JQueryObject $window
     * @param CanvasElement canvas
     */
    resize: function($_canvas){
        var $canvas = $_canvas !== undefined? $_canvas : this.$canvas;
        $canvas.css('border', 'solid 5px #FFF');
        var w = this.$window.width()-50;
        var h = this.$window.height()-20;
        this.calculateBlockSize(w);
        this.width = this.groundBlocks*this.blockSize;
        var heightBlocks = parseInt(h / this.blockSize);
        this.height = heightBlocks*this.blockSize;
        canvas.height = this.height;
        canvas.width = this.width;
    },

    /**
     * Clear the ground
     */
    clear: function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        
    }
};