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

        const tW = 70;    // amplada totxo
        const tH = 18;    // alçada totxo
        const gap = 4;    // separació entre totxos
        const margeTop = 50;  // espai per vides i punts
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
                // Nivell 1: rectangle complet 12x6, 1 vida, color blau
                vides: 1,
                colors: ["#4CF"],
                totxos:[
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
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