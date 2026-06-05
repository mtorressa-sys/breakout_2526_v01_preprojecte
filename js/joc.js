/*
* CLASSE JOC
*/

class Joc{
    constructor(canvas, ctx, nivell=0) { // Rep el canvas, el context 2D i el nivell escollit
        this.canvas = canvas; // Guardem el canvas
        this.ctx = ctx; // Guardem el context 2D
        this.amplada = canvas.width; // Amplada del canvas
        this.alcada = canvas.height; // Alçada del canvas
        this.totxoamplada = 22; // Amplada dels totxos (no s'usa directament aquí)
        this.totxoalcada = 10; // Alçada dels totxos (no s'usa directament aquí)
        this.totxocolor = 20; // Color dels totxos (no s'usa directament aquí)
        this.vides = 3; // Nombre de vides inicials
        this.punts = 0; // Puntuació inicial
        this.bonus = 500; // bonus inicial de temps
        this.temps = 0; // segons jugats
        this.intervalTemps = null; // Referència al cronòmetre (null = aturat)
        this.nivell = nivell; // Nivell actual
        this.esperant = true; // Indica si la bola està esperant que es premi espai
        this.gameAcabat = false; // Indica si el joc ha acabat

        this.bola = new Bola(new Punt(this.canvas.width/2, this.canvas.height/2), 8); // Creem la bola al centre del canvas
        this.pala = new Pala(new Punt((this.canvas.width-150)/2, this.canvas.height-30), 150, 10); // Creem la pala centrada a baix
        this.mur  = new Mur(); // Creem el mur
        this.mur.generaMur(nivell, this.amplada); // Generem el mur segons el nivell

        this.key = {
            LEFT:  {code:37, pressed:false}, // Tecla fletxa esquerra
            RIGHT: {code:39, pressed:false}, // Tecla fletxa dreta
            SPACE: {code:32, pressed:false}  // Tecla espai
        };

        // Àudio
        this.soFons     = new Audio("so/melodiafons.m4a"); // So de fons del joc
        this.soFons.loop = true; // El so de fons es repeteix en bucle
        this.soFons.volume = 0.5; // Volum al 50%
        this.soGuanyar  = new Audio("so/guanyar.mp3"); // So quan es guanya
        this.soPerdre   = new Audio("so/perdre.mp3"); // So quan es perd
        this.soXoc      = new Audio("so/xoc.mp3"); // So quan la bola xoca amb un totxo
        this.soCaure    = new Audio("so/caure.mp3"); // So quan la bola cau
        this.musicaIniciada = false; // Indica si la música de fons ha començat
    }

    resetBola(){ // Col·loca la bola sobre la pala i la posa en estat d'espera
        this.bola.posicio.x = this.pala.posicio.x + this.pala.amplada / 2; // Centrem la bola sobre la pala
        this.bola.posicio.y = this.pala.posicio.y - this.bola.radi - 2; // Posem la bola just a sobre la pala
        this.bola.vx = Math.random() < 0.5 ? 8 : -8; // Velocitat horitzontal aleatòria
        this.bola.vy = -8; // Velocitat vertical cap amunt
        this.esperant = true; // Tornem a l'estat d'espera
    }

    perdaVida(){ // Resta una vida i comprova si el joc ha acabat
        this.vides--; // Restem una vida
        if (this.vides <= 0) { // Si no queden vides...
            this.esperant = true;
            this.gameAcabat = true;
            this.mostrarGameOver("Game Over", "Has perdut totes les vides!"); // Mostrem el game over
        } else {
            this.resetBola(); // Si encara queden vides, reiniciem la bola
        }
    }

    comprovanGuanya(){ // Comprova si queden totxos per destruir
        const queden = this.mur.totxos.filter(t => !t.tocat); // Filtrem els totxos que no han estat tocats
        if (queden.length === 0) { // Si no queda cap totxo...
            this.esperant = true;
            this.gameAcabat = true;
            this.mostrarGameOver("Has guanyat!", "Tots els blocs destruïts!"); // Mostrem la pantalla de victòria
        }
    }

    mostrarGameOver(titol, missatge){ // Mostra la pantalla de fi de joc
        this.soFons.pause(); // Pausem la música de fons
        this.soFons.currentTime = 0; // Reiniciem la música
        // Parar cronòmetre
        clearInterval(this.intervalTemps); // Aturem el cronòmetre
        this.intervalTemps = null; // Netegem la referència
        if (titol.includes("guanyat")) { // Si el jugador ha guanyat...
            this.soGuanyar.play(); // Reproduïm el so de victòria
            // Sumar bonus de temps a la puntuació final
            this.punts += this.bonus; // Afegim el bonus a la puntuació
            // Mostrar botó de seguent nivell si no estem al darrer
            if (this.nivell < 2) {
                $("#btn-seguent").show(); // Mostrem el botó de nivell següent
            } else {
                $("#btn-seguent").hide(); // Amaguem el botó si és l'últim nivell
            }
        } else {
            this.soPerdre.play(); // Reproduïm el so de derrota
            $("#btn-seguent").hide(); // Amaguem el botó de nivell següent
        }
        // Guardar record
        if (this.punts > 0) {
            guardarRecord(nomJugador, this.punts); // Guardem el record si té punts
        }
        $("#overlay-gameover h2").text(titol); // Posem el títol al overlay
        $("#overlay-gameover p").text(missatge + " Puntuació final: " + this.punts); // Posem el missatge i la puntuació
        $("#overlay-gameover").show(); // Mostrem el overlay de fi de joc
    }

    draw(){ // Dibuixa tots els elements del joc
        this.clearCanvas(); // Esborrem el canvas
        this.mur.draw(this.ctx); // Dibuixem el mur
        this.pala.draw(this.ctx); // Dibuixem la pala
        this.bola.draw(this.ctx); // Dibuixem la bola
        this.dibuixaVides(); // Dibuixem les vides
        this.dibuixaPunts(); // Dibuixem els punts
        this.dibuixaTemps(); // Dibuixem el temps
        if (this.esperant) {
            this.dibuixaMissatgeEspai(); // Si esperem, mostrem el missatge de prémer espai
        }
    }

    dibuixaVides(){ // Dibuixa les vides restants com a cercles
        this.ctx.save(); // Guardem l'estat del context
        this.ctx.font = "bold 18px Tahoma"; // Establim la font
        this.ctx.fillStyle = "#fff"; // Color blanc
        this.ctx.textAlign = "left"; // Alineem a l'esquerra
        this.ctx.fillText("Vides:", 15, 25); // Escrivim el text "Vides:"
        for (let i = 0; i < this.vides; i++) { // Per cada vida restant...
            this.ctx.beginPath();
            this.ctx.fillStyle = "#fff";
            this.ctx.arc(85 + i * 28, 18, 10, 0, 2 * Math.PI); // Dibuixem un cercle per cada vida
            this.ctx.fill();
        }
        this.ctx.restore(); // Restaurem l'estat del context
    }

    dibuixaPunts(){ // Dibuixa la puntuació a la part superior dreta
        this.ctx.save(); // Guardem l'estat del context
        this.ctx.font = "bold 18px Tahoma"; // Establim la font
        this.ctx.fillStyle = "#fff"; // Color blanc
        this.ctx.textAlign = "right"; // Alineem a la dreta
        this.ctx.fillText("Punts: " + this.punts, this.amplada - 15, 25); // Escrivim els punts
        this.ctx.restore(); // Restaurem l'estat del context
    }

    dibuixaTemps(){ // Dibuixa el temps i el bonus al centre superior
        this.ctx.save(); // Guardem l'estat del context
        this.ctx.font = "bold 18px Tahoma"; // Establim la font
        this.ctx.fillStyle = "#fff"; // Color blanc
        this.ctx.textAlign = "center"; // Alineem al centre
        this.ctx.fillText("⏱ " + this.temps + "s  |  Bonus: " + this.bonus, this.amplada / 2, 25); // Escrivim el temps i el bonus
        this.ctx.restore(); // Restaurem l'estat del context
    }

    dibuixaMissatgeEspai(){ // Dibuixa el missatge de prémer espai al centre del canvas
        this.ctx.save(); // Guardem l'estat del context
        this.ctx.font = "bold 22px Tahoma"; // Establim la font
        this.ctx.fillStyle = "#fff"; // Color blanc
        this.ctx.textAlign = "center"; // Alineem al centre
        this.ctx.fillText("Prem ESPAI per llençar la bola", this.amplada / 2, this.alcada / 2); // Escrivim el missatge
        this.ctx.restore(); // Restaurem l'estat del context
    }

    clearCanvas(){ // Esborra tot el contingut del canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Netegem tot el canvas
    }

    inicialitza(){ // Inicialitza el joc i assigna els esdeveniments de teclat i botons
        this.resetBola(); // Col·loquem la bola a la posició inicial
        this.draw(); // Dibuixem l'estat inicial

        $(document).on("keydown", {joc:this}, function(e){ // Escoltem quan es prem una tecla
            if (e.which === joc.key.LEFT.code)  joc.key.LEFT.pressed  = true; // Marquem esquerra com a premuda
            if (e.which === joc.key.RIGHT.code) joc.key.RIGHT.pressed = true; // Marquem dreta com a premuda
            if (e.which === joc.key.SPACE.code && joc.esperant) { // Si premem espai i estem esperant...
                joc.esperant = false; // Deixem d'esperar, la bola comença a moure's
                if (!joc.musicaIniciada) {
                    joc.soFons.play(); // Iniciem la música de fons
                    joc.musicaIniciada = true; // Marquem la música com a iniciada
                }
                // Arrancar cronòmetre si no estava en marxa
                if (!joc.intervalTemps) {
                    joc.intervalTemps = setInterval(function() {
                        joc.temps++; // Sumem un segon al temps
                        joc.bonus = Math.max(0, 500 - joc.temps * 2); // Reduïm el bonus amb el temps (mínim 0)
                    }, 1000);
                }
                e.preventDefault(); // Evitem el comportament per defecte de la tecla espai
            }
        });
        $(document).on("keyup", {joc:this}, function(e){ // Escoltem quan es deixa de prémer una tecla
            if (e.which === joc.key.LEFT.code)  joc.key.LEFT.pressed  = false; // Marquem esquerra com a no premuda
            if (e.which === joc.key.RIGHT.code) joc.key.RIGHT.pressed = false; // Marquem dreta com a no premuda
        });

        // Botons del game over
        $("#btn-reiniciar").on("click", function(){ // Quan es clica el botó de reiniciar...
            soNivell.currentTime = 0;
            soNivell.play(); // Reproduïm el so de nivell
            $("#overlay-gameover").hide(); // Amaguem el overlay de fi de joc
            $("#btn-seguent").hide(); // Amaguem el botó de nivell següent
            joc.vides = 3; // Reiniciem les vides
            joc.punts = 0; // Reiniciem els punts
            joc.bonus = 500; // Reiniciem el bonus
            joc.temps = 0; // Reiniciem el temps
            clearInterval(joc.intervalTemps); // Aturem el cronòmetre
            joc.intervalTemps = null; // Netegem la referència
            joc.gameAcabat = false; // El joc ja no ha acabat
            joc.musicaIniciada = false; // La música tornarà a iniciar-se
            joc.mur.generaMur(joc.nivell, joc.amplada); // Regenerem el mur
            joc.resetBola(); // Reiniciem la bola
        });
        $("#btn-seguent").on("click", function(){ // Quan es clica el botó de nivell següent...
            soNivell.currentTime = 0;
            soNivell.play(); // Reproduïm el so de nivell
            $("#overlay-gameover").hide(); // Amaguem el overlay de fi de joc
            $("#btn-seguent").hide(); // Amaguem el botó de nivell següent
            const puntsSalsats = joc.punts; // Guardem els punts actuals
            const videsActuals = joc.vides; // Guardem les vides actuals
            const nivellSeguent = joc.nivell + 1; // Calculem el nivell següent
            joc.nivell = nivellSeguent; // Actualitzem el nivell
            joc.vides = videsActuals; // manté les vides actuals
            joc.punts = puntsSalsats; // manté la puntuació acumulada
            joc.bonus = 500; // Reiniciem el bonus
            joc.temps = 0; // Reiniciem el temps
            clearInterval(joc.intervalTemps); // Aturem el cronòmetre
            joc.intervalTemps = null; // Netegem la referència
            joc.gameAcabat = false; // El joc ja no ha acabat
            joc.musicaIniciada = false; // La música tornarà a iniciar-se
            joc.mur.generaMur(nivellSeguent, joc.amplada); // Generem el mur del nivell següent
            joc.resetBola(); // Reiniciem la bola
        });
        $("#btn-setup").on("click", function(){ // Quan es clica el botó de tornar al menú...
            soNivell.currentTime = 0;
            soNivell.play(); // Reproduïm el so de nivell
            setTimeout(() => location.reload(), 200); // Recarreguem la pàgina després de 200ms
        });
    }

    update(){ // Actualitza l'estat del joc cada frame
        if (this.gameAcabat) return; // Si el joc ha acabat, no fem res

        // Si esperant, la bola segueix la pala però no es mou sola
        if (this.esperant) {
            this.bola.posicio.x = this.pala.posicio.x + this.pala.amplada / 2; // La bola segueix la pala
            this.bola.posicio.y = this.pala.posicio.y - this.bola.radi - 2; // La bola es queda sobre la pala
            this.pala.update(); // Actualitzem la pala
            this.draw(); // Dibuixem l'estat
            return; // Sortim sense moure la bola
        }
        this.bola.update(); // Actualitzem la bola
        this.pala.update(); // Actualitzem la pala
        this.comprovanGuanya(); // Comprovem si el jugador ha guanyat
        this.draw(); // Dibuixem l'estat actualitzat
    }
}