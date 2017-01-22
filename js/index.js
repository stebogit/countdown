/**
 * Created by stebogit on 1/21/17.
 */
(function (global) {
    "use strict";
    
    // Initializing countdown
    var timer = new Countdown({
        selector: '#timer',
        dateEnd: new Date('2017-11-01 00:00:00'),
        msgPattern: '{days} {hours} {minutes} {seconds}',
        // msgPattern: function() { return '{days} {hours} {minutes} {seconds}'; },
        onStart: function () {
            console.log('Starting countdown');
        },
        onEnd: function () {
            console.log('Ending countdown');
        },
        leadingZeros: true,
        initialize: true,
    });
    
    
    var random = Math.floor(Math.random() * backgrounds.length);
    var file = backgrounds[random].filename;
    
    
    var $body = global.document.querySelector('body');
    $body.style.backgroundImage = "url('images/" + file + "')";
    
    
}(window));
    
    