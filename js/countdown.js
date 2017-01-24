/*! Countdown.js | Copyright (c) 2013 Hugo Giraudel | MIT License */

(function(global) {
  "use strict";

  // Vanilla JS alternative to $.extend
  global.extend = function (obj, extObj) {
    obj = obj || {};
    if (arguments.length > 2) {
      for (var a = 1; a < arguments.length; a++) {
        global.extend(obj, arguments[a]);
      }
    } else {
      for (var i in extObj) {
        obj[i] = extObj[i];
      }
    }
    return obj;
  };

  // Countdown constructor
  var Countdown = function (conf) {
    this.conf = global.extend({
      // Dates
      dateStart    : new Date(),
      dateEnd      : new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),

      // Default elements
      selector     : ".timer",

      // Messages
      msgBefore    : "Be ready!",
      msgAfter     : "It's over, sorry folks!",
      msgPattern   : "{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left.",

      // Callbacks
      onStart      : null,
      onEnd        : null,

      // Extra options
      leadingZeros : false,
      initialize   : true,
    }, conf);

    // Private variables
    this.started = false;
    this.selector = document.querySelectorAll(this.conf.selector);
    this.interval = 1000;
    this.patterns = [
      { pattern: "{years}", secs: 31536000 },
      { pattern: "{months}", secs: 2628000 },
      { pattern: "{weeks}", secs: 604800 },
      { pattern: "{days}", secs: 86400 },
      { pattern: "{hours}", secs: 3600 },
      { pattern: "{minutes}", secs: 60 },
      { pattern: "{seconds}", secs: 1 }
    ];

    // Doing all the things!
    if (this.initialize !== false) {
      this.initialize();
    }
  };

  // Initializing the instance
  Countdown.prototype.initialize = function () {
    this.defineInterval();

    // Already over
    if (this.isOver()) {
      return this.outOfInterval();
    }
    
    this.run();
  };

  // Converting a date into seconds
  Countdown.prototype.seconds = function (date) {
    return date.getTime() / 1000;
  };

  // Returning if countdown has started yet
  Countdown.prototype.isStarted = function () {
    return this.seconds(new Date()) >= this.seconds(this.conf.dateStart);
  };

  // Returning if countdown is over yet
  Countdown.prototype.isOver = function () {
    return this.seconds(new Date()) >= this.seconds(this.conf.dateEnd);
  };

  // Running the countdown
  Countdown.prototype.run = function () {
    var that = this,
        sec  = Math.abs(this.seconds(this.conf.dateEnd) - this.seconds(new Date())),
        timer;

    // Initial display before first tick
    if (this.isStarted()) {
      this.display(sec);
    }

    // Not started yet
    else {
      this.outOfInterval();
    }

    // Vanilla JS alternative to $.proxy
    timer = global.setInterval(function () {
      sec--;

      // Time over
      if (sec <= 0) {
        global.clearInterval(timer);
        that.outOfInterval();
        that.callback("end");
      }

      else if (that.isStarted()) {
        if (!that.started) {
          that.callback("start");
          that.started = true;
        }

        that.display(sec);
      }
    }, this.interval);
  };

  // Displaying the countdown
  Countdown.prototype.display = function (sec) {
    var pattern = (typeof this.conf.msgPattern == "function")
      ? this.conf.msgPattern()
      : this.conf.msgPattern;
    
    var output = pattern;

    for (var b = 0; b < this.patterns.length; b++) {
      var currentPattern = this.patterns[b];

      if (pattern.indexOf(currentPattern.pattern) !== -1) {
        var number = Math.floor(sec / currentPattern.secs),
            displayed = this.conf.leadingZeros && number <= 9 ? "0" + number : number;
        sec -= number * currentPattern.secs;
        output = output.replace(currentPattern.pattern, displayed);
      }
    }
    for (var c = 0; c < this.selector.length; c++) {
      this.selector[c].innerHTML = output;
    }
  };
  
  
  // private helper function: get the default display style of the element
  Countdown.prototype._defaultDisplay = function(tag) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('width', 0);
    iframe.setAttribute('height', 0);
    document.documentElement.appendChild(iframe);

    var doc = (iframe.contentWindow || iframe.contentDocument).document;

    // IE support
    doc.write();
    doc.close();

    var testEl = doc.createElement(tag);
    doc.documentElement.appendChild(testEl);
    var display = (window.getComputedStyle ? getComputedStyle(testEl, null) : testEl.currentStyle).display;
    iframe.parentNode.removeChild(iframe);
    return display;
  };

  // private helper function, actual show/hide function used by show() and hide() below
  Countdown.prototype._showHide = function(el, show) {
    var value = el.getAttribute('data-olddisplay'),
        display = el.style.display,
        computedDisplay = (window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle).display;

    if (show) {
      if (!value && display === 'none') el.style.display = '';
      if (el.style.display === '' && (computedDisplay === 'none')) value = value || this._defaultDisplay(el.nodeName);
    } else {
      if (display && display !== 'none' || !(computedDisplay == 'none'))
        el.setAttribute('data-olddisplay', (computedDisplay == 'none') ? display : computedDisplay);
    }
    if (!show || el.style.display === 'none' || el.style.display === '')
      el.style.display = show ? value || '' : 'none';
  };

  // show element(s), like $.show()
  Countdown.prototype.show = function () {
    for (var d = 0; d < this.selector.length; d++) {
      this._showHide(this.selector[d], true);
    }
  };
  // hide element(s), like $.hide()
  Countdown.prototype.hide =function () {
    for (var d = 0; d < this.selector.length; d++) {
      this._showHide(this.selector[d]);
    }
  };
  
  // Defining the interval to be used for refresh
  Countdown.prototype.defineInterval = function () {
    for (var e = this.patterns.length; e > 0; e--) {
      var currentPattern = this.patterns[e-1];
      var pattern = (typeof this.conf.msgPattern == "function")
          ? this.conf.msgPattern()
          : this.conf.msgPattern;
      if (pattern.indexOf(currentPattern.pattern) !== -1) {
        this.interval = currentPattern.secs * 1000;
        return;
      }
    }
  };

  // Canceling the countdown in case it's over
  Countdown.prototype.outOfInterval = function () {
    var message;
    if (new Date() < this.conf.dateStart) {
      message = (typeof this.conf.msgBefore == "function")
          ? this.conf.msgBefore()
          : this.conf.msgBefore;
    } else {
      message = (typeof this.conf.msgAfter == "function")
          ? this.conf.msgAfter()
          : this.conf.msgAfter;
    }

    for (var d = 0; d < this.selector.length; d++) {
      if (this.selector[d].innerHTML !== message) {
        this.selector[d].innerHTML = message;
      }
    }
  };

  // Dealing with events and callbacks
  Countdown.prototype.callback = function (event) {
    var e = event.capitalize();

    // onStart callback
    if (typeof this.conf["on" + e] === "function") {
      this.conf["on" + e]();
    }

    // Triggering a jQuery event if jQuery is loaded
    if (typeof global.jQuery !== "undefined") {
      global.jQuery(this.conf.selector).trigger("countdown" + e);
    }
  };

  // Adding a capitalize method to String
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  global.Countdown = Countdown;
}(window));