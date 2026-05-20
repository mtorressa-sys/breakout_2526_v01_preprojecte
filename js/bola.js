/*
* CLASSE BOLA
*/

class Bola {
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.vx = 3;
        this.vy = -3;
        this.color = "#fff";
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    mou(x, y) {
        this.posicio.x += x;
        this.posicio.y += y;
    }

    update() {
        let puntActual = this.posicio;
        let puntSeguent = new Punt(this.posicio.x + this.vx,
                                   this.posicio.y + this.vy);
        let trajectoria = new Segment(puntActual, puntSeguent);
        let exces;
        let xoc = false;

        // Xoc lateral superior
        if (trajectoria.puntB.y - this.radi < 0) {
            exces = (trajectoria.puntB.y - this.radi) / this.vy;
            this.posicio.x = trajectoria.puntB.x - exces * this.vx;
            this.posicio.y = this.radi;
            xoc = true;
            this.vy = -this.vy;
        }
        // Xoc lateral dret
        if (!xoc && trajectoria.puntB.x + this.radi > joc.amplada) {
            exces = (trajectoria.puntB.x + this.radi - joc.amplada) / this.vx;
            this.posicio.x = joc.amplada - this.radi;
            this.posicio.y = trajectoria.puntB.y - exces * this.vy;
            xoc = true;
            this.vx = -this.vx;
        }
        // Xoc lateral esquerra
        if (!xoc && trajectoria.puntB.x - this.radi < 0) {
            exces = (trajectoria.puntB.x - this.radi) / this.vx;
            this.posicio.x = this.radi;
            this.posicio.y = trajectoria.puntB.y - exces * this.vy;
            xoc = true;
            this.vx = -this.vx;
        }
        // Xoc lateral inferior (perd vida - de moment rebota)
        if (!xoc && trajectoria.puntB.y + this.radi > joc.alcada) {
            exces = (trajectoria.puntB.y + this.radi - joc.alcada) / this.vy;
            this.posicio.x = trajectoria.puntB.x - exces * this.vx;
            this.posicio.y = joc.alcada - this.radi;
            xoc = true;
            this.vy = -this.vy;
        }

        // Xoc amb la pala
        // Comprovem si la bola toca la vora superior de la pala
        if (!xoc) {
            let pala = joc.pala;
            let bolaX = trajectoria.puntB.x;
            let bolaY = trajectoria.puntB.y;

            if (this.vy > 0 &&
                bolaX + this.radi > pala.posicio.x &&
                bolaX - this.radi < pala.posicio.x + pala.amplada &&
                bolaY + this.radi >= pala.posicio.y &&
                bolaY - this.radi <= pala.posicio.y + pala.alcada) {

                this.posicio.y = pala.posicio.y - this.radi;
                this.posicio.x = bolaX;
                this.vy = -this.vy;
                xoc = true;
            }
        }

        // Xoc amb els totxos del mur
        // Utilitzem el metode interseccioSegmentRectangle
        if (!xoc) {
            const nx = trajectoria.puntB.x;
            const ny = trajectoria.puntB.y;
            for (let t of joc.mur.totxos) {
                if (t.tocat) continue;
                // Comprovació AABB: la bola (cercle) se solapa amb el totxo?
                if (nx + this.radi > t.posicio.x &&
                    nx - this.radi < t.posicio.x + t.amplada &&
                    ny + this.radi > t.posicio.y &&
                    ny - this.radi < t.posicio.y + t.alcada) {

                    xoc = true;
                    t.tocat = true;
                    // Quin costat té menys solapament -> per allà ha entrat
                    const solapSup  = (this.posicio.y + this.radi) - t.posicio.y;
                    const solapInf  = (t.posicio.y + t.alcada) - (this.posicio.y - this.radi);
                    const solapEsq  = (this.posicio.x + this.radi) - t.posicio.x;
                    const solapDret = (t.posicio.x + t.amplada) - (this.posicio.x - this.radi);
                    const min = Math.min(solapSup, solapInf, solapEsq, solapDret);

                    if (min === solapSup || min === solapInf) {
                        this.vy = -this.vy;
                    } else {
                        this.vx = -this.vx;
                    }
                    this.posicio.x = nx;
                    this.posicio.y = ny;
                    break;
                }
            }
        }

        if (!xoc) {
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }
    }

    interseccioSegmentRectangle(segment, rectangle) {
        let puntI;
        let distanciaI;
        let puntIMin;
        let distanciaIMin = Infinity;
        let voraI;

        // vora superior
        let segmentVoraSuperior = new Segment(rectangle.posicio,
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y));
        // vora inferior
        let segmentVoraInferior = new Segment(
            new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada),
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada));
        // vora esquerra
        let segmentVoraEsquerra = new Segment(rectangle.posicio,
            new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada));
        // vora dreta
        let segmentVoraDreta = new Segment(
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y),
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada));

        // vora superior
        puntI = segment.puntInterseccio(segmentVoraSuperior);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "superior";
            }
        }
        // vora inferior
        puntI = segment.puntInterseccio(segmentVoraInferior);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "inferior";
            }
        }
        // vora esquerra
        puntI = segment.puntInterseccio(segmentVoraEsquerra);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "esquerra";
            }
        }
        // vora dreta
        puntI = segment.puntInterseccio(segmentVoraDreta);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "dreta";
            }
        }

        if (voraI) {
            return { pI: puntIMin, vora: voraI };
        }
    }

    distancia = function(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }
}