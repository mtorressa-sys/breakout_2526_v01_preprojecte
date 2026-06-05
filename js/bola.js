/*
* CLASSE BOLA
*/

class Bola {
    constructor(puntPosicio, radi) { // Rep la posició inicial i el radi de la bola
        this.radi = radi; // Guardem el radi
        this.posicio = puntPosicio; // Guardem la posició (punt x,y)
        this.vx = Math.random() < 0.5 ? 8 : -8; // Velocitat horitzontal aleatòria: dreta o esquerra
        this.vy = -8; // Velocitat vertical: sempre cap amunt al iniciar
        this.color = "#fff"; // Color blanc de la bola
    }

    draw(ctx) { // Dibuixa la bola al canvas
        ctx.beginPath(); // Iniciem el traçat
        ctx.fillStyle = this.color; // Establim el color
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI); // Dibuixem el cercle
        ctx.fill(); // Omplim el cercle
        ctx.closePath(); // Tanquem el traçat
    }

    mou(x, y) { // Mou la bola sumant x i y a la posició actual
        this.posicio.x += x; // Desplacem en x
        this.posicio.y += y; // Desplacem en y
    }

    update() { // Actualitza la posició de la bola i gestiona tots els xocs
        let puntActual = this.posicio; // Posició actual de la bola
        let puntSeguent = new Punt(this.posicio.x + this.vx,
                                   this.posicio.y + this.vy); // Posició on anirà la bola al següent frame
        let trajectoria = new Segment(puntActual, puntSeguent); // Segment entre posició actual i la següent
        let exces; // Variable per calcular quant s'ha passat del límit
        let xoc = false; // Indica si hi ha hagut xoc aquest frame

        // Xoc lateral superior
        if (trajectoria.puntB.y - this.radi < 0) { // Si la bola surt per dalt
            exces = (trajectoria.puntB.y - this.radi) / this.vy; // Calculem l'excés de moviment
            this.posicio.x = trajectoria.puntB.x - exces * this.vx; // Ajustem la posició X
            this.posicio.y = this.radi; // Col·loquem la bola tocant la paret superior
            xoc = true; // Marquem que hi ha hagut xoc
            this.vy = -this.vy; // Invertim la velocitat vertical
        }
        // Xoc lateral dret
        if (!xoc && trajectoria.puntB.x + this.radi > joc.amplada) { // Si la bola surt per la dreta
            exces = (trajectoria.puntB.x + this.radi - joc.amplada) / this.vx; // Calculem l'excés
            this.posicio.x = joc.amplada - this.radi; // Col·loquem la bola tocant la paret dreta
            this.posicio.y = trajectoria.puntB.y - exces * this.vy; // Ajustem la posició Y
            xoc = true;
            this.vx = -this.vx; // Invertim la velocitat horitzontal
        }
        // Xoc lateral esquerra
        if (!xoc && trajectoria.puntB.x - this.radi < 0) { // Si la bola surt per l'esquerra
            exces = (trajectoria.puntB.x - this.radi) / this.vx; // Calculem l'excés
            this.posicio.x = this.radi; // Col·loquem la bola tocant la paret esquerra
            this.posicio.y = trajectoria.puntB.y - exces * this.vy; // Ajustem la posició Y
            xoc = true;
            this.vx = -this.vx; // Invertim la velocitat horitzontal
        }
        // Xoc lateral inferior (perd vida)
        if (!xoc && trajectoria.puntB.y + this.radi > joc.alcada) { // Si la bola surt per baix
            xoc = true;
            joc.soCaure.currentTime = 0;
            joc.soCaure.play(); // Reproduïm el so de caure
            joc.perdaVida(); // El jugador perd una vida
        }

        // Xoc amb la pala
        // Comprovem si la bola toca la vora superior de la pala
        if (!xoc) {
            let pala = joc.pala; // Agafem la pala del joc
            let bolaX = trajectoria.puntB.x; // Posició X futura de la bola
            let bolaY = trajectoria.puntB.y; // Posició Y futura de la bola

            if (this.vy > 0 && // La bola va cap avall
                bolaX + this.radi > pala.posicio.x && // La bola no queda a l'esquerra de la pala
                bolaX - this.radi < pala.posicio.x + pala.amplada && // La bola no queda a la dreta de la pala
                bolaY + this.radi >= pala.posicio.y && // La bola arriba a la part superior de la pala
                bolaY - this.radi <= pala.posicio.y + pala.alcada) { // La bola no passa per sota la pala

                this.posicio.y = pala.posicio.y - this.radi; // Col·loquem la bola sobre la pala
                this.posicio.x = bolaX; // Mantenim la posició X
                this.vy = -this.vy; // Invertim la velocitat vertical
                xoc = true;
            }
        }

        // Xoc amb els totxos del mur
         // Utilitzem el metode interseccioSegmentRectangle
        if (!xoc) {
            const nx = trajectoria.puntB.x; // Posició X futura de la bola
            const ny = trajectoria.puntB.y; // Posició Y futura de la bola
            for (let t of joc.mur.totxos) { // Recorrem tots els totxos
                if (t.tocat) continue; // Si el totxo ja està destruït, el saltem
                // Comprovació AABB: la bola (cercle) se solapa amb el totxo?
                if (nx + this.radi > t.posicio.x &&
                    nx - this.radi < t.posicio.x + t.amplada &&
                    ny + this.radi > t.posicio.y &&
                    ny - this.radi < t.posicio.y + t.alcada) { // Si la bola toca el totxo

                    xoc = true;
                    t.vida--; // Restem una vida al totxo
                    joc.punts += t.punts; // Sumem els punts al jugador
                    // So de xoc amb totxo
                    joc.soXoc.currentTime = 0;
                    joc.soXoc.play(); // Reproduïm el so de xoc
                    if (t.vida <= 0) {
                        // Sense vides -> desapareix
                        t.tocat = true; // Marquem el totxo com a destruït
                    } else {
                        // Canvia al color de la vida restant
                        t.color = t.colors[t.colors.length - t.vida]; // Canviem el color del totxo
                    }
                     // Quin costat té menys solapament -> per allà ha entrat
                    const solapSup  = (this.posicio.y + this.radi) - t.posicio.y; // Solapament per dalt
                    const solapInf  = (t.posicio.y + t.alcada) - (this.posicio.y - this.radi); // Solapament per baix
                    const solapEsq  = (this.posicio.x + this.radi) - t.posicio.x; // Solapament per l'esquerra
                    const solapDret = (t.posicio.x + t.amplada) - (this.posicio.x - this.radi); // Solapament per la dreta
                    const min = Math.min(solapSup, solapInf, solapEsq, solapDret); // Agafem el mínim solapament

                    if (min === solapSup || min === solapInf) {
                        this.vy = -this.vy; // Xoc vertical: invertim vy
                    } else {
                        this.vx = -this.vx; // Xoc horitzontal: invertim vx
                    }
                    this.posicio.x = nx; // Actualitzem la posició X
                    this.posicio.y = ny; // Actualitzem la posició Y
                    break; // Sortim del bucle, només xoquem amb un totxo per frame
                }
            }
        }

        if (!xoc) { // Si no hi ha hagut cap xoc...
            this.posicio.x = trajectoria.puntB.x; // Movem la bola a la posició següent X
            this.posicio.y = trajectoria.puntB.y; // Movem la bola a la posició següent Y
        }
    }

    interseccioSegmentRectangle(segment, rectangle) { // Calcula si un segment intersecta amb un rectangle i per quina vora
        let puntI; // Punt d'intersecció trobat
        let distanciaI; // Distància fins al punt d'intersecció
        let puntIMin; // Punt d'intersecció més proper
        let distanciaIMin = Infinity; // Distància mínima (iniciem a infinit)
        let voraI; // Vora per on s'ha produït la intersecció

        // vora superior
        let segmentVoraSuperior = new Segment(rectangle.posicio,
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y)); // Segment de la vora superior
        // vora inferior
        let segmentVoraInferior = new Segment(
            new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada),
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada)); // Segment de la vora inferior
        // vora esquerra
        let segmentVoraEsquerra = new Segment(rectangle.posicio,
            new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada)); // Segment de la vora esquerra
        // vora dreta
        let segmentVoraDreta = new Segment(
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y),
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada)); // Segment de la vora dreta

        // vora superior
        puntI = segment.puntInterseccio(segmentVoraSuperior); // Comprovem intersecció amb vora superior
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI); // Calculem la distància
            if (distanciaI < distanciaIMin) { distanciaIMin = distanciaI; puntIMin = puntI; voraI = "superior"; } // Guardem si és la més propera
        }
        // vora inferior
        puntI = segment.puntInterseccio(segmentVoraInferior); // Comprovem intersecció amb vora inferior
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) { distanciaIMin = distanciaI; puntIMin = puntI; voraI = "inferior"; }
        }
        // vora esquerra
        puntI = segment.puntInterseccio(segmentVoraEsquerra); // Comprovem intersecció amb vora esquerra
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) { distanciaIMin = distanciaI; puntIMin = puntI; voraI = "esquerra"; }
        }
        // vora dreta
        puntI = segment.puntInterseccio(segmentVoraDreta); // Comprovem intersecció amb vora dreta
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) { distanciaIMin = distanciaI; puntIMin = puntI; voraI = "dreta"; }
        }

        if (voraI) { // Si hem trobat alguna intersecció...
            return { pI: puntIMin, vora: voraI }; // Retornem el punt més proper i la vora
        }
    }

    distancia = function(p1, p2) { // Calcula la distància entre dos punts
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)); // Fórmula de la distància euclidiana
    }
}