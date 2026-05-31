/*
* CLASSE MUR
*/

class Mur {
    constructor() {
        this.totxos = [];
    }

    generaMur(nivell, ampladaCanvas){
        this.totxos = [];
        this.defineixNivells();
        const nivel = this.nivells[nivell];
        const files = nivel.totxos;
        const nCols = files[0].length;
        const nFiles = files.length;

        const tW = 100;   // amplada totxo
        const tH = 28;    // alçada totxo
        const gap = 5;   // separació entre totxos
        const margeTop = 20;
        const totalAmplada = nCols * (tW + gap) - gap;
        const margeLeft = (ampladaCanvas - totalAmplada) / 2;

        for (let f = 0; f < nFiles; f++) {
            for (let c = 0; c < nCols; c++) {
                if (files[f][c] === 'a') {
                    const x = margeLeft + c * (tW + gap);
                    const y = margeTop + f * (tH + gap);
                    let t = new Totxo(new Punt(x, y), tW, tH);
                    t.vida = nivel.vides;       // vides que li queden
                    t.colors = nivel.colors;    // array de colors
                    t.color = nivel.colors[0];  // color inicial (màxima vida)
                    t.punts = 10;
                    this.totxos.push(t);
                }
            }
        }
    }

    draw(ctx){
        for (let t of this.totxos) {
            t.draw(ctx);
        }
    }

    defineixNivells(){
        this.nivells=[
            {
                // Nivell 1: 1 vida, color blau
                vides: 1,
                colors: ["#4CF"],
                totxos:[
                    "aaaaaa",
                    "aaaaaa",
                    "aaaaaa",
                    "aaaaaa",
                ]
            },
            {
                // Nivell 2: 2 vides, vermell -> blau
                vides: 2,
                colors: ["#D30", "#4CF"],
                totxos:[
                    "aaaaaa",
                    " aaaa ",
                    " aaaa ",
                    "aaaaaa",
                ]
            },
            {
                // Nivell 3: 3 vides, verd -> vermell -> blau
                vides: 3,
                colors: [ "#8D1", "#D30", "#4CF"],
                totxos:[
                    "aaaaaa",
                    "a    a",
                    "a    a",
                    "aaaaaa",
                ]
            }
        ];
    }
}