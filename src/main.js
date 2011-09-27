/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindCallback = function(ctx, target, args, result) {
      console.log(ctx);
      BindTable.add({
        eventName: args[1],
        selector: 'test',
        fn: 'test',
        listenMethod: 'test'
      });
    },
    interception = new Interception({ preInterception: bindCallback });

jQuery.fn.bind = interception.intercept(jQuery.fn.bind);

var test = {};

$(document).ready(function () {
  $('html').bind('bsevent', function () {
    console.log('this is the callback');
  });
  
  $('html').one('onebsevent', function () {
    console.log('this is the callback');
  });
  
  $('html').live('liveevent', function () {
    console.log('live event');
  });
  
  $('html').delegate('click', 'div', function () {});
});