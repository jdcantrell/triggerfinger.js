var DataTable = function (fields) {
  var table = []

  return {
    add: function (record) {
      var i = fields.length;
      while (i--)
      {
        if (typeof record[fields[i]] == 'undefined' || record[fields[i]] === null)
        {
          logError('Incomplete record given to BindTable', record);
          return 0;
        }
      }

      table.push(record);
      return 1;
    },
    remove: function (key, value) {
      var i = table.length;
      var affected = 0;
      while (i--)
      {
        if (table[i][key] === value)
        {
          //defined in util.js, removes an item from an array and reindexes
          //we should be okay modifying the array here since we are counting
          //from array.length to 0
          removeItem(table, i);
          affected++;
        }
      }
      return affected;
    }, 
    get: function (key, value) {
      var records = [];
      var i = table.length;
      while (i--)
      {
        if (table[i][key] === value)
        {
          records.push(table[i]);
        }
      }
      return records;
    },
    count: function () {
      return table.length;
    }
  };
}
var BindTable = new DataTable(['eventName', 'selector', 'function', 'listenMethod']);
var TriggerTable = new DataTable(['eventName', 'target', 'function', 'count']);

