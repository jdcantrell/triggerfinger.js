/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindInterceptor = new Interception({
  postInterception: function (ctx, target, args, result) {
    a = ctx;
    var data = ctx.data();
    console.log(ctx, ctx.data('events'), args, result);
    BindTable.add({
      eventName: args[0],
      selector: 'unknown',
      fn: args[1],
      listenMethod: 'bind'
    });
  }
});

//replace jquery functions with our intercepts, preserving the originals
var bindFn = jQuery.fn.bind;
jQuery.fn.extend({bindOriginal: jQuery.fn.bind, bind: function () {}});
jQuery.fn.extend({bind: bindInterceptor.intercept(bindFn)});

var test = {};

$(document).ready(function () {
  $('#tester').bind('click', function () {
    console.log('this is the callback');
  });
});
