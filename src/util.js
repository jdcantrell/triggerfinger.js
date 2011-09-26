var logError = function (msg) {
  console.warn('triggerfinger error');
  console.error(msg);
  console.log(arguments);
  console.warn('error trace');
  console.trace();
}
