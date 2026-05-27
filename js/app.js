/*
* APLICACIÓ
*/

let nivellSeleccionat = 0;

$(document).ready(function() {

    $(".btn-nivell").on("click", function() {
        $(".btn-nivell").removeClass("seleccionat");
        $(this).addClass("seleccionat");
        nivellSeleccionat = parseInt($(this).data("nivell"));
    });

    $("#btn-comecar").on("click", function() {
        $("#inici").hide();
        $("#joc").show();

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