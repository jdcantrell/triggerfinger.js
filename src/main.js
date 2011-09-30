/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindInterceptor = new Interception({
  guid: 0,
  preInterception: function (ctx, targetFn, args) {
    this.guid += 1;
    this.start = Date.now();
    args[args.length -1].bindGuid = this.guid;
  },
  postInterception: function (ctx, targetFn, args, result) {
    var bindTime = Date.now() - this.start;
    var fn = args[args.length - 1];
    var selector = ctx.selector !== "" ? ctx.selector : "no selector";
    
    BindTable.add({
      eventName: args[0],
      selector: selector,
      items: ctx,
      fn: fn,
      bindTime: bindTime,
      time: Date.now(),
      length: ctx.length,
      guid: this.guid,
      listenMethod: 'bind'
    });
  }
});

var triggerInterceptor = new Interception({
  postInterception: function (ctx, targetFn, args, result) {
    try {
      var data = ctx.data();
    }
    catch (exception) {
      console.error('Could not get event handlers from', ctx, args);
      return;
    }
    var eventHandlers = ctx.data('events');
    if (typeof eventHandlers !== "undefined" && typeof eventHandlers[args[0]] !== 'undefined')
    {
      var i = eventHandlers[args[0]].length;

      while (i--)
      {
        TriggerTable.add({
          eventName: args[0],
          selector: ctx.selector,
          target: ctx[0],
          fn: eventHandlers[args[0]][i].handler,
          guid: eventHandlers[args[0]][i].guid,
          bindGuid: eventHandlers[args[0]][i].handler.bindGuid,
          count: 1
        });
      }
    }
  }
});

//replace jquery functions with our intercepts, preserving the originals
var bindFn = jQuery.fn.bind;
jQuery.fn.extend({bindOriginal: jQuery.fn.bind, bind: function () {}});
jQuery.fn.extend({bind: bindInterceptor.intercept(bindFn)});

var triggerFn = jQuery.fn.trigger;
jQuery.fn.extend({triggerOriginal: jQuery.fn.trigger, trigger: function () {}});
jQuery.fn.extend({trigger: triggerInterceptor.intercept(triggerFn)});

//setup our event data tables
var BindTable = new DataTable(['eventName', 'selector', 'fn', 'guid', 'listenMethod']);
BindTable.createIndex(['eventName', 'guid']);

var TriggerTable = new DataTable(['eventName', 'target', 'fn', 'guid', 'count']);
TriggerTable.createIndex(['eventName', 'guid']);

//add ui for displaying report
$(document).ready( function () {
  var menu = $('<div></div>');
  menu.attr('id', 'triggerFinger_menu');
  menu.css({
    position: 'absolute',
    top: 10,
    right: 5,
    padding: '5px',
    borderRadius: '3px',
    backgroundColor: 'rgb(68,68,68)',
    opacity: '.6',
    zIndex: '10000000'
  });

  menu.html('<a href="#">View Binds</a>');

  menu.find('a').css({color: 'rgb(221,221,221)'});
  menu.find('a').click( function () {
    var anchor = $(this);
    if (anchor.html() === "View Binds")
    {
      anchor.html('Hide Binds');
      bindReport();
      $('#tf-bind-report').css('zIndex', '10000000');
    }
    else
    {
      anchor.html('View Binds');
      $('#tf-bind-report').remove();
    }

  });
  menu.appendTo(document.body)
});
