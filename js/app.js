/*
* APLICACIÓ
*/

let nivellSeleccionat = 0; // Variable que guarda el nivell escollit
let nomJugador = ""; // Variable que guarda el nom del jugador
var soNivell    = new Audio("so/nivells.mp3"); // So quan es selecciona un nivell
var soComençar  = new Audio("so/començar.mp3"); // So quan es prem començar

// --- Records (localStorage) ---
function obtenirRecords() { // Funció que retorna els records guardats al navegador
    const dades = localStorage.getItem("breakout_records"); // Llegim les dades guardades
    return dades ? JSON.parse(dades) : []; // Si hi ha dades les retornem, si no llista buida
}

function guardarRecord(nom, punts) { // Funció que guarda un nou record
    let records = obtenirRecords(); // Obtenim els records actuals
    records.push({ nom: nom, punts: punts }); // Afegim el nou record a la llista
    // Ordenar de més gran a més petit i agafar el top 5
    records.sort((a, b) => b.punts - a.punts); // Ordenem de major a menor puntuació
    records = records.slice(0, 5); // Ens quedem només els 5 primers
    localStorage.setItem("breakout_records", JSON.stringify(records)); // Guardem la llista al navegador
}

function mostrarRecords() { // Funció que mostra els records per pantalla
    const records = obtenirRecords(); // Obtenim els records guardats
    const llista = $("#llista-records"); // Seleccionem l'element HTML de la llista
    llista.empty(); // Buidem la llista abans de pintar-la
    if (records.length === 0) { // Si no hi ha records...
        llista.append("<li><span class='nom'>Encara no hi ha records!</span></li>"); // Mostrem missatge
    } else {
        records.forEach((r, i) => { // Recorrem cada record
            llista.append(`<li><span class='nom'>${i+1}. ${r.nom}</span><span class='pts'>${r.punts} pts</span></li>`); // El pintem a la llista
        });
    }
}

$(document).ready(function() { // S'executa quan la pàgina ha carregat del tot

    // Mostrar records en carregar
    mostrarRecords(); // Mostrem els records en carregar la pàgina

    // Selecció de nivell
    $(".btn-nivell").on("click", function() { // Quan es clica un botó de nivell
        $(".btn-nivell").removeClass("seleccionat"); // Treiem la selecció de tots els botons
        $(this).addClass("seleccionat"); // Marquem com a seleccionat el botó clicat
        nivellSeleccionat = parseInt($(this).data("nivell")); // Guardem el nivell escollit
        soNivell.currentTime = 0; // Reiniciem el so
        soNivell.play(); // Reproduïm el so
    });

    // Botó començar
    $("#btn-comecar").on("click", function() { // Quan es prem el botó de començar
        nomJugador = $("#input-nom").val().trim(); // Llegim el nom escrit sense espais
        if (nomJugador === "") { // Si no ha escrit cap nom...
            nomJugador = "Anònim"; // Posem "Anònim" per defecte
        }

        soComençar.currentTime = 0; // Reiniciem el so
        soComençar.play(); // Reproduïm el so de començar

        $("#inici").hide(); // Amaguem la pantalla d'inici
        $("#joc-wrap").show(); // Mostrem el canvas del joc

        let myCanvas = document.getElementById("joc"); // Obtenim l'element canvas
        let ctx = myCanvas.getContext("2d"); // Obtenim el context 2D per dibuixar

        myCanvas.height = 600; // Definim l'alçada del canvas
        myCanvas.width = 1000; // Definim l'amplada del canvas

        joc = new Joc(myCanvas, ctx, nivellSeleccionat); // Creem l'objecte joc
        joc.inicialitza(); // Inicialitzem el joc
        animacio(); // Arranquem el bucle d'animació
    });

});

function animacio() { // Bucle principal del joc
    joc.update(); // Actualitza la lògica i dibuixa el frame
    requestAnimationFrame(animacio); // Es torna a cridar a si mateixa (~60 cops per segon)
}