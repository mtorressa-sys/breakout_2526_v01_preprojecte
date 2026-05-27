/*
* CLASSE JOC
*/

class Joc{
    constructor(canvas, ctx, nivell=0) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
        this.totxoamplada = 22;
        this.totxoalcada = 10;
        this.totxocolor = 20;

        this.bola = new Bola(new Punt(this.canvas.width/2, this.canvas.height/2), 8);
        this.pala = new Pala(new Punt((this.canvas.width-150)/2, this.canvas.height-15), 150, 10);
        this.mur  = new Mur();
        this.mur.generaMur(nivell, this.amplada);

        this.key = {
            LEFT: {code:37, pressed:false},
            RIGHT:{code:39, pressed:false}
        };
    }

    draw(){
        this.clearCanvas();
        this.mur.draw(this.ctx);
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    inicialitza(){
        this.mur.draw(this.ctx);
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);

        $(document).on("keydown", {joc:this}, function(e){
            if (e.which === joc.key.LEFT.code)  joc.key.LEFT.pressed  = true;
            if (e.which === joc.key.RIGHT.code) joc.key.RIGHT.pressed = true;
        });
        $(document).on("keyup", {joc:this}, function(e){
            if (e.which === joc.key.LEFT.code)  joc.key.LEFT.pressed  = false;
            if (e.which === joc.key.RIGHT.code) joc.key.RIGHT.pressed = false;
        });
    }

    update(){
        this.bola.update();
        this.pala.update();
        this.draw();
    }
}