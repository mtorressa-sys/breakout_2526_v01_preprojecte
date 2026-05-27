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
        this.vides = 3;
        this.nivell = nivell;
        this.esperant = true;
        this.gameAcabat = false;

        this.bola = new Bola(new Punt(this.canvas.width/2, this.canvas.height/2), 8);
        this.pala = new Pala(new Punt((this.canvas.width-150)/2, this.canvas.height-30), 150, 10);
        this.mur  = new Mur();
        this.mur.generaMur(nivell, this.amplada);

        this.key = {
            LEFT:  {code:37, pressed:false},
            RIGHT: {code:39, pressed:false},
            SPACE: {code:32, pressed:false}
        };
    }

    resetBola(){
        this.bola.posicio.x = this.pala.posicio.x + this.pala.amplada / 2;
        this.bola.posicio.y = this.pala.posicio.y - this.bola.radi - 2;
        this.bola.vx = 8;
        this.bola.vy = -8;
        this.esperant = true;
    }

    perdaVida(){
        this.vides--;
        if (this.vides <= 0) {
            this.esperant = true;
            this.gameAcabat = true;
            this.mostrarGameOver("Game Over", "Has perdut totes les vides!");
        } else {
            this.resetBola();
        }
    }

    comprovanGuanya(){
        const queden = this.mur.totxos.filter(t => !t.tocat);
        if (queden.length === 0) {
            this.esperant = true;
            this.gameAcabat = true;
            this.mostrarGameOver("Has guanyat!", "Tots els blocs destruïts!");
        }
    }

    mostrarGameOver(titol, missatge){
        $("#overlay-gameover h2").text(titol);
        $("#overlay-gameover p").text(missatge);
        $("#overlay-gameover").show();
    }

    draw(){
        this.clearCanvas();
        this.mur.draw(this.ctx);
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.dibuixaVides();
        if (this.esperant) {
            this.dibuixaMissatgeEspai();
        }
    }

    dibuixaVides(){
        this.ctx.save();
        this.ctx.font = "bold 18px Tahoma";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Vides:", 15, 25);
        for (let i = 0; i < this.vides; i++) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "#fff";
            this.ctx.arc(85 + i * 28, 18, 10, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    dibuixaMissatgeEspai(){
        this.ctx.save();
        this.ctx.font = "bold 22px Tahoma";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Prem ESPAI per llençar la bola", this.amplada / 2, this.alcada / 2);
        this.ctx.restore();
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    inicialitza(){
        this.resetBola();
        this.draw();

        $(document).on("keydown", {joc:this}, function(e){
            if (e.which === joc.key.LEFT.code)  joc.key.LEFT.pressed  = true;
            if (e.which === joc.key.RIGHT.code) joc.key.RIGHT.pressed = true;
            if (e.which === joc.key.SPACE.code && joc.esperant) {
                joc.esperant = false;
                e.preventDefault();
            }
        });
        $(document).on("keyup", {joc:this}, function(e){
            if (e.which === joc.key.LEFT.code)  joc.key.LEFT.pressed  = false;
            if (e.which === joc.key.RIGHT.code) joc.key.RIGHT.pressed = false;
        });

        // Botons del game over
        $("#btn-reiniciar").on("click", function(){
            $("#overlay-gameover").hide();
            joc.vides = 3;
            joc.mur.generaMur(joc.nivell, joc.amplada);
            joc.resetBola();
        });
        $("#btn-setup").on("click", function(){
            location.reload();
        });
    }

    update(){
        if (this.gameAcabat) return;

        // Si esperant, la bola segueix la pala però no es mou sola
        if (this.esperant) {
            this.bola.posicio.x = this.pala.posicio.x + this.pala.amplada / 2;
            this.bola.posicio.y = this.pala.posicio.y - this.bola.radi - 2;
            this.pala.update();
            this.draw();
            return;
        }
        this.bola.update();
        this.pala.update();
        this.comprovanGuanya();
        this.draw();
    }
}