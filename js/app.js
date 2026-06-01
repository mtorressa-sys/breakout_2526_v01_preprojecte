/*
* APLICACIÓ
*/

let nivellSeleccionat = 0;
let nomJugador = "";
var soNivell    = new Audio("so/nivells.mp3");
var soComençar  = new Audio("so/començar.mp3");

// --- Records (localStorage) ---
function obtenirRecords() {
    const dades = localStorage.getItem("breakout_records");
    return dades ? JSON.parse(dades) : [];
}

function guardarRecord(nom, punts) {
    let records = obtenirRecords();
    records.push({ nom: nom, punts: punts });
    // Ordenar de més gran a més petit i agafar el top 5
    records.sort((a, b) => b.punts - a.punts);
    records = records.slice(0, 5);
    localStorage.setItem("breakout_records", JSON.stringify(records));
}

function mostrarRecords() {
    const records = obtenirRecords();
    const llista = $("#llista-records");
    llista.empty();
    if (records.length === 0) {
        llista.append("<li><span class='nom'>Encara no hi ha records!</span></li>");
    } else {
        records.forEach((r, i) => {
            llista.append(`<li><span class='nom'>${i+1}. ${r.nom}</span><span class='pts'>${r.punts} pts</span></li>`);
        });
    }
}

$(document).ready(function() {

    // Mostrar records en carregar
    mostrarRecords();

    // Selecció de nivell
    $(".btn-nivell").on("click", function() {
        $(".btn-nivell").removeClass("seleccionat");
        $(this).addClass("seleccionat");
        nivellSeleccionat = parseInt($(this).data("nivell"));
        soNivell.currentTime = 0;
        soNivell.play();
    });

    // Botó començar
    $("#btn-comecar").on("click", function() {
        nomJugador = $("#input-nom").val().trim();
        if (nomJugador === "") {
            nomJugador = "Anònim";
        }

        soComençar.currentTime = 0;
        soComençar.play();

        $("#inici").hide();
        $("#joc-wrap").show();

        let myCanvas = document.getElementById("joc");
        let ctx = myCanvas.getContext("2d");

        myCanvas.height = 600;
        myCanvas.width = 1000;

        joc = new Joc(myCanvas, ctx, nivellSeleccionat);
        joc.inicialitza();
        animacio();
    });

});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);
}