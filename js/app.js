/*
* APLICACIÓ
*/

$(document).ready(function() {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");

    myCanvas.height = 600;
    myCanvas.width = 1000;

    joc = new Joc(myCanvas,ctx);
    joc.inicialitza();
    animacio();

});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);    
}

