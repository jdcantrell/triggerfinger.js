/*
  Handles intercepting jQuery's triggering and binding routines to inject 
  custom logic for capturing various events.
*/

/*
  An interception is an encapsulation for getting a target routine and 
  replacing it with an override. It will keep the original around for 
  reverting and for calling after the injection.
*/
var Interception = function(options){
  var self = this,
      ns = {},
      defaults = {
        preInterception: function (context, targetFn, args) {},
        postInterception: function (context, targetFn, args, result) {}
      };
  
  options = $.extend(defaults, options);
  
  ns.intercept = function (targetFn) {
    return function () {
      var result;
      
      options.preInterception(this, targetFn, arguments);

      result = targetFn.apply(this, arguments);

      options.postInterception(this, targetFn, arguments, result);

      return result;
    };
  };
  
  return ns;
};
