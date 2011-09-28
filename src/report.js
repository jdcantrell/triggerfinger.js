function getFnName(record) {
  fnName = record.fn.toString().match(/function ([a-zA-Z0-9_]*) ?\(/)[1];
  
  if (fnName === "") {
    fnName = "anonymous";
  }
  
  return fnName;
}

// Hash of lookups for fields that need custom values
// We should just access the data as is, so this is the quick fix.
// Lookup should be a callback and take a record as the only arg.
var fieldLookup = {
  fn: function(record) {
    return getFnName(record) + '<a>(View)</a>';
  },
  selector: function(record) {
    return record.selector + '<a>(Items)</a>';
  },
  
};

function createHTMLHead(fields) {
  var length = fields.length,
      tableHeader = '';
  
  for (var i = 0; i < length; i += 1) {
    tableHeader += '<th>' + fields[i] + '</th>';
  }
  
  return '<thead><tr>' + tableHeader + '</tr></thead>';
};

function createHTMLRow(record) {
  //<tr><td>{selector}</td><td>{event}</td><td>{fn}</td><td>{listenMethod}</td></tr>
  var row = '',
      lookup,
      val;
  
  // Build on field at a time
  // Build the template
  for (fieldName in record) {
    lookup = fieldLookup[fieldName] ? fieldLookup[fieldName] : null;
    
    if (lookup !== null) {
      val = lookup(record);
    } else {
      val = record[fieldName];
    }
    
    row += '<td>' + val + '</td>';
  }
  
  return '<tr>' + row + '</tr>';
}

function createHTMLTableFromReport(tableData) {
  var fields = tableData.getFields(),
      table = $('<table></table>'),
      tableHead = createHTMLHead(fields);
  
  table.append(tableHead);
  
  return table;
}

function bindReport() {
  console.group("Captured binds");
  var selectors = {};
  var table = createHTMLTableFromReport(BindTable);
  var rows = '',
      row = '';
  
  BindTable.each(function (idx, record) {
    fnName = getFnName(record);
    
    rows += createHTMLRow(record) + '\n';
    
    console.log( record.selector, record.eventName,record.guid, fnName,record.listenMethod);

    selector = record.selector != "no selector" ? record.selector : record.items;
    if (typeof selectors[selector] === "undefined")
    {
      selectors[selector] = {};
    }
    if (typeof selectors[selector][record.eventName] === "undefined")
    {
      selectors[selector][record.eventName] = [];
    }
    
    selectors[selector][record.eventName].push(record);

  });
  
  table.append($('<tbody></tbody>').html(rows));
  
  jQuery.fn.center = function () {
      this.css("position","absolute");
      this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
      this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
      return this;
  }
  
  var container = $('<div />').css({
    background: '#fff',
    width: '700px',
    height: '400px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '5px',
    zIndex: 2,
    fontSize: '12px',
    color: '#333'
  });
  
  table.css({
    width: '100%',
    textAlign: 'left'
  });
  
  $(window).resize(function () {
    container.center();
  });
  
  container.center();
  
  container.append(table).appendTo(document.body);

  console.groupEnd("Captured binds");


  console.log(selectors); 
}