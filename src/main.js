/*
 Assumes jQuery is included already. Will override various event binding/triggering routines.
*/

var bindCallback = function(target, args, result) {
      BindTable.add({
        eventName: args[1],
        selector: args[0].selector,
        
      });
    },
    interception = new Interception({ preInterception: bindCallback });

jQuery.event.add = interception.intercept(jQuery.event.add);

var test = {};

$(document).ready(function () {
  $('html').bind('click', function () {
    console.log('this is the callback');
  });
  
  $('html').trigger('click');
  
});