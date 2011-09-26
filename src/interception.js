/*
  Handles intercepting jQuery's triggering and binding routines to inject 
  custom logic for capturing various events.
*/

/*
  An interception is an encapulation for getting a target routine and 
  replacing it with an override. It will keep the original around for 
  reverting and for calling after the injection.
*/
var Interception = function(target, injection){
  var self = this;
      ns;
  
  self.target    = target;
  self.injection = injection;
  
  ns.getTarget = function () {
    return self.original;
  };
  
  return ns;
};