function bindReport() {
  var tableHead = "<table><thead><th>Selector</th><th>Event</th><th>Function(guid)</th><th>Listen Method</th></thead><tbody>";
  var tableFooter = "</tbody></table>";
  var row = "<tr><td>{selector}</td><td>{event}</td><td>{fn}</td><td>{listenMethod}</td></tr>";
  var reportRows = [];
  console.group("Captured binds");
  var selectors = {};
  BindTable.each(function (idx, record) {
    fnName = record.fn.toString().match(/function ([a-zA-Z0-9_]*) ?\(/)[1];
    if (fnName === "") {
      fnName = "anonymous";
    }

    var dataRow = row.replace('{selector}', record.selector + '<a>(Items)</a>');
    dataRow = dataRow.replace('{event}', record.eventName);
    dataRow = dataRow.replace('{fn}', fnName + '<a>(View)</a>');
    dataRow = dataRow.replace('{listenMethod}', record.listenMethod);
    reportRows.push(dataRow);

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
  $('<div>').html(tableHead + reportRows.join("\n") + tableFooter).appendTo(document.body);

  console.groupEnd("Captured binds");


  console.log(selectors); 
}
