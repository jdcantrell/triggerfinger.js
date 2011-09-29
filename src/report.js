function getSelectorName(record) {
  var selector = record.selector
  if (record.selector === "no selector")
  {
    try {
      selector = JSON.stringify(record.items);
    }
    catch (exception) {
      var item_names = [];
      record.items.each(function (idx, item) {
        var name = "";

        var id = typeof item.id != "undefined" ? item.id : false;
        var className = typeof item.className != "undefined" ? item.className : false;
        var node = typeof item.nodeName != "undefined" ? item.nodeName : false;

        if (item === document) {
          name = "Document";
        }
        else if (id) {
          name = '#' + item.id 
          if (className || node)
          {
            name += '(' 
                 + (node ? node : "") 
                 + (className ? "." + className : "")
                 + ')';
          }
        }
        else if (node) {
          if (className) {
            name = node + "." + className;
          }
          name = node
        }

        item_names.push(name);
      })
      selector = '(no selector)' + item_names.join(',');
    }
  }
  return selector;
}

function bindReport() {
  var tableHead = "<table><thead><th>Selector</th><th>Event</th><th>Function(guid)</th><th>Listen Method</th></thead><tbody>";
  var tableFooter = "</tbody></table>";
  var row = "<tr><td>{selector}</td><td>{event}</td><td>{fn}</td><td>{listenMethod}</td></tr>";
  console.group("Captured binds");
  var selectors = {};
  
  var bindTableDecoration = new DataDecoration(BindTable, {
    id: 'tf-bind-report'
  });
  
  bindTableDecoration.render();
  
  BindTable.each(function (idx, record) {
    fnName = getFnName(record);
    if (fnName === "") {
      fnName = "anonymous";
    }


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

function bindReport2 () {
  var previousBindTime = 0, maxTime = 0, minTime = Date.now(), runTime = 0, bindCount = 0,
      itemCount = 0, reportRows = {}, selectors = {};

  var rows = "";
  reportTable = new DataTable(['Event', 'Selector', 'Function', 'Bind Time', 'Items Bound', 'Bind Gap']);

  BindTable.each(function (idx, record) {
    rec = {
      'Event': record.eventName,
      'Selector': getSelectorName(record) + '<a class="tf-view-selector" href="#">(view)</a>',
      'Function': getFnName(record) + '<a class="tf-view-function" href="#">(view)</a>',
      'Bind Time': record.bindTime + 'ms',
      'Items Bound': record.length,
      'Bind Gap': previousBindTime != 0 ? (record.time - previousBindTime) + 'ms' : ' - '
    };
    reportTable.add(rec);
    previousBindTime = record.time;
    maxTime = Math.max(maxTime, record.time);
    minTime = Math.min(minTime, record.time);
    runTime += record.bindTime
    bindCount++;
    itemCount += record.length;
  });

  var bindTableDecoration = new DataDecoration(reportTable, {
    id: 'tf-bind-report'
  });
  bindTableDecoration.render();

  $('#tf-bind-report').find('a').bindOriginal('click', function () {
    var anchor = $(this);
    var record = BindTable.get({'_uid':parseInt(anchor.parent().parent().children().last().html())});
    record = record.pop();
    if (anchor.hasClass('tf-view-selector')) {
      console.log(record.items);
    }
    else {
      console.log(record.fn);
    }

    return false;
  });
}
