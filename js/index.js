(function (global) {
    "use strict";
    
    // Initializing countdown
    var timer = new Countdown({
        selector: '#timer',
        dateEnd: new Date('2017-11-01 00:00:00'), // Nov 1st
        // dateEnd: new Date('2017-01-24 00:05:00'),
        msgPattern: timerTemplate,
        msgAfter: done,
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
        var $message = global.document.querySelector('#message');
        $message.style.display = 'none';
        return '<span id="final-msg">Congratulazioni Daniela!!<br>' +
               'Ora goditi la meritata pensione!</span><br>' +
               '<img id="smiley" src="images/tada.png"><img id="smiley" src="images/smiley.png"><img id="smiley" src="images/confetti_ball.png">';
    }
    
    var random = Math.floor(Math.random() * backgrounds.length);
    var file = backgrounds[random].filename;
    var title = backgrounds[random].title;
    var source = backgrounds[random].source;
    var sourceUrl = backgrounds[random].sourceUrl;
    
    var $body = global.document.querySelector('body');
    $body.style.backgroundImage = "url('images/" + file + "')";
    
    var $title = global.document.querySelector('#title');
    $title.innerHTML = title;
    var $source = global.document.querySelector('#source');
    $source.innerHTML = source;
    $source.href = sourceUrl;
    
}(window));
    
    