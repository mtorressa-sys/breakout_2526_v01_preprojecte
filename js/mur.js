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

        const tW = 28;   // amplada totxo
        const tH = 8;    // alçada totxo
        const gap = 3;   // separació entre totxos
        const margeTop = 20;
        const totalAmplada = nCols * (tW + gap) - gap;
        const margeLeft = (ampladaCanvas - totalAmplada) / 2;

        for (let f = 0; f < nFiles; f++) {
            for (let c = 0; c < nCols; c++) {
                if (files[f][c] === 'a') {
                    const x = margeLeft + c * (tW + gap);
                    const y = margeTop + f * (tH + gap);
                    let t = new Totxo(new Punt(x, y), tW, tH);
                    t.color = nivel.color;
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
                color: "#4CF",
                totxos:[
                    "aaaaaa",
                    "aaaaaa",
                    "aaaaaa",
                    "aaaaaa",
                ]
            },
            {
                color: "#8D1",
                totxos:[
                    "aaaaaa",
                    " aaaa ",
                    " aaaa ",
                    "aaaaaa",
                ]
            },
            {
                color: "#D30",
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