/*
  Handles intercepting jQuery's triggering and binding routines to inject 
  custom logic for capturing various events.
*/

/*
  An interception is an encapulation for getting a target routine and 
  replacing it with an override. It will keep the original around for 
  reverting and for calling after the injection.
*/
var Interception = function(options){
  var self = this,
      ns = {},
      defaults = {
        preInterception: function (target, args) {},
        postInterception: function (target, args, result) {}
      };
  
  options = $.extend(defaults, options);
  
  ns.intercept = function (target) {
    return function () {
      var result;
      
      options.preInterception(target, arguments);
      
      result = target.apply(target, arguments);
      
      return options.postInterception(target, arguments, result);
    };
  };
  
  return ns;
};