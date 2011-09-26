var logError = function (msg) {
  console.warn('triggerfinger error');
  console.error(msg);
  console.log(arguments);
  console.warn('error trace');
  console.trace();
}

// Array Remove - By John Resig (MIT Licensed)
var removeItem = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};
