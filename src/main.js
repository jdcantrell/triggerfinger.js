/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindCallback = function(ctx, target, args, result) {
      debugger;
      BindTable.add({
        eventName: args[1],
        selector: 'test',
        fn: 'test',
        listenMethod: 'test'
      });
    },
    interception = new Interception({ preInterception: bindCallback });

var bindInterceptor = new Interception({
  postInterception: function (ctx, target, args, result) {
    var data = ctx.data();
    console.log(data);
    console.log(ctx.data('events'), args);
    BindTable.add({
      eventName: args[0],
      selector: 'test',
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
<<<<<<< HEAD
  $('#tester').bind('testEvent', function () {
=======
  $('html').bind('bsevent', function () {
    console.log('this is the callback');
  });
  //$('html').trigger('bsevent');
  $('html').one('onebsevent', function () {
>>>>>>> Committing some intermediate debugging for review.
    console.log('this is the callback');
  });
});
