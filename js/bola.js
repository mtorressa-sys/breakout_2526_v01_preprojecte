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

            // La bola ve de dalt cap avall (vy > 0) i toca la part superior de la pala
            if (this.vy > 0 &&
                bolaX + this.radi > pala.posicio.x &&
                bolaX - this.radi < pala.posicio.x + pala.amplada &&
                bolaY + this.radi >= pala.posicio.y &&
                bolaY - this.radi <= pala.posicio.y + pala.alcada) {

                // Col·loquem la bola just a sobre de la pala
                this.posicio.y = pala.posicio.y - this.radi;
                this.posicio.x = bolaX;
                // Invertim direcció vertical -> surt cap amunt
                this.vy = -this.vy;
                xoc = true;
            }
        }

        // Xoc amb els totxos del mur
        // Utilitzem el metode interseccioSegmentRectangle

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
        // vora esquerra
        // vora dreta

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
        // vora esquerra
        // vora dreta

        if (voraI) {
            return { pI: puntIMin, vora: voraI };
        }
    }

    distancia = function(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }
}