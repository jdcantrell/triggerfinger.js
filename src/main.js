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
  preInterception: function (ctx, targetFn, args) {
    this.start = Date.now();
  },
  postInterception: function (ctx, targetFn, args, result) {
    var event = args[0];

    //grabbed from jquery event.handle
		var handlers = ((jQuery.data( ctx, "events" ) || {})[ event.type ] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call( arguments, 0 );

		for ( var j = 0, l = handlers.length; j < l; j++ ) {
			var handleObj = handlers[ j ];
      
      if (typeof handleObj !== "undefined")
      {
        TriggerTable.add({
          eventName: event.type,
          target: ctx,
          fn: handleObj,
          guid: handleObj.guid,
          bindGuid: handleObj.handler.bindGuid,
          count: 1,
          runTime: Date.now() - this.start
        });
      }
    }

  }
});

//replace jquery functions with our intercepts, preserving the originals
var bindFn = jQuery.fn.bind;
jQuery.fn.extend({bindOriginal: jQuery.fn.bind, bind: function () {}});
jQuery.fn.extend({bind: bindInterceptor.intercept(bindFn)});

var eventTriggerFn = jQuery.event.handle;
jQuery.event.handle = triggerInterceptor.intercept(jQuery.event.handle);

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
  menu.find('a').bindOriginal('click', function () {
    var anchor = $(this);

    if ($('#tf-bind-report').length === 0)
    {
      anchor.html('Hide Binds');
      bindReport();
    }
    else
    {
      anchor.html('View Binds');
      $('#tf-bind-report').remove();
    }

  });
  menu.appendTo(document.body)
});
