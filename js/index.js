/**
 * Created by stebogit on 1/21/17.
 */
(function (global) {
    "use strict";
    
    // Initializing countdown
    var timer = new Countdown({
        selector: '#timer',
        dateEnd: new Date('2017-11-01 00:00:00'), // Nov 1st
        // dateEnd: new Date('2017-01-01 00:00:00'),
        msgPattern: timerTemplate,
        msgAfter: done,
        onEnd: cleanMsg,
        leadingZeros: true,
    });
    
    function timerTemplate() {
        return '<table class="container">' +
            '<tr class="numbers">' +
                '<td>{days}</td>' +
                '<td>{hours}</td>' +
                '<td>{minutes}</td>' +
                '<td>{seconds}</td>' +
            '</tr>' +
            '<tr class="text">' +
                '<td>giorni</td>' +
                '<td>ore</td>' +
                '<td>minuti</td>' +
                '<td>secondi</td>' +
            '</tr>' +
        '</table>';
    }
    
    function done() {
        return '<span id="final-msg">Congratulazioni Daniela!!</span>' +
               '<img id="smiley" src="images/smiley.png">';
    }
    
    function cleanMsg() {
        
    }
    
    var random = Math.floor(Math.random() * backgrounds.length);
    var file = backgrounds[random].filename;
    
    var $body = global.document.querySelector('body');
    $body.style.backgroundImage = "url('images/" + file + "')";
    
}(window));
    
    