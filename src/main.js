/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindInterceptor = new Interception({
  postInterception: function (ctx, targetFn, args, result) {
    var data = ctx.data();
    BindTable.add({
      eventName: args[0],
      selector: ctx.selector,
      fn: args[1],
      guid: args[1].guid,
      listenMethod: 'bind'
    });
  }
});

var triggerInterceptor = new Interception({
  postInterception: function (ctx, targetFn, args, result) {
    var data = ctx.data();
    var eventHandlers = ctx.data('events');
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

//table debugging messages
$(BindTable).bind('add', function (event, record) {
  console.log('Bind logged:', record.eventName, record.guid, record.selector, record.listenMethod, record);
});

$(TriggerTable).bind('add', function (event, record) {
  console.log('Trigger logged:', record.eventName, record.guid, record.listenMethod, record);
});

