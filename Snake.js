/**
 * Snake directions enumeration
 */
var SnakeDirection = {
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4
};

/**
 * Snake class constructor
 * @param Ground ground The ground object for the snake
 */
function Snake(ground){
    //The snake direction
    this.direction = SnakeDirection.RIGHT;

    //The ground for the snake
    this.ground = ground;

    //Swicht to know if the snake can move or is collided
    this.canMove = true;

    //List of points to draw the snake
    this.blocks = [];

    //List of colors to draw the snake
    this.colors = [];
}

/**
 * Snake class definition
 */
Snake.prototype = {
    /**
     * Check if the snake contains a point specified by x and y params
     * @param int x
     * @param int y
     */
    hasPoint: function(x, y)
    {
        for(var i=0;i<this.blocks.length; i++){
            var point = this.blocks[i];
            if(point.x == x && point.y == y){
                return true;
            }
        }
        return false;
    },

    /**
     * Check if the snake's head is over an apple. If true, increment
     * the snake's size.
     * @param array apples List of apple objects in the ground
     */
    eat: function(apples)
    {
        var head = this.blocks[this.blocks.length-1];
        for(var i=0; i<apples.length; i++){
            var apple = apples[i];
            if(head.x == apple.point.x && head.y == apple.point.y 
                && this.blocks.length < this.ground.groundBlocks*2){
                this.blocks.push(head);
                this.createColors();
                return i;
            }
        }
        
        return false;
    },

    /**
     * Allocate the snake in the ground to start the game
     */
    center: function()
    {
        var centerX = this.ground.blockSize;
        var centerY = this.ground.blockSize;
        this.blocks.push(new Point(centerX, centerY));
        this.blocks.push(new Point(centerX*2, centerY));
        this.createColors();
    },

    /**
     * Allocate the snake inner game blocks
     */
    reallocate: function(){
        for(var i=0; i<this.blocks.length; i++){
            var point = this.blocks[i];

            while(point.x%this.ground.blockSize != 0){
                point.x++;
            }
            while(point.y%this.ground.blockSize != 0){
                point.y++;
            }
            
        }
    },

    /**
     * Move the snake one position into the current direction and check for
     * collisions.
     * @return bool If it has collision
     */
    move: function(){
        var head = this.blocks[this.blocks.length-1];
        var newHeadPoint;
        switch(this.direction){
            case SnakeDirection.RIGHT:
                newHeadPoint = new Point(head.x+this.ground.blockSize,head.y);
            break;
            case SnakeDirection.LEFT:
                newHeadPoint = new Point(head.x-this.ground.blockSize,head.y);
            break;
            case SnakeDirection.DOWN:
                newHeadPoint = new Point(head.x,head.y+this.ground.blockSize);
            break;
            case SnakeDirection.UP:
                newHeadPoint = new Point(head.x,head.y-this.ground.blockSize);
            break;
        }
        var hasCollision = this.hasCollision(newHeadPoint);
        if(!hasCollision){
            this.blocks.push(newHeadPoint);
            this.blocks.shift();        
            this.draw();
        }
        this.canMove = true;
        return hasCollision;
    },

    /**
     * Specified method for checking collisions
     * @param Point point the point to checking collisions (snake's head)
     * @return bool
     */
    hasCollision: function(point){
        //Checks if snake has collided with the wall
        if(point.x < 0 || point.y < 0 ||
            point.x >= this.ground.width || point.y >= this.ground.height){
            Game.pause();
        }
    
        //Checks if the snake has eaten his own tail
        for(var i=0;i<this.blocks.length; i++){
            var p = this.blocks[i];
            if(p.x == point.x && p.y == point.y){
                return true;
            }
        }
        return false;
    },

    /**
     * Draw the snake on the ground
     */
    draw: function(){
        var ctx = this.ground.ctx;
        var midBlock = parseInt(this.ground.blockSize/2)
        //var colors = this.createColors(this.blocks.length);

        var total = this.blocks.length;
        for(var i=0; i<total; i++){
            ctx.beginPath();
            var point = this.blocks[i];
            ctx.fillStyle = this.colors[i];
            ctx.arc(point.x+midBlock, point.y+midBlock,
                this.ground.blockSize/1.5, 0, Math.PI*2, false);
            ctx.moveTo(point.x, point.y);
            
            ctx.closePath();
            ctx.fill();
        }
    },

    /**
     * Changhe the snake direction movement
     * @param SnakeDirection direction
     */
    setDirection: function(direction){
        var sum = this.direction+direction;
        //ARROW_LEFT+ARROW_RIGHT || ARROW_UP+ARROW_DOWN
        if(sum != 7 && sum != 3 && this.canMove && !Game.paused){
            this.direction = direction;
            this.canMove = false;
        }
    },

    /**
     * Set a list of gradient colors to draw the snake
     */
    createColors: function(){
        var size = this.blocks.length;
        var endColor = '#000a57';
        var startColor = '#75799b';
        var regexp = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;
        var startColorChannels = startColor.match(regexp);
        var endColorChannels = endColor.match(regexp);
        var startColors = {
            'r': parseInt('0x' + startColorChannels[1]),
            'g': parseInt('0x' + startColorChannels[2]),
            'b': parseInt('0x' + startColorChannels[3])
        };

        var endColors = {
            'r': parseInt('0x' + endColorChannels[1]),
            'g': parseInt('0x' + endColorChannels[2]),
            'b': parseInt('0x' + endColorChannels[3])
        };
        var redDif = endColors.r-startColors.r;
        var greenDif = endColors.g-startColors.g
        var blueDif = endColors.b-startColors.b;
        
        var redInc = parseInt(redDif/size);
        var greenInc = parseInt(greenDif/size);
        var blueInc = parseInt(blueDif/size);

        this.colors = [];
        for(var i=0; i<size; i++){
            startColors.r = startColors.r+redInc;
            startColors.g = startColors.g+greenInc;
            startColors.b = startColors.b+blueInc;
            
            var hex = '#'+this.intToHex(startColors.r)
            +this.intToHex(startColors.g)
            +this.intToHex(startColors.b);

            this.colors.push(hex);
        }

    },

    /**
     * Convert an integer to hexadecimal. Used by createColors
     * @param int number
     */
    intToHex: function(number){
        return (0x1000 + number).toString(16).substr(-2);
    }
};