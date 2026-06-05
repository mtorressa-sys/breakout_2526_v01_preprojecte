/*
* CLASSE PALA
*/

class Pala {
    constructor(puntPosicio, amplada, alcada){ // Rep la posició inicial, amplada i alçada     
        this.amplada = amplada; // Guardem l'amplada de la pala
        this.alcada = alcada; // Guardem l'alçada de la pala
        this.posicio = puntPosicio; // Guardem la posició (punt x,y)
        this.vy = 2; // Velocitat vertical (no s'usa en aquest joc)    
        this.vx = 13; // velocitat = 13 píxels per fotograma
        this.color = "#D30"; // Color vermell de la pala
    }

    update(){ // Actualitza la posició de la pala segons les tecles premudes
        if (joc.key.LEFT.pressed && this.posicio.x > 0) { // Si premem esquerra i no hem arribat al límit
            this.posicio.x -= this.vx; // Movem la pala cap a l'esquerra
        }
        if (joc.key.RIGHT.pressed && this.posicio.x + this.amplada < joc.amplada) { // Si premem dreta i no hem arribat al límit
            this.posicio.x += this.vx; // Movem la pala cap a la dreta
        }
    }
   
    draw(ctx) { // Dibuixa la pala al canvas
        ctx.save(); // Guardem l'estat del context
        ctx.fillStyle = this.color; // Establim el color de la pala
        ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada); // Dibuixem el rectangle
        ctx.restore(); // Restaurem l'estat del context
    }

    mou(x,y){ // Mou la pala sumant x i y a la posició actual
        this.posicio.x += x; // Desplacem en x
        this.posicio.y += y; // Desplacem en y
    }
}