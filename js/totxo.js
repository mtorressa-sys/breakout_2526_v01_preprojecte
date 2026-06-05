/*
* CLASSE TOTXO
*/

class Totxo{
    constructor(puntPosicio, amplada, alcada){ // Rep la posició inicial, amplada i alçada
  
    this.amplada=amplada; 
    this.alcada=alcada;         // mides
    this.tocat=false;       // marquem els totxos tocats per la bola => no es pintaran
    this.posicio = puntPosicio; // posició, en píxels respecte el canvas
    this.color; // Color del totxo (s'assigna des del Mur)
    this.punts; // Punts que dona destruir aquest totxo (s'assigna des del Mur)

    }

    get area() { // Propietat calculada que retorna l'àrea del totxo
        return this.amplada * this.alcada;
    }
    
    draw(ctx) { // Dibuixa el totxo només si no ha estat tocat
        if (!this.tocat){ // Si el totxo no ha estat tocat...
            ctx.save(); // Guardem l'estat del context
            ctx.fillStyle = this.color; // Establim el color del totxo
            ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada); // Dibuixem el rectangle
            ctx.restore(); // Restaurem l'estat del context
        }
        
    }

    puntInteriorRectangle(punt){ // Comprova si un punt està dins del totxo
        return (punt.x >= this.posicio.x && // El punt és més a la dreta que el costat esquerre
            punt.x <= this.posicio.x + this.amplada) && // El punt és més a l'esquerra que el costat dret
            (punt.y >= this.posicio.y && // El punt és més avall que el costat superior
                punt.y<=this.posicio.y+this.alcada); // El punt és més amunt que el costat inferior
    }
};