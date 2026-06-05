/*
* CLASSE MUR
*/

class Mur {
    constructor() { // Constructor: inicialitza la llista de totxos buida
        this.totxos = [];
    }

    generaMur(nivell, ampladaCanvas){ // Genera el mur segons el nivell i l'amplada del canvas
        this.totxos = []; // Buidem la llista de totxos
        this.defineixNivells(); // Carreguem la definició de tots els nivells
        const nivel = this.nivells[nivell]; // Agafem el nivell escollit
        const files = nivel.totxos; // Agafem el patró de files del nivell
        const nCols = files[0].length; // Nombre de columnes (longitud de la primera fila)
        const nFiles = files.length; // Nombre de files

        const tW = 70;    // amplada totxo
        const tH = 18;    // alçada totxo
        const gap = 4;    // separació entre totxos
        const margeTop = 50;  // espai per vides i punts
        const totalAmplada = nCols * (tW + gap) - gap; // Amplada total del mur
        const margeLeft = (ampladaCanvas - totalAmplada) / 2; // Marge esquerre per centrar el mur

        for (let f = 0; f < nFiles; f++) { // Recorrem cada fila
            for (let c = 0; c < nCols; c++) { // Recorrem cada columna
                if (files[f][c] === 'a') { // Si la cel·la és 'a', hi posem un totxo
                    const x = margeLeft + c * (tW + gap); // Calculem la posició X del totxo
                    const y = margeTop + f * (tH + gap); // Calculem la posició Y del totxo
                    let t = new Totxo(new Punt(x, y), tW, tH); // Creem el totxo
                    t.vida = nivel.vides;       // vides que li queden
                    t.colors = nivel.colors;    // array de colors
                    t.color = nivel.colors[0];  // color inicial (màxima vida)
                    t.punts = 10; // Punts que dona destruir el totxo
                    this.totxos.push(t); // Afegim el totxo a la llista
                }
            }
        }
    }

    draw(ctx){ // Dibuixa tots els totxos del mur
        for (let t of this.totxos) { // Recorrem cada totxo
            t.draw(ctx); // Dibuixem el totxo
        }
    }

    defineixNivells(){ // Defineix l'estructura, vides i colors de cada nivell
        this.nivells=[
            {
                // Nivell 1: rectangle complet 12x6, 1 vida, color blau
                vides: 1,
                colors: ["#4CF"],
                totxos:[
                    "aaaaaaaaaaaa",
                    /* "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa", */ //falta descomentar per fer el nivell 1 bé (ara esta en mostra per a la classe)
                ]
            },
            {
                // Nivell 2: espiral, 2 vides, vermell -> blau
                vides: 2,
                colors: ["#D30", "#4CF"],
                totxos:[
                    "aaaaaaaaaaaa",
                    "a          a",
                    "a  aaaaaa  a",
                    "a  a    a  a",
                    "a  a    a  a",
                    "a  aaaaaa  a",
                    "a          a",
                    "aaaaaaaaaaaa",
                ]
            },
            {
                // Nivell 3: Space Invader, 3 vides, verd -> vermell -> blau
                vides: 3,
                colors: ["#8D1", "#D30", "#4CF"],
                totxos:[
                    " a       a ",
                    "  a     a  ",
                    " aaaaaaaa  ",
                    "aa aaaaa aa",
                    "aaaaaaaaaaa",
                    "a aaaaaaa a",
                    "a a     a a",
                    "   aa aa   ",
                ]
            }
        ];
    }
}