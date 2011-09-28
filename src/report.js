function bindReport() {
  console.group("Captured binds");
  var selectors = {};
  BindTable.each(function (idx, record) {
    console.log( record.selector, record.eventName,record.guid, record.fn,record.listenMethod);

    if (typeof selectors[record.selector] === "undefined")
    {
      selectors[record.selector] = {};
    }
    if (typeof selectors[record.selector][record.eventName] === "undefined")
    {
      selectors[record.selector][record.eventName] = [];
    }
    
    selectors[record.selector][record.eventName].push(record);

  });
  console.groupEnd("Captured binds");
  console.log(selectors); 
}
