var DataTable = function (fields) {
  var table = [];

  return {
    add: function (record) {
      var i = fields.length;
      while (i--)
      {
        if (typeof record[fields[i]] == 'undefined' || record[fields[i]] === null)
        {
          logError('Incomplete record given to DataTable', record, 'missing', fields[i]);
          return 0;
        }
      }

      table.push(record);

      $(this).triggerHandler('add', record);

      return 1;
    },
    remove: function (key, value) {
      var i = table.length, affected = 0, records = [];
      while (i--)
      {
        if (table[i][key] === value)
        {
          records.push(table[i]);

          //defined in util.js, removes an item from an array and reindexes
          //we should be okay modifying the array here since we are counting
          //from array.length to 0
          removeItem(table, i);
          affected++;
        }
      }

      $(this).triggerHandler('remove', records, key, value);

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
};

//setup our event data tables
var BindTable = new DataTable(['eventName', 'selector', 'fn', 'listenMethod']);
var TriggerTable = new DataTable(['eventName', 'target', 'fn', 'count']);


$(BindTable).bind('add', function (event, record) {
  console.log('Bind logged:', record.eventName, record.selector, record.listenMethod, record);
});

