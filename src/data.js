var DataTable = function (fields) {
  var table = [];
  var indexes = [];
  var indexTables = {};
  var _fields = [];
  var unique = 0;

  return {
    getFields: function () {
      var record;
      if (_fields.length === 0) {
        record = table[0] ? table[0] : null;
        if (record) {
          for (field in record) {
            _fields.push(field);
          }
        }
      }
      return _fields;
    },
    add: function (record) {
      var i = fields.length;
      while (i--)
      {
        if (typeof record[fields[i]] == 'undefined' && record[fields[i]] === null)
        {
          logError('Incomplete record given to DataTable', record, 'missing', fields[i]);
          return 0;
        }
      }

      //add to complete table
      table.push(record);

      //add to index
      indexTable = indexTables;
      for (var i = 0; i < indexes.length; i += 1)
      {
        for (var j = 0; j < indexes[i].length; j += 1)
        {
          if (typeof indexTable[indexes[i][j]] === "undefined")
          {
            if (j < indexes[i].length - 1)
            {
              indexTable[indexes[i][j]] = {}
            }
            else 
            {
              indexTable[indexes[i][j]] = []
            }
          }
          indexTable = indexTable[indexes[i][j]];
        }
        indexTable.push(record);
      }

      if (typeof record._uid === "undefined")
      {
        record._uid = unique;
        unique += 1;
      }

      $(this).triggerHandler('add', record);

      return 1;
    },
    removeAll: function () {
      table = [];
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
    get: function (keyVal) {
      var fields = [];
      for (i in keyVal) {
        fields.push(i);
      }

      //see if there is an index record
      var indexTable = indexTables;
      for(i = 0; i < fields.length; i += 1)
      {
        if (typeof indexTable[fields[i]] !== 'undefined' && indexTable[fields[i]] !== null)
        {
          
          indexTable = indexTable[fields[i]];
        }

      }
      if (indexTable !== indexTables && typeof indexTable !== "undefined")
      {
        return indexTable;
      }

      //need to brute force since we do not hit any indexes
      var records = [];
      var i = table.length;
      var pass = true;
      while (i--)
      {
        pass = true;
        for(key in keyVal)
        {
          if (table[i][key] !== keyVal[key])
          {
            pass = false;
          }
        }
        if (pass)
        {
          records.push(table[i]);
        }
      }
      return records;
    },
    count: function () {
      return table.length;
    },
    each: function (fn) {
      var i;
      for (i = 0; i < table.length; i++)
      {
        fn(i, table[i]);
      }
    },
    createIndex: function (indexFields) {
      indexes.push(indexFields);
      //TODO: index all current records
    }
  };
};
