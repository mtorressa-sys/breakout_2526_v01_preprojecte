/*
* APLICACIÓ
*/

let nivellSeleccionat = 0;
const soNivell    = new Audio("so/nivells.mp3");
const soComençar  = new Audio("so/començar.mp3");

$(document).ready(function() {

    $(".btn-nivell").on("click", function() {
        $(".btn-nivell").removeClass("seleccionat");
        $(this).addClass("seleccionat");
        nivellSeleccionat = parseInt($(this).data("nivell"));
        // So clic nivell
        soNivell.currentTime = 0;
        soNivell.play();
    });

    $("#btn-comecar").on("click", function() {
        // So clic començar
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