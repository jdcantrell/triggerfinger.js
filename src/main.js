/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindInterceptor = new Interception({
  postInterception: function (ctx, targetFn, args, result) {
    var data = ctx.data();
    console.log(ctx, ctx.data('events'), args, result);
    BindTable.add({
      eventName: args[0],
      selector: ctx.selector,
      fn: args[1],
      listenMethod: 'bind'
    });
  }
});

//replace jquery functions with our intercepts, preserving the originals
var bindFn = jQuery.fn.bind;
jQuery.fn.extend({bindOriginal: jQuery.fn.bind, bind: function () {}});
jQuery.fn.extend({bind: bindInterceptor.intercept(bindFn)});
