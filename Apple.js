/**
 * Apple class constructor
 * @param Ground ground
 * @param int x
 * @param int y
 */
function Apple(ground, x, y){
    //The ground for the apple
    this.ground = ground;

    //The apple's position
    this.point = new Point(x,y);

    //If the apple is good (more points) or bad (less points)
    this.isBad = false;

    //The time life for bad apples
    this.timeLife = 30;
}

/**
 * Apple class definition
 */
Apple.prototype = {

    /**
     * Draw the applen on the ground
     */
    draw: function(){
        var ctx = this.ground.ctx;
        var midBlock = parseInt(this.ground.blockSize/2)
        var radius = 8;

        if(this.isBad){
            ctx.fillStyle = '#F00';
        }else{
            ctx.fillStyle = '#00F';
        }
        ctx.beginPath();
        ctx.arc(this.point.x+midBlock, this.point.y+midBlock, 
            this.ground.blockSize/1.5, 0, Math.PI*2, false); 
        ctx.closePath();
        ctx.fill();
    }
};