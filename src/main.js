/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindInterceptor = new Interception({
  postInterception: function (ctx, targetFn, args, result) {
    var fn = args[args.length - 1];
    var selector = ctx.selector !== "" ? ctx.selector : "no selector";

    BindTable.add({
      eventName: args[0],
      selector: selector,
      items: ctx,
      fn: fn,
      guid: fn.guid,
      listenMethod: 'bind'
    });
  }
});

var triggerInterceptor = new Interception({
  postInterception: function (ctx, targetFn, args, result) {
    var data = ctx.data();
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
//jQuery.fn.extend({triggerOriginal: jQuery.fn.trigger, trigger: function () {}});
//jQuery.fn.extend({trigger: triggerInterceptor.intercept(triggerFn)});

//setup our event data tables
var BindTable = new DataTable(['eventName', 'selector', 'fn', 'guid', 'listenMethod']);
BindTable.createIndex(['eventName', 'guid']);

var TriggerTable = new DataTable(['eventName', 'target', 'fn', 'guid', 'count']);
TriggerTable.createIndex(['eventName', 'guid']);

//table debugging messages
$(BindTable).bindOriginal('add', function (event, record) {
  //console.log('Bind logged:', record.eventName, record.guid, record.selector, record.listenMethod, record);
});

$(TriggerTable).bindOriginal('add', function (event, record) {
  //console.log('Trigger logged:', record.eventName, record.guid, record.listenMethod, record);
});

