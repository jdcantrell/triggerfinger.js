var BindTable = (function () {
  var fields = ['eventName', 'selector', 'function', 'listenMethod'];

  return {
    add: function (record) {
      var i = fields.length;
      while (i--)
      {
        if (typeof record[fields[i]] == 'undefined' || record[fields[i]] === null)
        {
          logError('Incomplete record given to BindTable', record);
        }
      }
    },
    delete: function (key, value) {
    }, 
    get: function (key, value) {
      return {};
    },
    count: function () {
      return 0;
    }
  };

})();
