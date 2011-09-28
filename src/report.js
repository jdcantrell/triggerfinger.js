function bindReport() {
  console.group("Captured binds");
  BindTable.each(function (idx, record) {
    console.log( record.selector, record.eventName,record.guid, record.fn,record.listenMethod);
  });
  console.groupEnd("Captured binds");

}
