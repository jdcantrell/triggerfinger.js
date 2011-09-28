function bindReport() {
  console.group("Captured binds");
  var selectors = {};
  
  var bindTableDecoration = new DataDecoration(BindTable, {
    id: 'tf-bind-report'
  });
  
  bindTableDecoration.render();
  
  BindTable.each(function (idx, record) {
    fnName = getFnName(record);
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

  console.groupEnd("Captured binds");


  console.log(selectors); 
}